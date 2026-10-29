import { MapPin, Clock } from 'lucide-react';
import type { CEPHistoryEntry } from '@/types/cep';

interface SearchHistoryProps {
  history: CEPHistoryEntry[];
  onSelect: (cep: string) => void;
}

export function SearchHistory({
  history,
  onSelect,
}: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <section
      className="history-panel mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      aria-label="Buscas recentes"
    >
      <div className="history-header mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-400" aria-hidden />
          <h3 className="history-title text-sm font-bold uppercase tracking-wide text-slate-500">
            Buscas recentes
          </h3>
        </div>
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
          Salvo no banco
        </span>
      </div>

      <ul className="history-list flex flex-col gap-2">
        {history.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.cep)}
              className="history-item flex w-full items-center gap-3 rounded-lg border border-slate-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <MapPin
                className="history-item-icon h-5 w-5 flex-shrink-0 text-blue-500"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {item.logradouro || 'Sem logradouro'} —{' '}
                  <span className="text-blue-600">{item.cep}</span>
                </p>
                <p className="truncate text-xs text-slate-500">
                  {item.bairro ? `${item.bairro} · ` : ''}
                  {item.localidade} - {item.uf}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
