import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/ProtectedRoute';
import { getProdutos } from './services/products';
import { useCart } from './hooks/useCart';
import { useTracking } from './hooks/useTracking';
import type { Produto } from './types';
import { Sparkles, Heart, Shirt, ShoppingBag } from 'lucide-react';
import './App.css';

export function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');
  const [produtoModal, setProdutoModal] = useState<Produto | null>(null);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [modoAdmin, setModoAdmin] = useState(false);

  const cart = useCart();
  const origemLead = useTracking();

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const dados = await getProdutos();
      setProdutos(dados);
    } catch (e) {
      console.error('Erro ao carregar catálogo:', e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Extrair lista de categorias únicas
  const categorias = useMemo(() => {
    const lista = new Set<string>();
    lista.add('Todas');
    produtos.forEach(p => {
      p.categorias?.forEach(c => lista.add(c));
    });
    return Array.from(lista);
  }, [produtos]);

  // Filtragem de produtos por busca e categoria
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      if (!p.ativo) return false;

      const bateCategoria = categoriaSelecionada === 'Todas' || p.categorias.includes(categoriaSelecionada);
      
      const termo = busca.toLowerCase().trim();
      const bateBusca = !termo || 
        p.nome.toLowerCase().includes(termo) || 
        p.descricao.toLowerCase().includes(termo) ||
        p.categorias.some(c => c.toLowerCase().includes(termo));

      return bateCategoria && bateBusca;
    });
  }, [produtos, categoriaSelecionada, busca]);

  if (modoAdmin) {
    return (
      <AdminDashboard
        produtos={produtos}
        recarregarProdutos={carregarProdutos}
        aoSair={() => setModoAdmin(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header Principal */}
      <Header
        busca={busca}
        setBusca={setBusca}
        categoriaSelecionada={categoriaSelecionada}
        setCategoriaSelecionada={setCategoriaSelecionada}
        categorias={categorias}
        totalCarrinho={cart.totalQtd}
        abrirCarrinho={() => setCarrinhoAberto(true)}
        modoAdmin={modoAdmin}
        setModoAdmin={setModoAdmin}
      />

      {/* Hero Banner Vitrine */}
      <section className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-rose-800/60 border border-rose-700/50 px-3 py-1 rounded-full text-xs font-semibold text-rose-200 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Nova Coleção Primavera / Verão</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-serif leading-tight">
              Elegância & Estilo ao seu alcance.
            </h2>
            <p className="text-rose-100/90 text-sm sm:text-base leading-relaxed">
              Explore nossa vitrine exclusiva de vestidos, blusas e peças em alfaiataria. Escolha o tamanho, selecione a cor e faça seu pedido direto via WhatsApp.
            </p>
          </div>

          <div className="flex gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-28 shadow-xl">
              <Shirt className="w-6 h-6 text-amber-300 mx-auto mb-1" />
              <span className="text-xl font-black block">{produtos.length}</span>
              <span className="text-[10px] text-rose-200 uppercase tracking-wider">Peças Exclusivas</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-28 shadow-xl">
              <ShoppingBag className="w-6 h-6 text-emerald-300 mx-auto mb-1" />
              <span className="text-xl font-black block">100%</span>
              <span className="text-[10px] text-rose-200 uppercase tracking-wider">Checkout WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Principal da Vitrine */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Título da Seção */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {categoriaSelecionada === 'Todas' ? 'Todas as Roupas' : `Coleção: ${categoriaSelecionada}`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>
        </div>

        {/* Grid de Roupas */}
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-8">
            <Shirt className="w-16 h-16 stroke-1 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-lg">Nenhum produto encontrado</h4>
            <p className="text-xs text-slate-500 mt-1">
              Tente buscar por outros termos ou selecionar outra categoria.
            </p>
            <button
              onClick={() => { setBusca(''); setCategoriaSelecionada('Todas'); }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtosFiltrados.map(produto => (
              <ProductCard
                key={produto.id}
                produto={produto}
                aoSelecionar={p => setProdutoModal(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Modal de Detalhes do Produto */}
      <ProductModal
        produto={produtoModal}
        aoFechar={() => setProdutoModal(null)}
        aoAdicionarAoCarrinho={item => {
          cart.adicionarItem(item);
          setCarrinhoAberto(true);
        }}
      />

      {/* Drawer do Carrinho Interativo */}
      <CartDrawer
        aberto={carrinhoAberto}
        aoFechar={() => setCarrinhoAberto(false)}
        itens={cart.itens}
        atualizarQuantidade={cart.atualizarQuantidade}
        removerItem={cart.removerItem}
        limparCarrinho={cart.limparCarrinho}
        valorTotal={cart.valorTotal}
        origemLead={origemLead}
      />

      {/* Rodapé Institucional */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 border-t border-slate-800 mt-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-extrabold text-base mb-2 font-serif">SIXSTORE</h4>
            <p className="text-slate-400 leading-relaxed">
              Sua vitrine digital de moda com seleção de tamanhos e finalização instantânea via WhatsApp.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-2">Atendimento WhatsApp</h5>
            <p className="text-slate-400">Segunda a Sábado: 09h às 19h</p>
            <p className="text-rose-400 font-semibold mt-1">Dúvidas sobre tamanhos? Fale conosco!</p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-2">Segurança & Garantia</h5>
            <p className="text-slate-400">
              Ambiente protegido. Registramos seu pedido antes do redirecionamento para garantir que seu atendimento seja imediato.
            </p>
            <p className="text-slate-500 mt-2 flex items-center gap-1">
              Feito com <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> para a SixStore
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
