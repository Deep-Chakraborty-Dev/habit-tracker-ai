import { Sparkles, Loader2, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { useWeeklyReport } from '../../hooks/useAI';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';

const WeeklyReportCard = () => {
  const { data: report, isLoading, isError, refetch, isFetching } = useWeeklyReport();

  const handleGenerate = () => {
    refetch();
  };

  return (
    <GlassPanel className="p-6 relative overflow-hidden" hoverable={false} glow>
      {/* Visual background gradient circle */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-500/5 filter blur-[40px] pointer-events-none" />

      <div className="flex items-center justify-between mb-4 border-b pb-4" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-500/10 shrink-0">
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              AI Coaching Assistant
            </h2>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
              Powered by Google Gemini
            </p>
          </div>
        </div>

        {/* Generate / Reload button */}
        {(report || isFetching) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerate}
            disabled={isFetching}
            className="flex items-center gap-1 text-xs py-1 px-2 border"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            {isFetching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Refresh Report</span>
          </Button>
        )}
      </div>

      {isFetching ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-neutral-200">Analyzing your 7-day progress...</p>
            <p className="text-xs text-neutral-400">Grounding prompts in actual habit logs.</p>
          </div>
        </div>
      ) : report ? (
        <div className="space-y-4 animate-fade-in">
          {/* Headline & Summary */}
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">
              {report.headline}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {report.summary}
            </p>
          </div>

          {/* Wins and Struggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Wins */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Weekly Wins
              </span>
              <ul className="space-y-1.5">
                {report.wins?.map((win, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="leading-tight">{win}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Struggles */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Struggles
              </span>
              <ul className="space-y-1.5">
                {report.struggles?.map((struggle, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <div className="w-4 h-4 rounded-full bg-rose-500/10 flex items-center justify-center mt-0.5 shrink-0">
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                    </div>
                    <span className="leading-tight">{struggle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips Suggestions Box */}
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-1.5 mt-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
              Actionable Coaching Tip
            </span>
            <p className="text-xs leading-relaxed text-neutral-300 italic">
              &ldquo;{report.suggestion}&rdquo;
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center max-w-sm mx-auto space-y-4">
          <p className="text-sm text-neutral-400">
            Generate an AI-powered weekly performance report summarizing your wins, struggles, and coaching tips grounded in your actual log records.
          </p>
          <Button
            variant="primary"
            onClick={handleGenerate}
            className="flex items-center gap-2 font-bold px-6 py-3 w-full sm:w-auto mx-auto justify-center"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            <span>Generate Weekly Audit</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </GlassPanel>
  );
};

export default WeeklyReportCard;
