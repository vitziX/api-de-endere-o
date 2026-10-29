import type { CEPResult } from '@/types/cep';

const BASE_URL = 'https://viacep.com.br/ws';

export async function fetchCEP(rawCep: string): Promise<CEPResult> {
  const cep = rawCep.replace(/\D/g, '');
  const res = await fetch(`${BASE_URL}/${cep}/json/`);

  if (!res.ok) {
    throw new Error(`Erro ${res.status}: não foi possível consultar o CEP.`);
  }

  const data = (await res.json()) as CEPResult;

  // ViaCEP retorna erro: true quando o CEP não existe
  if (data.erro) {
    throw new Error('CEP não encontrado. Verifique o número digitado e tente novamente.');
  }

  return data;
}
