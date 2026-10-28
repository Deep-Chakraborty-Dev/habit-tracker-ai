import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, Bot, Cpu, ChevronRight } from 'lucide-react';
import WeeklyReportCard from '../components/ai/WeeklyReportCard';
import Heatmap90Day from '../components/heatmap/Heatmap90Day';
import GlassPanel from '../components/ui/GlassPanel';
import SuggestionWizard from '../components/ai/SuggestionWizard';
import Button from '../components/ui/Button';

const Insights = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* ═══════════════════════════════════════
          HERO BANNER
      ═══════════════════════════════════════ */}
      <GlassPanel className="p-6 sm:p-7 w-full min-w-0" hoverable={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                Diagnostics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white truncate">
              Insights &amp; AI Coach
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1 break-words">
              Algorithmic audits, streak trajectory analysis, and adaptive habit coaching.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-950 stroke-[2.5]" />
            <span>Launch Wizard</span>
          </Button>
        </div>
      </GlassPanel>

      {/* ═══════════════════════════════════════
          AI COACHING AUDIT REPORT
      ═══════════════════════════════════════ */}
      <div className="w-full min-w-0 overflow-hidden">
        <WeeklyReportCard />
      </div>

      {/* ═══════════════════════════════════════
          DATA & INTEL GRID (FIXED OVERFLOW)
      ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full min-w-0">
        {/* Heatmap Card */}
        <GlassPanel className="lg:col-span-2 p-5 sm:p-6 w-full min-w-0 overflow-hidden" hoverable={false}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-1 h-4 rounded-full bg-emerald-400 shrink-0" />
              <h3 className="text-xs font-bold uppercase font-mono tracking-wide text-white truncate">
                Aggregated Consistency Grid
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 shrink-0">
              90D
            </span>
          </div>
          
          <div className="w-full overflow-x-auto min-w-0 pb-1">
            <Heatmap90Day />
          </div>
        </GlassPanel>

        {/* AI Explainer */}
        <GlassPanel className="p-5 sm:p-6 flex flex-col justify-between gap-5 w-full min-w-0 overflow-hidden" hoverable={false}>
          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase shrink-0">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" /> Engine v2.6
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
                Neural Habit Engine
                <HelpCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400 mt-2 font-medium break-words">
                Evaluates check-ins, velocity patterns, and streak break-points to calculate optimal routines.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsWizardOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Architect</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-zinc-500" />
          </Button>
        </GlassPanel>
      </div>

      <SuggestionWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
};

export default Insights;