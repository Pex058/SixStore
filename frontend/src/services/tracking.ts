import { db, isFirebaseConfigured } from './firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import type { OrigemLead, LinkCampanha } from '../types';

const STORAGE_KEY_ORIGEM = 'sixstore_origem_lead';
const STORAGE_KEY_LINKS = 'sixstore_links_campanha_mock';

export const capturarOrigemURL = (): OrigemLead => {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref') || undefined;
  const utmSource = urlParams.get('utm_source') || undefined;
  const utmMedium = urlParams.get('utm_medium') || undefined;
  const utmCampaign = urlParams.get('utm_campaign') || undefined;

  if (ref || utmSource || utmMedium || utmCampaign) {
    const origem: OrigemLead = {
      ref,
      utmSource,
      utmMedium,
      utmCampaign
    };
    localStorage.setItem(STORAGE_KEY_ORIGEM, JSON.stringify(origem));
    
    // Registrar visita anônima no Firestore se disponível
    registrarVisita(origem);
    
    return origem;
  }

  const stored = localStorage.getItem(STORAGE_KEY_ORIGEM);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao ler origem salva:', e);
    }
  }

  return {};
};

const registrarVisita = async (origem: OrigemLead) => {
  if (!isFirebaseConfigured || !db) return;

  try {
    const colRef = collection(db, 'leads_visitas');
    await addDoc(colRef, {
      ...origem,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao registrar visita:', error);
  }
};

export const getLinksCampanha = async (): Promise<LinkCampanha[]> => {
  if (!isFirebaseConfigured || !db) {
    const stored = localStorage.getItem(STORAGE_KEY_LINKS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Erro ao ler links mock:', e);
      }
    }
    return [
      {
        id: 'link_1',
        nomeCampanha: 'Bio do Instagram',
        slugRef: 'instagram_bio',
        targetUrl: `${window.location.origin}/?ref=instagram_bio`,
        totalCliques: 142,
        totalConversoes: 18,
        createdAt: new Date().toISOString()
      },
      {
        id: 'link_2',
        nomeCampanha: 'Anúncio Facebook Black Friday',
        slugRef: 'fb_blackfriday',
        targetUrl: `${window.location.origin}/?utm_source=facebook&utm_campaign=blackfriday`,
        totalCliques: 389,
        totalConversoes: 45,
        createdAt: new Date().toISOString()
      }
    ];
  }

  try {
    const colRef = collection(db, 'links_campanha');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as LinkCampanha[];
  } catch (error) {
    console.error('Erro ao buscar links de campanha:', error);
    return [];
  }
};

export const criarLinkCampanha = async (nomeCampanha: string, slugRef: string): Promise<LinkCampanha> => {
  const baseUrl = window.location.origin;
  const targetUrl = `${baseUrl}/?ref=${encodeURIComponent(slugRef)}`;

  const novoLink: LinkCampanha = {
    id: `link_${Date.now()}`,
    nomeCampanha,
    slugRef,
    targetUrl,
    totalCliques: 0,
    totalConversoes: 0,
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured || !db) {
    const links = await getLinksCampanha();
    links.unshift(novoLink);
    localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
    return novoLink;
  }

  const colRef = collection(db, 'links_campanha');
  const docRef = await addDoc(colRef, novoLink);
  return { ...novoLink, id: docRef.id };
};
