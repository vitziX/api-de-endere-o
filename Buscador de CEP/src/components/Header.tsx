import { MapPin } from 'lucide-react';

export function Header() {
  return (
    <header className="site-header sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="site-header-inner mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <span className="brand-mark">
          <MapPin className="h-6 w-6 flex-shrink-0" aria-hidden />
        </span>
        <div className="brand-copy flex flex-col">
          <h1 className="text-xl font-bold leading-tight text-slate-900">
            Buscador de CEP
          </h1>
          <p className="hidden text-sm text-slate-500 sm:block">
            Consulta de endereços por CEP via API ViaCEP
          </p>
        </div>
      </div>
    </header>
  );
}
