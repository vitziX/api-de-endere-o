import {
  MapPin,
  Route,
  Building2,
  Home,
  Navigation,
  Hash,
  Phone,
  Landmark,
  ExternalLink,
} from 'lucide-react';
import type { CEPResult } from '@/types/cep';

interface CEPResultCardProps {
  result: CEPResult;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="info-row flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/40">
      <Icon className="info-icon mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" aria-hidden />
      <div className="min-w-0 flex-1">
        <dt className="info-label text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </dt>
        <dd className="info-value mt-0.5 break-words text-sm font-medium text-slate-800">
          {value}
        </dd>
      </div>
    </div>
  );
}

export function CEPResultCard({ result }: CEPResultCardProps) {
  const fullAddress = [
    result.logradouro,
    result.bairro,
    `${result.localidade} - ${result.uf}`,
    result.cep,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="result-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="result-header flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white sm:p-6">
        <span className="result-pin">
          <MapPin className="h-6 w-6 flex-shrink-0" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="result-kicker text-sm font-medium text-blue-100">
            CEP encontrado
          </p>
          <p className="result-cep text-xl font-bold tracking-wide sm:text-2xl">
            {result.cep}
          </p>
        </div>
      </div>

      <dl className="result-grid grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6">
        <InfoRow icon={Route} label="Logradouro" value={result.logradouro} />
        <InfoRow icon={Building2} label="Complemento" value={result.complemento} />
        <InfoRow icon={Home} label="Bairro" value={result.bairro} />
        <InfoRow
          icon={Navigation}
          label="Cidade / Estado"
          value={`${result.localidade} - ${result.uf}`}
        />
        <InfoRow icon={Hash} label="IBGE" value={result.ibge} />
        <InfoRow icon={Phone} label="DDD" value={result.ddd} />
        <InfoRow icon={Landmark} label="SIAFI" value={result.siafi} />
      </dl>

      <div className="result-actions border-t border-slate-100 p-5 sm:px-6">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-auto"
        >
          <MapPin className="h-5 w-5" aria-hidden />
          Ver no Google Maps
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
