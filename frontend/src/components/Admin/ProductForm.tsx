import React, { useState, useEffect } from 'react';
import type { Produto } from '../../types';
import { salvarProduto } from '../../services/products';
import { X, Plus, Trash2, Check, Package, Image, DollarSign, Tag } from 'lucide-react';

interface ProductFormProps {
  produtoParaEditar?: Produto | null;
  aoFechar: () => void;
  aoSalvarSucesso: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  produtoParaEditar,
  aoFechar,
  aoSalvarSucesso
}) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoBase, setPrecoBase] = useState('');
  const [precoPromocional, setPrecoPromocional] = useState('');
  const [categorias, setCategorias] = useState<string[]>(['Feminino']);
  const [novaCategoria, setNovaCategoria] = useState('');
  
  const [fotos, setFotos] = useState<string[]>([]);
  const [novaFoto, setNovaFoto] = useState('');

  const [cores, setCores] = useState<string[]>(['Preto', 'Off-White']);
  const [novaCor, setNovaCor] = useState('');

  const [tamanhos, setTamanhos] = useState<string[]>(['P', 'M', 'G']);
  const [novoTamanho, setNovoTamanho] = useState('');

  const [ativo, setAtivo] = useState(true);
  const [destaque, setDestaque] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome);
      setDescricao(produtoParaEditar.descricao);
      setPrecoBase(produtoParaEditar.precoBase.toString());
      setPrecoPromocional(produtoParaEditar.precoPromocional ? produtoParaEditar.precoPromocional.toString() : '');
      setCategorias(produtoParaEditar.categorias || ['Feminino']);
      setFotos(produtoParaEditar.fotos || []);
      setCores(produtoParaEditar.variacoes.cores || []);
      setTamanhos(produtoParaEditar.variacoes.tamanhos || []);
      setAtivo(produtoParaEditar.ativo);
      setDestaque(Boolean(produtoParaEditar.destaque));
    }
  }, [produtoParaEditar]);

  const addCategoria = () => {
    if (novaCategoria.trim() && !categorias.includes(novaCategoria.trim())) {
      setCategorias([...categorias, novaCategoria.trim()]);
      setNovaCategoria('');
    }
  };

  const removeCategoria = (cat: string) => {
    setCategorias(categorias.filter(c => c !== cat));
  };

  const addFoto = () => {
    if (novaFoto.trim() && !fotos.includes(novaFoto.trim())) {
      setFotos([...fotos, novaFoto.trim()]);
      setNovaFoto('');
    }
  };

  const removeFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const addCor = () => {
    if (novaCor.trim() && !cores.includes(novaCor.trim())) {
      setCores([...cores, novaCor.trim()]);
      setNovaCor('');
    }
  };

  const removeCor = (cor: string) => {
    setCores(cores.filter(c => c !== cor));
  };

  const addTamanho = () => {
    if (novoTamanho.trim() && !tamanhos.includes(novoTamanho.trim())) {
      setTamanhos([...tamanhos, novoTamanho.trim()]);
      setNovoTamanho('');
    }
  };

  const removeTamanho = (tam: string) => {
    setTamanhos(tamanhos.filter(t => t !== tam));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !precoBase) {
      alert('Preencha o nome e o preço base do produto.');
      return;
    }

    setSalvando(true);
    try {
      const novoProduto: Produto = {
        id: produtoParaEditar?.id || `prod_${Date.now()}`,
        nome: nome.trim(),
        descricao: descricao.trim(),
        precoBase: parseFloat(precoBase.replace(',', '.')),
        precoPromocional: precoPromocional ? parseFloat(precoPromocional.replace(',', '.')) : undefined,
        categorias: categorias.length > 0 ? categorias : ['Geral'],
        fotos: fotos.length > 0 ? fotos : ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
        variacoes: {
          cores,
          tamanhos
        },
        ativo,
        destaque,
        createdAt: produtoParaEditar?.createdAt || new Date().toISOString()
      };

      await salvarProduto(novoProduto);
      aoSalvarSucesso();
      aoFechar();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-rose-700" />
            <h2 className="text-xl font-bold text-slate-900">
              {produtoParaEditar ? 'Editar Roupa / Produto' : 'Cadastrar Nova Roupa'}
            </h2>
          </div>
          <button onClick={aoFechar} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome do Produto *</label>
            <input
              type="text"
              required
              placeholder="Ex: Vestido Midi Linho Terracota"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição Detalhada</label>
            <textarea
              rows={3}
              placeholder="Detalhes sobre o tecido, modelagem, dicas de conservação..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
            />
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preço Original (R$) *</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="249.90"
                  value={precoBase}
                  onChange={e => setPrecoBase(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                />
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preço Promocional (Opcional)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="199.90"
                  value={precoPromocional}
                  onChange={e => setPrecoPromocional(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                />
                <Tag className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categorias</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ex: Vestidos, Feminino, Promoção"
                value={novaCategoria}
                onChange={e => setNovaCategoria(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategoria())}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={addCategoria}
                className="px-3 py-1.5 bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categorias.map(cat => (
                <span key={cat} className="bg-rose-50 text-rose-800 border border-rose-200 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  {cat}
                  <button type="button" onClick={() => removeCategoria(cat)} className="hover:text-red-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Variações de Cor</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ex: Terracota, Off-White, Preto"
                value={novaCor}
                onChange={e => setNovaCor(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCor())}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={addCor}
                className="px-3 py-1.5 bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cores.map(cor => (
                <span key={cor} className="bg-slate-100 text-slate-800 border border-slate-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                  {cor}
                  <button type="button" onClick={() => removeCor(cor)} className="hover:text-red-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tamanhos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Variações de Tamanhos</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ex: PP, P, M, G, GG"
                value={novoTamanho}
                onChange={e => setNovoTamanho(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTamanho())}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={addTamanho}
                className="px-3 py-1.5 bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tamanhos.map(tam => (
                <span key={tam} className="bg-slate-900 text-white font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                  {tam}
                  <button type="button" onClick={() => removeTamanho(tam)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Fotos URLs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URLs das Fotos (Imagens)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder="https://exemplo.com/foto.jpg"
                value={novaFoto}
                onChange={e => setNovaFoto(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFoto())}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={addFoto}
                className="px-3 py-1.5 bg-rose-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
              >
                <Image className="w-3.5 h-3.5" /> Incluir
              </button>
            </div>
            {fotos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {fotos.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkboxes Destaque / Ativo */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={ativo}
                onChange={e => setAtivo(e.target.checked)}
                className="w-4 h-4 rounded text-rose-700 focus:ring-rose-500"
              />
              <span>Produto Ativo na Vitrine</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={destaque}
                onChange={e => setDestaque(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span>Destacar na Página Inicial</span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={aoFechar}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{salvando ? 'Salvando...' : 'Salvar Produto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
