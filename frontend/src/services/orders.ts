import { db, isFirebaseConfigured } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import type { PedidoWhatsApp, StatusPedido } from '../types';

const LOCAL_STORAGE_ORDERS_KEY = 'sixstore_pedidos_mock';

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
  const novoPedido: PedidoWhatsApp = {
    ...pedido,
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured || !db) {
    const mockId = `PED-${Math.floor(10000 + Math.random() * 90000)}`;
    novoPedido.id = mockId;
    const pedidos = getMockPedidos();
    pedidos.unshift(novoPedido);
    saveMockPedidos(pedidos);
    return mockId;
  }

  try {
    const colRef = collection(db, 'pedidos_whatsapp');
    const docRef = await addDoc(colRef, novoPedido);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar pedido no Firestore:', error);
    const mockId = `PED-${Math.floor(10000 + Math.random() * 90000)}`;
    novoPedido.id = mockId;
    const pedidos = getMockPedidos();
    pedidos.unshift(novoPedido);
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
    console.error('Erro ao buscar pedidos:', error);
    return getMockPedidos();
  }
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
