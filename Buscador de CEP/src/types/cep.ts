export interface CEPResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}


/** Registro de consulta salvo no Supabase ou no armazenamento local de fallback. */
export interface CEPHistoryEntry extends CEPResult {
  id: string;
  created_at?: string;
}
