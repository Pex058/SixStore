import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import type { PedidoWhatsApp, StatusPedido } from '../types';

const LOCAL_STORAGE_ORDERS_KEY = 'sixstore_pedidos_mock';

export function sanitizeData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        result[key] = sanitizeData(value);
      }
    }
    return result as T;
  }
  return obj;
}

const getMockPedidos = (): PedidoWhatsApp[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao carregar pedidos mock:', e);
    }
  }
  return [];
};

const saveMockPedidos = (pedidos: PedidoWhatsApp[]) => {
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(pedidos));
};

export const salvarPedidoWhatsApp = async (pedido: PedidoWhatsApp): Promise<string> => {
  const agora = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const mockId = `PED-${Math.floor(10000 + Math.random() * 90000)}`;
    const fallback: PedidoWhatsApp = {
      ...pedido,
      id: mockId,
      createdAt: agora
    };
    const pedidos = getMockPedidos();
    pedidos.unshift(fallback);
    saveMockPedidos(pedidos);
    return mockId;
  }

  try {
    const colRef = collection(db, 'pedidos_whatsapp');
    const docRef = doc(colRef);
    const novoPedido: PedidoWhatsApp = {
      ...pedido,
      id: docRef.id,
      createdAt: agora
    };

    const dadosLimpos = sanitizeData(novoPedido);
    await setDoc(docRef, dadosLimpos);
    console.log('✅ [SixStore] Pedido gravado no Firestore com sucesso! ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ [SixStore] Erro ao salvar pedido no Firestore, armazenando localmente:', error);
    const mockId = `PED-${Math.floor(10000 + Math.random() * 90000)}`;
    const fallback: PedidoWhatsApp = {
      ...pedido,
      id: mockId,
      createdAt: agora
    };
    const pedidos = getMockPedidos();
    pedidos.unshift(fallback);
    saveMockPedidos(pedidos);
    return mockId;
  }
};

export const getPedidosWhatsApp = async (): Promise<PedidoWhatsApp[]> => {
  if (!isFirebaseConfigured || !db) {
    return getMockPedidos();
  }

  try {
    const colRef = collection(db, 'pedidos_whatsapp');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as PedidoWhatsApp[];
  } catch (error) {
    console.warn('Tentando busca sem ordenação após falha inicial:', error);
    try {
      const colRef = collection(db, 'pedidos_whatsapp');
      const snapshot = await getDocs(colRef);
      const lista = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as PedidoWhatsApp[];
      return lista.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error('Erro definitivo ao buscar pedidos:', e);
      return getMockPedidos();
    }
  }
};

export const subscribePedidosWhatsApp = (
  aoAtualizar: (pedidos: PedidoWhatsApp[]) => void,
  aoErro?: (erro: any) => void
): (() => void) => {
  if (!isFirebaseConfigured || !db) {
    aoAtualizar(getMockPedidos());
    return () => {};
  }

  const colRef = collection(db, 'pedidos_whatsapp');
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const pedidos = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as PedidoWhatsApp[];
      aoAtualizar(pedidos);
    },
    (error) => {
      console.error('Erro no snapshot de pedidos:', error);
      if (aoErro) aoErro(error);
      // Fallback para get manual
      getPedidosWhatsApp().then(aoAtualizar);
    }
  );
};

export const atualizarStatusPedido = async (id: string, status: StatusPedido): Promise<void> => {
  if (!isFirebaseConfigured || !db) {
    const pedidos = getMockPedidos().map(p => p.id === id ? { ...p, status } : p);
    saveMockPedidos(pedidos);
    return;
  }

  const docRef = doc(db, 'pedidos_whatsapp', id);
  await updateDoc(docRef, { status });
};

export const gerarMensagemWhatsApp = (
  pedido: PedidoWhatsApp,
  pedidoId: string,
  telefoneLoja: string = '5511999999999'
): string => {
  const cliente = pedido.clienteNome ? pedido.clienteNome.trim() : 'Cliente Vitrine';
  
  let msg = `🛍️ *NOVO PEDIDO - SIXSTORE*\n`;
  msg += `----------------------------------------\n`;
  msg += `👤 *Cliente:* ${cliente}\n`;
  msg += `📌 *Pedido ID:* #${pedidoId}\n\n`;
  msg += `🛒 *ITENS SELECIONADOS:*\n`;

  pedido.itens.forEach(item => {
    const subtotal = (item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',');
    const precoUnit = item.precoUnitario.toFixed(2).replace('.', ',');
    msg += `• ${item.quantidade}x ${item.nome}\n`;
    msg += `   (Cor: ${item.cor} | Tam: ${item.tamanho}) - R$ ${precoUnit} un = R$ ${subtotal}\n`;
  });

  const totalFormatado = pedido.valorTotal.toFixed(2).replace('.', ',');
  msg += `\n💰 *VALOR TOTAL:* R$ ${totalFormatado}\n`;
  msg += `----------------------------------------\n`;

  if (pedido.origem?.ref || pedido.origem?.utmSource || pedido.origem?.utmCampaign) {
    const ref = pedido.origem.ref || pedido.origem.utmSource || 'Direto';
    const camp = pedido.origem.utmCampaign ? ` (${pedido.origem.utmCampaign})` : '';
    msg += `📍 *Origem:* ${ref}${camp}\n`;
  }

  if (pedido.observacoes && pedido.observacoes.trim() !== '') {
    msg += `📝 *Obs:* ${pedido.observacoes.trim()}\n`;
  }

  const encodedMsg = encodeURIComponent(msg);
  const cleanPhone = telefoneLoja.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
};
