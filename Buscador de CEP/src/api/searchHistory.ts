import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CEPHistoryEntry, CEPResult } from '@/types/cep';

const TABLE_NAME = 'consultas_cep';
const LOCAL_STORAGE_KEY = 'buscador-cep-history-v1';
const MAX_HISTORY = 10;

type ConsultaCepRow = {
  id: string;
  cep: string;
  logradouro: string | null;
  complemento: string | null;
  bairro: string | null;
  localidade: string | null;
  uf: string | null;
  ibge: string | null;
  ddd: string | null;
  siafi: string | null;
  created_at: string;
};

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function asHistoryEntry(row: ConsultaCepRow): CEPHistoryEntry {
  return {
    id: row.id,
    cep: row.cep,
    logradouro: row.logradouro ?? '',
    complemento: row.complemento ?? '',
    bairro: row.bairro ?? '',
    localidade: row.localidade ?? '',
    uf: row.uf ?? '',
    ibge: row.ibge ?? '',
    ddd: row.ddd ?? '',
    siafi: row.siafi ?? '',
    created_at: row.created_at,
  };
}

export function getLocalHistory(): CEPHistoryEntry[] {
  try {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as CEPHistoryEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function setLocalHistory(items: CEPHistoryEntry[]): CEPHistoryEntry[] {
  const limited = items.slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.warn('Não foi possível salvar o histórico local.', error);
  }
  return limited;
}

export function addLocalHistory(result: CEPResult): CEPHistoryEntry[] {
  const existing = getLocalHistory().filter((item) => item.cep !== result.cep);
  const entry: CEPHistoryEntry = {
    ...result,
    id: makeId(),
    created_at: new Date().toISOString(),
  };
  return setLocalHistory([entry, ...existing]);
}

export async function loadSearchHistory(): Promise<CEPHistoryEntry[]> {
  if (!isSupabaseConfigured || !supabase) return getLocalHistory();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, cep, logradouro, complemento, bairro, localidade, uf, ibge, ddd, siafi, created_at')
    .order('created_at', { ascending: false })
    .limit(MAX_HISTORY);

  if (error) throw error;

  const history = (data as ConsultaCepRow[]).map(asHistoryEntry);
  setLocalHistory(history);
  return history;
}

export async function recordSearch(result: CEPResult): Promise<CEPHistoryEntry[]> {
  if (!isSupabaseConfigured || !supabase) return addLocalHistory(result);

  const { error } = await supabase.from(TABLE_NAME).insert({
    cep: result.cep,
    logradouro: result.logradouro || null,
    complemento: result.complemento || null,
    bairro: result.bairro || null,
    localidade: result.localidade || null,
    uf: result.uf || null,
    ibge: result.ibge || null,
    ddd: result.ddd || null,
    siafi: result.siafi || null,
  });

  if (error) throw error;
  return loadSearchHistory();
}

