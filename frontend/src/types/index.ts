export interface Variacoes {
  cores: string[];
  tamanhos: string[];
}

export interface Estoque {
  [key: string]: number; // Chave ex: "P_Terracota" -> valor: 5
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  precoBase: number;
  precoPromocional?: number;
  categorias: string[];
  fotos: string[];
  variacoes: Variacoes;
  estoque?: Estoque;
  ativo: boolean;
  destaque?: boolean;
  createdAt: string;
}

export interface ItemCarrinho {
  produtoId: string;
  nome: string;
  foto: string;
  cor: string;
  tamanho: string;
  quantidade: number;
  precoUnitario: number;
}

export interface OrigemLead {
  ref?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export type StatusPedido = 'pendente' | 'em_atendimento' | 'concluido' | 'cancelado';

export interface PedidoWhatsApp {
  id?: string;
  clienteNome?: string;
  observacoes?: string;
  itens: ItemCarrinho[];
  valorTotal: number;
  origem: OrigemLead;
  status: StatusPedido;
  createdAt: string;
}

export interface LinkCampanha {
  id: string;
  nomeCampanha: string;
  slugRef: string;
  targetUrl: string;
  totalCliques: number;
  totalConversoes: number;
  createdAt: string;
}
