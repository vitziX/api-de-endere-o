import { Loader2, AlertCircle, SearchX, MapPin } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="state-card loading-state flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500" aria-hidden />
      <p className="text-sm font-medium">Consultando CEP…</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state-card error-state flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-red-100 p-4">
        <AlertCircle className="h-8 w-8 text-red-500" aria-hidden />
      </div>
      <p className="text-base font-semibold text-slate-800">
        Não foi possível consultar o CEP
      </p>
      <p className="max-w-md text-sm text-slate-500">{message}</p>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="state-card empty-state flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-blue-100 p-4">
        <SearchX className="h-8 w-8 text-blue-500" aria-hidden />
      </div>
      <p className="text-base font-semibold text-slate-800">
        Nenhuma busca realizada ainda
      </p>
      <p className="max-w-md text-sm text-slate-500">
        Digite um CEP acima e clique em Buscar para ver o endereço completo.
      </p>
    </div>
  );
}

export function InitialState() {
  return (
    <div className="state-card initial-state flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="rounded-full bg-blue-50 p-6">
        <MapPin className="h-12 w-12 text-blue-400" aria-hidden />
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-700">
          Busque qualquer CEP do Brasil
        </p>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          Digite um CEP no campo acima para consultar logradouro, bairro,
          cidade, estado, DDD e código IBGE.
        </p>
      </div>
    </div>
  );
}
