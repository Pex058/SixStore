import { useState, useEffect } from 'react';
import type { ItemCarrinho } from '../types';

const STORAGE_KEY = 'sixstore_cart_items';

export function useCart() {
  const [itens, setItens] = useState<ItemCarrinho[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Erro ao ler carrinho do localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch (e) {
      console.error('Erro ao salvar carrinho no localStorage:', e);
    }
  }, [itens]);

  const adicionarItem = (novoItem: ItemCarrinho) => {
    setItens(prev => {
      const index = prev.findIndex(
        i => i.produtoId === novoItem.produtoId && 
             i.cor === novoItem.cor && 
             i.tamanho === novoItem.tamanho
      );

      if (index >= 0) {
        const atualizados = [...prev];
        atualizados[index].quantidade += novoItem.quantidade;
        return atualizados;
      }

      return [...prev, novoItem];
    });
  };

  const atualizarQuantidade = (produtoId: string, cor: string, tamanho: string, delta: number) => {
    setItens(prev => {
      return prev.map(item => {
        if (item.produtoId === produtoId && item.cor === cor && item.tamanho === tamanho) {
          const novaQtd = item.quantidade + delta;
          return novaQtd > 0 ? { ...item, quantidade: novaQtd } : null;
        }
        return item;
      }).filter(Boolean) as ItemCarrinho[];
    });
  };

  const removerItem = (produtoId: string, cor: string, tamanho: string) => {
    setItens(prev => prev.filter(
      i => !(i.produtoId === produtoId && i.cor === cor && i.tamanho === tamanho)
    ));
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const totalQtd = itens.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);

  return {
    itens,
    adicionarItem,
    atualizarQuantidade,
    removerItem,
    limparCarrinho,
    totalQtd,
    valorTotal
  };
}
