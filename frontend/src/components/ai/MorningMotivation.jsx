import { useMorningMotivation } from '../../hooks/useAI';
import GlassPanel from '../ui/GlassPanel';
import { Sparkles, Sunrise } from 'lucide-react';

/**
 * MorningMotivation — high-energy personalized daily greeting banner.
 */
const MorningMotivation = () => {
  const { data: motivation, isLoading } = useMorningMotivation();

  if (isLoading) {
    return (
      <GlassPanel className="p-4 flex items-center gap-3 animate-pulse" hoverable={false}>
        <div className="w-8 h-8 rounded-lg bg-neutral-800" />
        <div className="h-4 bg-neutral-800 rounded w-2/3" />
      </GlassPanel>
    );
  }

  if (!motivation || !motivation.message) return null;

  return (
    <GlassPanel
      className="p-5 flex items-center gap-4 relative overflow-hidden glow-card"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(168,85,247,0.08))',
        border: '1px solid rgba(245, 158, 11, 0.15)',
      }}
      hoverable={false}
    >
      <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-amber-500/5 filter blur-[30px] pointer-events-none" />
      
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
        <Sunrise className="w-5.5 h-5.5 text-amber-500" />
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>Daily Spark</span>
        </div>
        <p className="text-sm mt-0.5 leading-relaxed italic text-neutral-200">
          &ldquo;{motivation.message}&rdquo;
        </p>
      </div>
    </GlassPanel>
  );
};

export default MorningMotivation;
