import { ArrowLeft } from 'lucide-react';
import { type AppView } from '../data/jessiConfig';

interface PageBackBarProps {
  sectionLabel: string;
  onBack: () => void;
  onNavigate?: (view: AppView) => void;
}

export function PageBackBar({ sectionLabel, onBack }: PageBackBarProps) {
  return (
    <div className="relative z-10 hidden md:block bg-[#FFF9FC]/90 backdrop-blur-sm border-b border-[#70048C]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#F5EDF8] text-[#70048C] border border-[#70048C]/15 text-sm font-bold hover:bg-[#70048C] hover:text-[#FFF9FC] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Volver al Biolink</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#EE0272] truncate">
          {sectionLabel}
        </span>
      </div>
    </div>
  );
}
