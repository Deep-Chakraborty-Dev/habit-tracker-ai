import { useState } from 'react';
import WeeklyReportCard from '../components/ai/WeeklyReportCard';
import Heatmap90Day from '../components/heatmap/Heatmap90Day';
import GlassPanel from '../components/ui/GlassPanel';
import SuggestionWizard from '../components/ai/SuggestionWizard';
import Button from '../components/ui/Button';
import { Sparkles, HelpCircle } from 'lucide-react';

const Insights = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Insights &amp; AI Coach
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Personalized audits and recommendations based on your logs.
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 font-bold px-5 py-3 shrink-0"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Suggestions Wizard</span>
        </Button>
      </div>

      {/* AI Coaching Audit Report */}
      <WeeklyReportCard />

      {/* Grid details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap summary card */}
        <GlassPanel className="lg:col-span-2 p-5" hoverable={false}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Aggregated Consistency Grid
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Your log heatmap for the past 90 days.</p>
          </div>
          <Heatmap90Day />
        </GlassPanel>

        {/* AI Coaching Explainer Card */}
        <GlassPanel className="p-5 flex flex-col justify-between gap-4" hoverable={false}>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <HelpCircle className="w-5.5 h-5.5 text-purple-400" />
            </div>
            <h3 className="font-bold text-sm text-primary">How does the AI Coach work?</h3>
            <p className="text-xs leading-relaxed text-neutral-400">
              Every coaching report is dynamically built by analyzing your actual database habit check-ins and streaks. 
              Gemini evaluates your frequency targets and logs to deliver personalized wins, struggles, and comeback plans.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => setIsWizardOpen(true)}
            className="w-full text-xs font-semibold py-2.5 border flex items-center justify-center gap-1.5"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Launch Wizard</span>
          </Button>
        </GlassPanel>
      </div>

      {/* Suggestion Wizard Modal */}
      <SuggestionWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  );
};

export default Insights;
