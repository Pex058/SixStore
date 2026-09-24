import React, { useState, useEffect } from 'react';
import type { ItemCarrinho, OrigemLead } from '../types';
import { salvarPedidoWhatsApp, gerarMensagemWhatsApp } from '../services/orders';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';

interface CartDrawerProps {
  aberto: boolean;
  aoFechar: () => void;
  itens: ItemCarrinho[];
  atualizarQuantidade: (produtoId: string, cor: string, tamanho: string, delta: number) => void;
  removerItem: (produtoId: string, cor: string, tamanho: string) => void;
  limparCarrinho: () => void;
  valorTotal: number;
  origemLead: OrigemLead;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  aberto,
  aoFechar,
  itens,
  atualizarQuantidade,
  removerItem,
  limparCarrinho,
  valorTotal,
  origemLead
}) => {
  if (!aberto) return null;

  const [clienteNome, setClienteNome] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!aberto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        aoFechar();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [aberto, aoFechar]);

  const telefoneLoja = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';

  const handleFinalizarWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itens.length === 0) return;

    setEnviando(true);
    try {
      const pedidoData = {
        clienteNome: clienteNome.trim() || 'Cliente Vitrine',
        observacoes: observacoes.trim(),
        itens: itens,
        valorTotal: valorTotal,
        origem: origemLead,
        status: 'pendente' as const,
        createdAt: new Date().toISOString()
      };

      // 1. Gravação Anti-Perda no Firestore / Storage local
      const pedidoId = await salvarPedidoWhatsApp(pedidoData);

      // 2. Geração de Link Formatado do WhatsApp
      const urlWhatsApp = gerarMensagemWhatsApp(pedidoData, pedidoId, telefoneLoja);

      // 3. Limpar carrinho e abrir WhatsApp
      limparCarrinho();
      aoFechar();

      window.open(urlWhatsApp, '_blank');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Ocorreu um erro ao processar seu pedido. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end transition-opacity cursor-pointer"
      onClick={aoFechar}
    >
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Topo do Drawer */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <ShoppingBag className="w-5 h-5 text-rose-700" />
            <span>Meu Carrinho</span>
            <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              {itens.reduce((acc, i) => acc + i.quantidade, 0)} itens
            </span>
          </div>
          <button
            onClick={aoFechar}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            title="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Central - Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {itens.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-16 h-16 stroke-1 text-slate-300 mb-3" />
              <p className="font-semibold text-slate-700 text-base">Seu carrinho está vazio</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Navegue pela nossa vitrine e selecione suas roupas favoritas com tamanho e cor!
              </p>
              <button
                onClick={aoFechar}
                className="mt-5 px-5 py-2.5 bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md hover:bg-rose-800 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continuar Comprando
              </button>
            </div>
          ) : (
            itens.map((item, index) => (
              <div key={`${item.produtoId}_${item.cor}_${item.tamanho}_${index}`} className="py-4 flex gap-3.5 items-center">
                {/* Foto Miniatura */}
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm">
                  <img src={item.foto} alt={item.nome} className="w-full h-full object-cover" />
                </div>

                {/* Detalhes do Item */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">{item.nome}</h4>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium">Cor: {item.cor}</span>
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium">Tam: {item.tamanho}</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">
                    R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                  </div>
                </div>

                {/* Controles de Quantidade & Lixeira */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removerItem(item.produtoId, item.cor, item.tamanho)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    title="Remover Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      onClick={() => atualizarQuantidade(item.produtoId, item.cor, item.tamanho, -1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => atualizarQuantidade(item.produtoId, item.cor, item.tamanho, 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé - Formulário & Botão Checkout WhatsApp */}
        {itens.length > 0 && (
          <form onSubmit={handleFinalizarWhatsApp} className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
            
            {/* Input Nome do Cliente */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Seu Nome (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: Maria Silva"
                value={clienteNome}
                onChange={e => setClienteNome(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
              />
            </div>

            {/* Input Observações */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Observações de Entrega/Dúvidas:
              </label>
              <input
                type="text"
                placeholder="Ex: Preferência para entrega no período da tarde"
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
              />
            </div>

            {/* Totalizador */}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-600 uppercase">Subtotal do Pedido:</span>
              <span className="text-xl font-black text-slate-900">
                R$ {valorTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Indicador de Segurança Anti-Perda */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pedido pré-salvo com segurança. Finalização rápida no WhatsApp!</span>
            </div>

            {/* Botão Finalizar Pedido */}
            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>{enviando ? 'Gravando Pedido...' : 'Enviar Pedido pelo WhatsApp'}</span>
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </button>

            {/* Botão Continuar Comprando */}
            <button
              type="button"
              onClick={aoFechar}
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Continuar Comprando</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
