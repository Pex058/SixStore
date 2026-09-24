import React, { useState, useEffect } from 'react';
import type { LinkCampanha } from '../../types';
import { getLinksCampanha, criarLinkCampanha } from '../../services/tracking';
import { Link, Copy, Check, Plus, BarChart2, ExternalLink } from 'lucide-react';

export const CampaignLinks: React.FC = () => {
  const [links, setLinks] = useState<LinkCampanha[]>([]);
  const [nomeCampanha, setNomeCampanha] = useState('');
  const [slugRef, setSlugRef] = useState('');
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);

  const carregarLinks = async () => {
    try {
      const dados = await getLinksCampanha();
      setLinks(dados);
    } catch (e) {
      console.error('Erro ao carregar links:', e);
    }
  };

  useEffect(() => {
    carregarLinks();
  }, []);

  const handleCriarLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCampanha.trim() || !slugRef.trim()) return;

    setCriando(true);
    try {
      const slugLimpo = slugRef.trim().toLowerCase().replace(/\s+/g, '_');
      const novo = await criarLinkCampanha(nomeCampanha.trim(), slugLimpo);
      setLinks(prev => [novo, ...prev]);
      setNomeCampanha('');
      setSlugRef('');
    } catch (e) {
      console.error('Erro ao criar link:', e);
    } finally {
      setCriando(false);
    }
  };

  const copiarParaClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Link className="w-5 h-5 text-rose-700" />
        <div>
          <h3 className="text-lg font-bold text-slate-900">Gerador de Links Rastreados (UTMs & Origem)</h3>
          <p className="text-xs text-slate-500">
            Crie links personalizados para Instagram, Facebook, TikTok ou Influenciadores e acompanhe os pedidos.
          </p>
        </div>
      </div>

      {/* Formulário de Criação */}
      <form onSubmit={handleCriarLink} className="bg-slate-50 p-4 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome da Campanha</label>
            <input
              type="text"
              required
              placeholder="Ex: Instagram Bio Primavera"
              value={nomeCampanha}
              onChange={e => setNomeCampanha(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Identificador Slug (ref)</label>
            <input
              type="text"
              required
              placeholder="Ex: instagram_bio ou promo_tiktok"
              value={slugRef}
              onChange={e => setSlugRef(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={criando}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{criando ? 'Gerando Link...' : 'Gerar Link Rastreado'}</span>
          </button>
        </div>
      </form>

      {/* Tabela de Links */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-rose-600" /> Links Ativos & Desempenho
        </h4>

        {links.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nenhum link rastreado criado ainda.</p>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {links.map(link => (
              <div key={link.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{link.nomeCampanha}</span>
                    <span className="bg-rose-100 text-rose-800 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                      ref={link.slugRef}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1 truncate max-w-md">
                    {link.targetUrl}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <span className="text-xs font-black text-slate-800 block">{link.totalCliques}</span>
                    <span className="text-[10px] text-slate-400">Cliques</span>
                  </div>

                  <div className="text-center">
                    <span className="text-xs font-black text-emerald-600 block">{link.totalConversoes}</span>
                    <span className="text-[10px] text-slate-400">Vendas</span>
                  </div>

                  <button
                    onClick={() => copiarParaClipboard(link.targetUrl, link.id)}
                    className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 rounded-lg text-slate-600 transition-colors flex items-center gap-1 text-xs font-medium"
                    title="Copiar Link"
                  >
                    {copiadoId === link.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiadoId === link.id ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-700"
                    title="Testar Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
