import React from 'react';
import type { Produto } from '../types';
import { ShoppingBag, Eye, Tag } from 'lucide-react';

interface ProductCardProps {
  produto: Produto;
  aoSelecionar: (produto: Produto) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ produto, aoSelecionar }) => {
  const temPromocao = Boolean(produto.precoPromocional && produto.precoPromocional < produto.precoBase);
  const precoAtual = temPromocao ? produto.precoPromocional! : produto.precoBase;
  
  const descontoPercentual = temPromocao
    ? Math.round(((produto.precoBase - produto.precoPromocional!) / produto.precoBase) * 100)
    : 0;

  const fotoPrincipal = produto.fotos && produto.fotos.length > 0
    ? produto.fotos[0]
    : 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      onClick={() => aoSelecionar(produto)}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative transform hover:-translate-y-1"
    >
      {/* Imagem do Produto */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={fotoPrincipal}
          alt={produto.nome}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Flutuantes */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {temPromocao && (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              -{descontoPercentual}% OFF
            </span>
          )}
          {produto.destaque && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              Destaque
            </span>
          )}
        </div>

        {/* Botão Flutuante de Espiada Rápida */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-4 h-4 text-rose-600" /> Ver Detalhes & Cores
          </span>
        </div>
      </div>

      {/* Detalhes do Produto */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Categorias */}
          <div className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider mb-1">
            {produto.categorias.join(' • ')}
          </div>

          {/* Nome */}
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-1 group-hover:text-rose-700 transition-colors">
            {produto.nome}
          </h3>

          {/* Opções de Tamanhos Disponíveis */}
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {produto.variacoes.tamanhos.slice(0, 5).map(tam => (
              <span key={tam} className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">
                {tam}
              </span>
            ))}
            {produto.variacoes.cores.length > 0 && (
              <span className="text-[10px] text-slate-400 font-medium ml-1">
                +{produto.variacoes.cores.length} cores
              </span>
            )}
          </div>
        </div>

        {/* Preço e Ação */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {temPromocao && (
              <span className="text-xs text-slate-400 line-through block">
                R$ {produto.precoBase.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="text-base sm:text-lg font-extrabold text-slate-900">
              R$ {precoAtual.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              aoSelecionar(produto);
            }}
            className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-700 hover:text-white rounded-xl transition-all shadow-sm"
            title="Adicionar ao Carrinho"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
