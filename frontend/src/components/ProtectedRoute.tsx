import React, { useState } from 'react';
import type { Produto } from '../types';
import { ProductForm } from './Admin/ProductForm';
import { OrdersList } from './Admin/OrdersList';
import { CampaignLinks } from './Admin/CampaignLinks';
import { deletarProduto } from '../services/products';
import { Shield, Lock, Plus, Edit, Trash2, ArrowLeft, LogOut } from 'lucide-react';

interface AdminDashboardProps {
  produtos: Produto[];
  recarregarProdutos: () => void;
  aoSair: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  produtos,
  recarregarProdutos,
  aoSair
}) => {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'pedidos' | 'links'>('produtos');
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aceita a senha padrão 'admin123' para o modo dev/demo
    if (senha === 'admin123' || senha === 'sixstore') {
      setAutenticado(true);
    } else {
      alert('Senha incorreta! (Senha demo: admin123)');
    }
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await deletarProduto(id);
      recarregarProdutos();
    }
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-rose-100 text-rose-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-serif">Acesso Administrativo</h2>
            <p className="text-xs text-slate-500">SixStore - Painel de Controle de Roupas & Pedidos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Senha de Acesso Admin</label>
              <input
                type="password"
                required
                placeholder="Digite a senha (demo: admin123)"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl focus:border-rose-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-rose-800 hover:bg-rose-900 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> Entrar no Painel
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={aoSair}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para a Vitrine Pública
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Topbar Admin */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Painel Administrativo - SixStore</h2>
              <p className="text-xs text-slate-500">Gestão de Catálogo, Pedidos WhatsApp & Rastreamento UTM</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={aoSair}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Ver Vitrine
            </button>
            <button
              onClick={() => setAutenticado(false)}
              className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>

        {/* Abas do Dashboard */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setAbaAtiva('produtos')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              abaAtiva === 'produtos' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            👗 Gestão de Roupas ({produtos.length})
          </button>
          <button
            onClick={() => setAbaAtiva('pedidos')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              abaAtiva === 'pedidos' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            🛒 Pedidos WhatsApp & Carrinhos
          </button>
          <button
            onClick={() => setAbaAtiva('links')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
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
                className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
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
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        onClick={() => handleDeletar(p.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-lg flex items-center gap-1"
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
