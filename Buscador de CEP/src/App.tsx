import { useState, useCallback, useEffect } from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import { CEPSearch } from '@/components/CEPSearch';
import { CEPResultCard } from '@/components/CEPResultCard';
import { SearchHistory } from '@/components/SearchHistory';
import {
  LoadingState,
  ErrorState,
  InitialState,
} from '@/components/States';
import { fetchCEP } from '@/api/viacep';
import {
  addLocalHistory,
  getLocalHistory,
  loadSearchHistory,
  recordSearch,
} from '@/api/searchHistory';
import { isSupabaseConfigured } from '@/lib/supabase';
import { formatCEP, sanitizeCEP, isValidCEP } from '@/utils/cep';
import type { CEPHistoryEntry, CEPResult } from '@/types/cep';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [cepInput, setCepInput] = useState('');
  const [result, setResult] = useState<CEPResult | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState<CEPHistoryEntry[]>([]);
  const [historyNotice, setHistoryNotice] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function restoreHistory() {
      try {
        const saved = await loadSearchHistory();
        if (!cancelled) {
          setHistory(saved);
          if (!isSupabaseConfigured) {
            setHistoryNotice('Supabase não configurado: o histórico fica salvo apenas neste navegador.');
          }
        }
      } catch (error) {
        console.error('Falha ao carregar histórico no Supabase:', error);
        if (!cancelled) {
          setHistory(getLocalHistory());
          setHistoryNotice('A consulta de CEP funciona, mas a tabela do histórico não foi encontrada ou está sem permissão. Confira as migrações do Supabase incluídas no projeto Bolt.');
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }
    void restoreHistory();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = useCallback(
    async (rawCep?: string) => {
      const cep = sanitizeCEP(rawCep ?? cepInput);

      if (!isValidCEP(cep)) {
        setErrorMsg('O CEP deve ter 8 dígitos.');
        setStatus('error');
        return;
      }

      setStatus('loading');
      setErrorMsg('');
      setHistoryNotice('');
      setResult(null);

      try {
        const data = await fetchCEP(cep);
        setResult(data);
        setStatus('success');

        try {
          const saved = await recordSearch(data);
          setHistory(saved);
        } catch (historyError) {
          console.error('Falha ao salvar consulta no Supabase:', historyError);
          setHistory(addLocalHistory(data));
          setHistoryNotice('O CEP foi encontrado, mas não foi salvo no Supabase. Confira se as migrações da tabela consultas_cep foram aplicadas e se as permissões estão ativas.');
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Ocorreu um erro inesperado ao consultar o CEP.';
        setErrorMsg(message);
        setStatus('error');
      }
    },
    [cepInput],
  );

  const handleHistorySelect = useCallback(
    (cep: string) => {
      const formatted = formatCEP(cep);
      setCepInput(formatted);
      void handleSearch(cep);
    },
    [handleSearch],
  );



  const showResult = status === 'success' && result;
  const showInitial = status === 'idle' && !result;

  return (
    <div className="app-shell min-h-screen text-slate-900">
      <Header />

      <main className="app-main mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="hero-section mb-8 text-center sm:mb-10">
          <span className="hero-eyebrow">Consulta inteligente de endereços</span>
          <h2 className="hero-title mt-4 text-3xl font-bold text-slate-900 sm:text-5xl">
            Consulte qualquer CEP do Brasil
          </h2>
          <p className="hero-description mx-auto mt-4 max-w-2xl text-slate-600">
            Digite um CEP para buscar o endereço completo — logradouro, bairro,
            cidade, estado, DDD e código IBGE. Os dados são obtidos pela API
            pública ViaCEP.
          </p>
        </section>

        <section
          className="search-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
          aria-label="Consulta de CEP"
        >
          <CEPSearch
            value={cepInput}
            onChange={setCepInput}
            onSubmit={() => void handleSearch()}
            loading={status === 'loading'}
          />
          {!isValidCEP(cepInput) && cepInput.length > 0 && (
            <p className="mt-3 text-sm text-amber-600" role="status">
              O CEP deve ter 8 dígitos.
            </p>
          )}
        </section>

        {historyNotice && (
          <div className="database-notice mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
            {isSupabaseConfigured ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> : <Database className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />}
            <span>{historyNotice}</span>
          </div>
        )}

        <section className="results-section mt-6" aria-live="polite">
          {status === 'loading' && <LoadingState />}
          {status === 'error' && <ErrorState message={errorMsg} />}
          {showResult && <CEPResultCard result={result} />}
          {showInitial && <InitialState />}
        </section>

        {!historyLoading && (
          <SearchHistory
            history={history}
            onSelect={handleHistorySelect}
          />
        )}
      </main>

      <footer className="app-footer border-t border-slate-200 bg-white">
        <div className="footer-inner mx-auto max-w-4xl px-4 py-7 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          Projeto integrador escolar — Buscador de CEP
          <br />
          Dados fornecidos pela{' '}
          <a
            href="https://viacep.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            API ViaCEP
          </a>
          {' '}· Histórico salvo no Supabase
        </div>
      </footer>
    </div>
  );
}
