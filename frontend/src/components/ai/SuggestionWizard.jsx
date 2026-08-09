import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Plus, Check, Loader2 } from 'lucide-react';
import { useSuggestions } from '../../hooks/useAI';
import useHabits from '../../hooks/useHabits';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import toast from '../ui/Toast';

// Dynamic icon resolver matching icon key names to Lucide icons
import * as Icons from 'lucide-react';
const HabitIcon = ({ name, className, style }) => {
  const IconComponent = Icons[name] || Icons.Check;
  return <IconComponent className={className} style={style} />;
};

const SuggestionWizard = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [goals, setGoals] = useState('');
  const [productiveTime, setProductiveTime] = useState('morning');
  const [pastStruggles, setPastStruggles] = useState('');
  const [addedHabits, setAddedHabits] = useState({}); // Tracking which suggestions were added

  const { generateSuggestions, suggestions, isLoading: suggestionsLoading } = useSuggestions();
  const { createHabit } = useHabits();

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleGenerate = async () => {
    if (!goals.trim()) {
      toast.error('Goals are required to customize suggestions');
      return;
    }
    setStep(4);
    await generateSuggestions({ goals, productiveTime, pastStruggles });
    setAddedHabits({});
  };

  const handleAddHabit = async (suggestion, index) => {
    try {
      const habitPayload = {
        name: suggestion.name,
        category: suggestion.category,
        icon: suggestion.icon || 'Check',
        color: getRandomColor(),
        frequency: suggestion.suggestedFrequency || 'daily',
        targetDaysPerWeek: suggestion.targetDaysPerWeek,
        customDays: suggestion.customDays,
      };

      await createHabit(habitPayload);
      setAddedHabits((prev) => ({ ...prev, [index]: true }));
    } catch (err) {
      console.error('Failed to quick-add habit from suggestions:', err);
    }
  };

  const getRandomColor = () => {
    const brandColors = ['#f59e0b', '#a855f7', '#34d399', '#fb7185', '#38bdf8'];
    return brandColors[Math.floor(Math.random() * brandColors.length)];
  };

  const handleClose = () => {
    // Reset form
    setStep(1);
    setGoals('');
    setProductiveTime('morning');
    setPastStruggles('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 4 ? 'Your Suggested Habits' : `AI Suggestions Wizard (Step ${step}/3)`}
      maxWidth="34rem"
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                What are your main self-improvement goals?
              </label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. I want to build core fitness strength, learn reading habits daily, and establish a calm evening routine."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border outline-none bg-black/10 focus:bg-black/20 transition-all text-sm resize-none"
                style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                required
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!goals.trim()}
                className="flex items-center gap-1.5 font-bold"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                When are you usually most productive?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'morning', label: '🌅 Morning due' },
                  { value: 'afternoon', label: '☀️ Afternoon due' },
                  { value: 'evening', label: '🌆 Evening due' },
                  { value: 'night', label: '🌌 Night due' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setProductiveTime(value)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold text-center transition-all cursor-pointer ${
                      productiveTime === value
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                        : 'border-transparent bg-black/10 hover:bg-black/20 text-neutral-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={handleBack} className="flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button variant="primary" onClick={handleNext} className="flex items-center gap-1.5 font-bold">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                What are your biggest struggles or consistency barriers?
              </label>
              <textarea
                value={pastStruggles}
                onChange={(e) => setPastStruggles(e.target.value)}
                placeholder="e.g. I tend to skip tasks after coming home from work, and get distracted on phone screens before bed."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border outline-none bg-black/10 focus:bg-black/20 transition-all text-sm resize-none"
                style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={handleBack} className="flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerate}
                className="flex items-center gap-2 font-bold px-6"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Suggestions</span>
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {suggestionsLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <div className="text-center">
                  <p className="text-sm font-bold text-neutral-200">Customizing recommendations...</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Gemini is structuring habit objects.</p>
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-black/10 border flex items-start justify-between gap-4"
                    style={{ borderColor: 'var(--glass-border)' }}
                  >
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <HabitIcon name={sug.icon} className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-white">{sug.name}</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 border text-neutral-400 font-semibold uppercase" style={{ borderColor: 'var(--glass-border)' }}>
                            {sug.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed">{sug.reasoning}</p>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => handleAddHabit(sug, idx)}
                      disabled={addedHabits[idx]}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all border cursor-pointer ${
                        addedHabits[idx]
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-neutral-800 hover:bg-neutral-700 border-white/5 text-white'
                      }`}
                    >
                      {addedHabits[idx] ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-neutral-400 py-8">
                No recommendations could be generated.
              </p>
            )}

            <div className="flex justify-end pt-2 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <Button variant="ghost" onClick={handleClose}>
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default SuggestionWizard;
