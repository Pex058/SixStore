import React, { useState, useEffect } from 'react';
import type { Produto, ItemCarrinho } from '../types';
import { X, ShoppingBag, Check, Plus, Minus, Info } from 'lucide-react';

interface ProductModalProps {
  produto: Produto | null;
  aoFechar: () => void;
  aoAdicionarAoCarrinho: (item: ItemCarrinho) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  produto,
  aoFechar,
  aoAdicionarAoCarrinho
}) => {
  const [fotoSelecionada, setFotoSelecionada] = useState<string>('');
  const [corSelecionada, setCorSelecionada] = useState<string>('');
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [erroForm, setErroForm] = useState<string>('');
  const [adicionadoSucesso, setAdicionadoSucesso] = useState<boolean>(false);

  useEffect(() => {
    if (produto) {
      setFotoSelecionada(produto.fotos && produto.fotos.length > 0 ? produto.fotos[0] : '');
      setCorSelecionada(produto.variacoes.cores && produto.variacoes.cores.length > 0 ? produto.variacoes.cores[0] : '');
      setTamanhoSelecionado(produto.variacoes.tamanhos && produto.variacoes.tamanhos.length > 0 ? produto.variacoes.tamanhos[0] : '');
      setQuantidade(1);
      setErroForm('');
      setAdicionadoSucesso(false);

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
    }
  }, [produto, aoFechar]);

  if (!produto) return null;

  const temPromocao = Boolean(produto.precoPromocional && produto.precoPromocional < produto.precoBase);
  const precoUnitario = temPromocao ? produto.precoPromocional! : produto.precoBase;

  const handleAdicionar = () => {
    if (!corSelecionada) {
      setErroForm('Por favor, selecione uma cor.');
      return;
    }
    if (!tamanhoSelecionado) {
      setErroForm('Por favor, selecione um tamanho.');
      return;
    }

    setErroForm('');
    
    const item: ItemCarrinho = {
      produtoId: produto.id,
      nome: produto.nome,
      foto: fotoSelecionada || (produto.fotos ? produto.fotos[0] : ''),
      cor: corSelecionada,
      tamanho: tamanhoSelecionado,
      quantidade: quantidade,
      precoUnitario: precoUnitario
    };

    aoAdicionarAoCarrinho(item);
    setAdicionadoSucesso(true);
    setTimeout(() => {
      setAdicionadoSucesso(false);
      aoFechar();
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
      onClick={aoFechar}
    >
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 rounded-full shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Galeria de Fotos */}
          <div className="p-6 bg-slate-50 flex flex-col items-center justify-center">
            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md bg-white">
              <img
                src={fotoSelecionada || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80'}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {produto.fotos && produto.fotos.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-1">
                {produto.fotos.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFotoSelecionada(f)}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all ${
                      fotoSelecionada === f ? 'border-rose-600 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={f} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações e Seletores */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                {produto.categorias.join(' • ')}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {produto.nome}
              </h2>

              {/* Preços */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-slate-900">
                  R$ {precoUnitario.toFixed(2).replace('.', ',')}
                </span>
                {temPromocao && (
                  <span className="text-sm text-slate-400 line-through">
                    R$ {produto.precoBase.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              {/* Descrição curta */}
              <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-3">
                {produto.descricao}
              </p>

              <hr className="my-5 border-slate-100" />

              {/* Seletor de Cores */}
              {produto.variacoes.cores && produto.variacoes.cores.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Cor: <span className="text-rose-700 font-semibold">{corSelecionada}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {produto.variacoes.cores.map(cor => (
                      <button
                        key={cor}
                        onClick={() => { setCorSelecionada(cor); setErroForm(''); }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          corSelecionada === cor
                            ? 'border-rose-700 bg-rose-50 text-rose-800 shadow-sm ring-2 ring-rose-200'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {cor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seletor de Tamanhos */}
              {produto.variacoes.tamanhos && produto.variacoes.tamanhos.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tamanho: <span className="text-rose-700 font-semibold">{tamanhoSelecionado}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {produto.variacoes.tamanhos.map(tam => (
                      <button
                        key={tam}
                        onClick={() => { setTamanhoSelecionado(tam); setErroForm(''); }}
                        className={`min-w-10 h-10 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center ${
                          tamanhoSelecionado === tam
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                            : 'border-slate-200 text-slate-700 hover:border-slate-400 bg-white'
                        }`}
                      >
                        {tam}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seletor de Quantidade */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quantidade:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-slate-100 flex items-center justify-center text-slate-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 text-sm">
                      {quantidade}
                    </span>
                    <button
                      onClick={() => setQuantidade(quantidade + 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-slate-100 flex items-center justify-center text-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Subtotal: <strong className="text-slate-900 font-bold">R$ {(precoUnitario * quantidade).toFixed(2).replace('.', ',')}</strong>
                  </span>
                </div>
              </div>

              {erroForm && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{erroForm}</span>
                </div>
              )}
            </div>

            {/* Botão de Ação */}
            <div className="mt-6">
              <button
                onClick={handleAdicionar}
                disabled={adicionadoSucesso}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                  adicionadoSucesso
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-200 hover:shadow-xl'
                }`}
              >
                {adicionadoSucesso ? (
                  <>
                    <Check className="w-5 h-5" /> Adicionado ao Carrinho!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Adicionar ao Carrinho • R$ {(precoUnitario * quantidade).toFixed(2).replace('.', ',')}
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
