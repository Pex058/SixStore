import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { sanitizeData } from './orders';
import type { Produto } from '../types';

export const MOCK_PRODUTOS: Produto[] = [
  {
    id: 'prod_1',
    nome: 'Vestido Midi Alfaiataria Linho',
    descricao: 'Vestido midi confeccionado em tecido nobre de linho com algodão, abotoamento frontal e cinto para marcação de cintura. Caimento impecável para ocasiões casuais e formais.',
    precoBase: 289.90,
    precoPromocional: 229.90,
    categorias: ['Vestidos', 'Feminino', 'Lançamentos'],
    fotos: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ],
    variacoes: {
      cores: ['Terracota', 'Off-White', 'Preto'],
      tamanhos: ['P', 'M', 'G', 'GG']
    },
    estoque: {
      'P_Terracota': 5,
      'M_Terracota': 8,
      'G_Terracota': 2,
      'P_Off-White': 4,
      'M_Off-White': 6,
      'G_Off-White': 3,
      'P_Preto': 10,
      'M_Preto': 7,
      'G_Preto': 4
    },
    ativo: true,
    destaque: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_2',
    nome: 'Blusa Manga Longa Seda Premium',
    descricao: 'Blusa feminina em tecido toque de seda pura, gola alta com amarração e punhos detalhados. Peça chave versátil e elegante.',
    precoBase: 189.90,
    precoPromocional: 149.90,
    categorias: ['Blusas', 'Feminino', 'Promoção'],
    fotos: [
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80'
    ],
    variacoes: {
      cores: ['Preto', 'Nude', 'Verde Esmeralda'],
      tamanhos: ['PP', 'P', 'M', 'G']
    },
    estoque: {
      'P_Preto': 6,
      'M_Preto': 5,
      'P_Nude': 3,
      'M_Nude': 4
    },
    ativo: true,
    destaque: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_3',
    nome: 'Calça Alfaiataria Cós Alto com Cinto',
    descricao: 'Calça de alfaiataria feminina com modelagem reta, bolsos faca e cinto encapado no mesmo tecido. Conforto e sofisticação.',
    precoBase: 249.90,
    precoPromocional: 199.90,
    categorias: ['Calças', 'Feminino'],
    fotos: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'
    ],
    variacoes: {
      cores: ['Bege', 'Preto', 'Azul Marinho'],
      tamanhos: ['P', 'M', 'G']
    },
    estoque: {
      'P_Bege': 4,
      'M_Bege': 6,
      'G_Bege': 2,
      'P_Preto': 5,
      'M_Preto': 5
    },
    ativo: true,
    destaque: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_4',
    nome: 'Camisa Masculina Linho Slim Fit',
    descricao: 'Camisa social masculina confeccionada em linho leve com corte slim fit moderno e respirável. Ideal para dias quentes e visuais elegantes.',
    precoBase: 219.90,
    precoPromocional: 179.90,
    categorias: ['Masculino', 'Camisas', 'Lançamentos'],
    fotos: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    variacoes: {
      cores: ['Branco', 'Azul Claro', 'Caqui'],
      tamanhos: ['P', 'M', 'G', 'GG']
    },
    estoque: {
      'M_Branco': 8,
      'G_Branco': 5,
      'M_Azul Claro': 6,
      'G_Azul Claro': 4
    },
    ativo: true,
    destaque: true,
    createdAt: new Date().toISOString()
  }
];

const LOCAL_STORAGE_KEY = 'sixstore_produtos_mock';

const getMockProdutos = (): Produto[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao ler produtos locais:', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_PRODUTOS));
  return MOCK_PRODUTOS;
};

const saveMockProdutos = (produtos: Produto[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(produtos));
};

export const getProdutos = async (): Promise<Produto[]> => {
  if (!isFirebaseConfigured || !db) {
    return getMockProdutos();
  }

  try {
    const colRef = collection(db, 'produtos');
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      return getMockProdutos();
    }

    const produtos = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Produto[];

    return produtos.sort((a, b) => {
      const dataA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dataB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dataB - dataA;
    });
  } catch (error) {
    console.error('Erro ao carregar produtos do Firestore:', error);
    return getMockProdutos();
  }
};

export const subscribeProdutos = (
  aoAtualizar: (produtos: Produto[]) => void,
  aoErro?: (erro: any) => void
): (() => void) => {
  if (!isFirebaseConfigured || !db) {
    aoAtualizar(getMockProdutos());
    return () => {};
  }

  const colRef = collection(db, 'produtos');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        aoAtualizar(getMockProdutos());
        return;
      }
      const produtos = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Produto[];

      produtos.sort((a, b) => {
        const dataA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dataB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dataB - dataA;
      });

      aoAtualizar(produtos);
    },
    (error) => {
      console.error('Erro no snapshot de produtos:', error);
      if (aoErro) aoErro(error);
      getProdutos().then(aoAtualizar);
    }
  );
};

export const salvarProduto = async (produto: Produto): Promise<void> => {
  if (!isFirebaseConfigured || !db) {
    const produtos = getMockProdutos();
    const index = produtos.findIndex(p => p.id === produto.id);
    if (index >= 0) {
      produtos[index] = produto;
    } else {
      produtos.unshift(produto);
    }
    saveMockProdutos(produtos);
    return;
  }

  const docRef = doc(db, 'produtos', produto.id);
  const produtoLimpo = sanitizeData(produto);
  await setDoc(docRef, produtoLimpo, { merge: true });
};

export const deletarProduto = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) {
    const produtos = getMockProdutos().filter(p => p.id !== id);
    saveMockProdutos(produtos);
    return;
  }

  const docRef = doc(db, 'produtos', id);
  await deleteDoc(docRef);
};
