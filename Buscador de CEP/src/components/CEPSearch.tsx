import { MapPin, Search, X, Loader2 } from 'lucide-react';
import { formatCEP, isValidCEP } from '@/utils/cep';

interface CEPSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function CEPSearch({
  value,
  onChange,
  onSubmit,
  loading,
}: CEPSearchProps) {
  const valid = isValidCEP(value);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid && !loading) onSubmit();
      }}
      className="cep-search-form flex flex-col gap-3 sm:flex-row"
      aria-label="Busca por CEP"
    >
      <div className="cep-input-wrap relative flex-1">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(formatCEP(e.target.value))}
          placeholder="Digite o CEP (ex.: 01001-000)"
          aria-label="Campo de CEP"
          maxLength={9}
          className="cep-input w-full rounded-lg border border-slate-300 bg-white py-3.5 pl-11 pr-11 text-lg tracking-wide text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Limpar campo de CEP"
            className="clear-input absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={!valid || loading}
        aria-label="Buscar CEP"
        className="search-button inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        ) : (
          <Search className="h-5 w-5" aria-hidden />
        )}
        Buscar
      </button>
    </form>
  );
}
