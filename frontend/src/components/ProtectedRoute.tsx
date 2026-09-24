import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import type { Produto } from '../types';
import { ProductForm } from './Admin/ProductForm';
import { OrdersList } from './Admin/OrdersList';
import { CampaignLinks } from './Admin/CampaignLinks';
import { deletarProduto } from '../services/products';
import { 
  loginAdminComGoogle, 
  logoutAdmin, 
  monitorarAuthAdmin, 
  ADMIN_AUTHORIZED_EMAILS 
} from '../services/auth';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  LogOut, 
  AlertTriangle,
  Loader2,
  CheckCircle,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  produtos: Produto[];
  recarregarProdutos: () => void;
  aoSair: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  produtos,
  recarregarProdutos,
  aoSair
}) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);
  const [entrando, setEntrando] = useState(false);
  const [erroAuth, setErroAuth] = useState<string | null>(null);

  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'pedidos' | 'links'>('produtos');
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  useEffect(() => {
    const unsubscribe = monitorarAuthAdmin(
      (user) => {
        setUsuario(user);
        setCarregandoAuth(false);
        if (user) {
          setErroAuth(null);
        }
      },
      (msgErro) => {
        setErroAuth(msgErro);
        setCarregandoAuth(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLoginGoogle = async () => {
    setEntrando(true);
    setErroAuth(null);
    try {
      const user = await loginAdminComGoogle();
      setUsuario(user);
    } catch (err: any) {
      console.error('Erro ao autenticar com Google:', err);
      setErroAuth(err.message || 'Falha ao autenticar via Google.');
    } finally {
      setEntrando(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setUsuario(null);
      aoSair();
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await deletarProduto(id);
      recarregarProdutos();
    }
  };

  // Estado inicial de verificação de autenticação
  if (carregandoAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
        <p className="text-sm font-semibold text-slate-300">Verificando credenciais de acesso...</p>
      </div>
    );
  }

  // Tela de Login com Conta Google
  if (!usuario) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-950/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 relative z-10 border border-slate-100">
          
          {/* Logo e Cabeçalho */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-800 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-8 h-8 text-rose-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-serif tracking-tight">Painel Administrativo</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              SixStore • Acesso restrito para gestão de catálogo, pedidos WhatsApp e UTMs.
            </p>
          </div>

          {/* Alerta de E-mail Autorizado */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Acesso Autorizado via Google</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              O acesso ao painel é exclusivo para o administrador com a conta:
            </p>
            <div className="bg-white/80 border border-amber-200 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold text-amber-950 inline-block">
              {ADMIN_AUTHORIZED_EMAILS[0]}
            </div>
          </div>

          {/* Mensagem de Erro (se houver tentativa não autorizada) */}
          {erroAuth && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-800 space-y-1 animate-in fade-in duration-200">
              <div className="font-bold flex items-center gap-1.5 text-red-700">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Acesso Recusado</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-700">
                {erroAuth}
              </p>
            </div>
          )}

          {/* Botão de Login com Google */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleLoginGoogle}
              disabled={entrando}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-60"
            >
              {entrando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
                  <span>Conectando ao Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span className="text-slate-800 group-hover:text-slate-900 font-semibold">Entrar com Conta Google</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-400">
              Autenticação segura via Firebase Authentication
            </p>
          </div>

          {/* Voltar para Vitrine */}
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              onClick={aoSair}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 mx-auto py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para a Vitrine Pública
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Dashboard Administrativo para pauloedu1985@gmail.com
  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Topbar Admin */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-800 text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 font-serif">Painel SixStore</h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Admin Ativo
                </span>
              </div>
              <p className="text-xs text-slate-500">Gestão de Catálogo, Pedidos WhatsApp & Rastreamento UTM</p>
            </div>
          </div>

          {/* Perfil do Administrador Logado */}
          <div className="flex flex-wrap items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200/70">
              {usuario.photoURL ? (
                <img 
                  src={usuario.photoURL} 
                  alt={usuario.displayName || 'Admin'} 
                  className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-700 text-white font-bold text-xs flex items-center justify-center">
                  {(usuario.email || 'A')[0].toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {usuario.displayName || 'Administrador'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {usuario.email}
                </div>
              </div>
            </div>

            <button
              onClick={aoSair}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Ver Vitrine
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-1.5 transition-all border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>

        {/* Abas do Dashboard */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setAbaAtiva('produtos')}
            className={`px-4 py-2.5 text-xs font-bold rounded-2xl transition-all shrink-0 cursor-pointer ${
              abaAtiva === 'produtos' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            👗 Gestão de Roupas ({produtos.length})
          </button>
          <button
            onClick={() => setAbaAtiva('pedidos')}
            className={`px-4 py-2.5 text-xs font-bold rounded-2xl transition-all shrink-0 cursor-pointer ${
              abaAtiva === 'pedidos' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            🛒 Pedidos WhatsApp & Carrinhos
          </button>
          <button
            onClick={() => setAbaAtiva('links')}
            className={`px-4 py-2.5 text-xs font-bold rounded-2xl transition-all shrink-0 cursor-pointer ${
              abaAtiva === 'links' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            📊 Links Rastreados (UTMs)
          </button>
        </div>

        {/* Conteúdo por Aba */}
        {abaAtiva === 'produtos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800">Catálogo de Produtos Cadastrados</h3>
              <button
                onClick={() => { setProdutoEmEdicao(null); setModalFormAberto(true); }}
                className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Cadastrar Roupa
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produtos.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 shadow-sm relative group">
                  <img
                    src={p.fotos[0]}
                    alt={p.nome}
                    className="w-24 h-32 object-cover rounded-xl bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 uppercase">{p.categorias.join(' • ')}</span>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.nome}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        R$ {(p.precoPromocional || p.precoBase).toFixed(2).replace('.', ',')}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-400">
                        Cores: {p.variacoes.cores.join(', ')} | Tam: {p.variacoes.tamanhos.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => { setProdutoEmEdicao(p); setModalFormAberto(true); }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        onClick={() => handleDeletar(p.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaAtiva === 'pedidos' && <OrdersList />}

        {abaAtiva === 'links' && <CampaignLinks />}

      </div>

      {modalFormAberto && (
        <ProductForm
          produtoParaEditar={produtoEmEdicao}
          aoFechar={() => setModalFormAberto(false)}
          aoSalvarSucesso={recarregarProdutos}
        />
      )}
    </div>
  );
};
