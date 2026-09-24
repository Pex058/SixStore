import React from 'react';
import { ShoppingBag, Search, Sparkles, UserCheck, Shield } from 'lucide-react';

interface HeaderProps {
  busca: string;
  setBusca: (val: string) => void;
  categoriaSelecionada: string;
  setCategoriaSelecionada: (cat: string) => void;
  categorias: string[];
  totalCarrinho: number;
  abrirCarrinho: () => void;
  modoAdmin: boolean;
  setModoAdmin: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  busca,
  setBusca,
  categoriaSelecionada,
  setCategoriaSelecionada,
  categorias,
  totalCarrinho,
  abrirCarrinho,
  modoAdmin,
  setModoAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Frete Fixo R$ 19,90 para todo o Brasil | Envio Imediato via WhatsApp</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setBusca(''); setCategoriaSelecionada('Todas'); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-rose-200">
              S6
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-serif">
                SIX<span className="text-rose-700">STORE</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Moda & Vestuário Premium</p>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Buscar por vestido, blusa, calça..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-transparent rounded-full focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Toggle Painel Admin */}
            <button
              onClick={() => setModoAdmin(!modoAdmin)}
              className={`p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                modoAdmin 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={modoAdmin ? "Voltar para Vitrine Pública" : "Acessar Painel Administrativo"}
            >
              {modoAdmin ? <UserCheck className="w-4 h-4 text-amber-700" /> : <Shield className="w-4 h-4 text-slate-500" />}
              <span className="hidden sm:inline">{modoAdmin ? 'Painel Admin' : 'Admin'}</span>
            </button>

            {/* Ícone do Carrinho */}
            <button
              onClick={abrirCarrinho}
              className="relative p-2.5 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded-full transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              aria-label="Abrir Carrinho"
            >
              <ShoppingBag className="w-5 h-5 text-rose-700" />
              {totalCarrinho > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                  {totalCarrinho}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="mt-3 md:hidden relative">
          <input
            type="text"
            placeholder="Buscar peças..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:bg-white focus:border-rose-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
        </div>

        {/* Categorias Pills */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categorias.map(cat => {
            const ativa = categoriaSelecionada === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaSelecionada(cat)}
                className={`px-3.5 py-1.5 text-xs rounded-full font-medium whitespace-nowrap transition-all ${
                  ativa
                    ? 'bg-rose-800 text-white shadow-sm shadow-rose-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
