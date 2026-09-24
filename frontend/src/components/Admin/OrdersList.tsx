import React, { useState, useEffect } from 'react';
import type { PedidoWhatsApp, StatusPedido } from '../../types';
import { getPedidosWhatsApp, subscribePedidosWhatsApp, atualizarStatusPedido } from '../../services/orders';
import { ShoppingBag, RefreshCw, MessageSquare, Clock, CheckCircle2, XCircle, Filter, ExternalLink } from 'lucide-react';

export const OrdersList: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoWhatsApp[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const carregarPedidos = async () => {
    setCarregando(true);
    try {
      const dados = await getPedidosWhatsApp();
      setPedidos(dados);
    } catch (e) {
      console.error('Erro ao carregar pedidos:', e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    setCarregando(true);
    const unsubscribe = subscribePedidosWhatsApp(
      (novosPedidos) => {
        setPedidos(novosPedidos);
        setCarregando(false);
      },
      (erro) => {
        console.warn('Fallback no listener de pedidos:', erro);
        carregarPedidos();
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleMudarStatus = async (id: string, novoStatus: StatusPedido) => {
    try {
      await atualizarStatusPedido(id, novoStatus);
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: novoStatus } : p));
    } catch (e) {
      console.error('Erro ao mudar status:', e);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroStatus === 'todos') return true;
    return p.status === filtroStatus;
  });

  const getStatusBadge = (status: StatusPedido) => {
    switch (status) {
      case 'pendente':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3 text-amber-700" /> Pendente</span>;
      case 'em_atendimento':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><MessageSquare className="w-3 h-3 text-blue-700" /> Em Atendimento</span>;
      case 'concluido':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-700" /> Concluído</span>;
      case 'cancelado':
        return <span className="bg-red-100 text-red-900 border border-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3 text-red-700" /> Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-700" />
            <span>Pedidos WhatsApp (Registro Anti-Perda)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Carrinhos finalizados pelos clientes na vitrine para acompanhamento em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={carregarPedidos}
            className="p-2 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded-lg transition-all"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {['todos', 'pendente', 'em_atendimento', 'concluido'].map(st => (
              <button
                key={st}
                onClick={() => setFiltroStatus(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  filtroStatus === st ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {carregando ? (
        <div className="p-8 text-center text-slate-400 text-xs">Carregando pedidos...</div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <ShoppingBag className="w-12 h-12 stroke-1 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-600">Nenhum pedido encontrado</p>
          <p className="text-xs text-slate-400">Os carrinhos salvos aparecerão nesta lista.</p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {pedidosFiltrados.map(pedido => (
            <div key={pedido.id} className="py-4 space-y-3 hover:bg-slate-50/50 p-3 rounded-xl transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-slate-900">#{pedido.id}</span>
                  {getStatusBadge(pedido.status)}
                  <span className="text-[11px] text-slate-400">
                    {new Date(pedido.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Alteração de Status */}
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Mudar Status:</label>
                  <select
                    value={pedido.status}
                    onChange={e => handleMudarStatus(pedido.id!, e.target.value as StatusPedido)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white font-medium outline-none"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Cliente & Origem UTM */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-700 bg-slate-100/70 p-2.5 rounded-lg">
                <div>
                  👤 <strong>Cliente:</strong> {pedido.clienteNome || 'Cliente Anônimo'}
                  {pedido.observacoes && (
                    <span className="block text-slate-500 text-[11px] mt-0.5">📝 Obs: {pedido.observacoes}</span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-rose-600" />
                  <span>Origem: <strong>{pedido.origem?.ref || pedido.origem?.utmSource || 'Acesso Direto'}</strong></span>
                  {pedido.origem?.utmCampaign && (
                    <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px]">
                      {pedido.origem.utmCampaign}
                    </span>
                  )}
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="space-y-1">
                {pedido.itens.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      • {item.quantidade}x <strong>{item.nome}</strong> (Cor: {item.cor} | Tam: {item.tamanho})
                    </span>
                    <span className="font-semibold text-slate-800">
                      R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total do Pedido */}
              <div className="text-right pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-500">Valor Total do Pedido: </span>
                <span className="text-sm font-black text-rose-700">
                  R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
