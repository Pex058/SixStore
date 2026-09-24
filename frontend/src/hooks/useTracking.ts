import { useState, useEffect } from 'react';
import { capturarOrigemURL } from '../services/tracking';
import type { OrigemLead } from '../types';

export function useTracking() {
  const [origem, setOrigem] = useState<OrigemLead>({});

  useEffect(() => {
    const dados = capturarOrigemURL();
    setOrigem(dados);
  }, []);

  return origem;
}
