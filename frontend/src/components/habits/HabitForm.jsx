import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BookOpen,
  Heart,
  Coffee,
  Smile,
  DollarSign,
  Dumbbell,
  Sparkles,
  Brain,
  Check,
  Calendar,
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

// Slick brand colors
const colors = [
  { hex: '#f59e0b', name: 'Amber Glow' },
  { hex: '#a855f7', name: 'Purple Accent' },
  { hex: '#34d399', name: 'Emerald Accent' },
  { hex: '#fb7185', name: 'Rose Accent' },
  { hex: '#38bdf8', name: 'Sky Accent' },
];

// Curated icons for custom habit categories
const icons = [
  { key: 'Activity', Icon: Activity },
  { key: 'Dumbbell', Icon: Dumbbell },
  { key: 'BookOpen', Icon: BookOpen },
  { key: 'Heart', Icon: Heart },
  { key: 'Brain', Icon: Brain },
  { key: 'Coffee', Icon: Coffee },
  { key: 'Smile', Icon: Smile },
  { key: 'DollarSign', Icon: DollarSign },
  { key: 'Sparkles', Icon: Sparkles },
  { key: 'Check', Icon: Check },
];

const categories = [
  'Fitness',
  'Health',
  'Learning',
  'Mindfulness',
  'Productivity',
  'Social',
  'Finance',
  'Custom',
];

const daysOfWeek = [
  { value: 0, label: 'S' },
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' },
];

const HabitForm = ({ isOpen, onClose, onSubmit, habit = null, loading = false }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Productivity');
  const [selectedColor, setSelectedColor] = useState(colors[0].hex);
  const [selectedIcon, setSelectedIcon] = useState('Check');
  const [frequency, setFrequency] = useState('daily');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(5);
  const [customDays, setCustomDays] = useState([]);

  // Populate data if editing an existing habit
  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setCategory(habit.category || 'Productivity');
      setSelectedColor(habit.color || colors[0].hex);
      setSelectedIcon(habit.icon || 'Check');
      setFrequency(habit.frequency || 'daily');
      setTargetDaysPerWeek(habit.targetDaysPerWeek || 5);
      setCustomDays(habit.customDays || []);
    } else {
      // Reset form
      setName('');
      setCategory('Productivity');
      setSelectedColor(colors[0].hex);
      setSelectedIcon('Check');
      setFrequency('daily');
      setTargetDaysPerWeek(5);
      setCustomDays([]);
    }
  }, [habit, isOpen]);

  const handleDayToggle = (dayValue) => {
    setCustomDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue].sort((a, b) => a - b)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      category,
      color: selectedColor,
      icon: selectedIcon,
      frequency,
      ...(frequency === 'weekly' && { targetDaysPerWeek }),
      ...(frequency === 'custom' && { customDays }),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habit ? 'Edit Habit' : 'Create New Habit'}
      maxWidth="32rem"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Habit Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Read for 30 minutes, Drink 3L water"
            className="w-full px-4 py-3 rounded-xl border outline-none bg-black/10 focus:bg-black/20 transition-all text-sm"
            style={{
              borderColor: 'var(--glass-border)',
              color: 'var(--text-primary)',
            }}
            required
            maxLength={100}
          />
        </div>

        {/* Category Picker */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border outline-none bg-neutral-900 text-sm"
            style={{
              borderColor: 'var(--glass-border)',
              color: 'var(--text-primary)',
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-neutral-950">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Icon Picker */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Select Icon
          </label>
          <div className="grid grid-cols-5 gap-2">
            {icons.map(({ key, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedIcon(key)}
                className={`py-2 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                  selectedIcon === key
                    ? 'border-neutral-200 bg-white/10'
                    : 'border-transparent hover:bg-white/5'
                }`}
                style={{
                  borderColor: selectedIcon === key ? selectedColor : 'transparent',
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: selectedIcon === key ? selectedColor : 'var(--text-secondary)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Select Color
          </label>
          <div className="flex items-center gap-3">
            {colors.map(({ hex, name }) => (
              <button
                key={hex}
                type="button"
                onClick={() => setSelectedColor(hex)}
                className="w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-110"
                style={{
                  backgroundColor: hex,
                  boxShadow: selectedColor === hex ? `0 0 12px ${hex}` : 'none',
                  border: selectedColor === hex ? '2px solid white' : 'none',
                }}
                title={name}
                aria-label={`Select color ${name}`}
              />
            ))}
          </div>
        </div>

        {/* Frequency selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['daily', 'weekly', 'custom'].map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setFrequency(freq)}
                className={`py-2 px-3 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                  frequency === freq
                    ? 'border-neutral-200 bg-white/10'
                    : 'border-transparent hover:bg-white/5'
                }`}
                style={{
                  borderColor: frequency === freq ? selectedColor : 'transparent',
                  color: frequency === freq ? selectedColor : 'var(--text-secondary)',
                }}
              >
                {freq}
              </button>
            ))}
          </div>

          {/* Conditional Options */}
          {frequency === 'weekly' && (
            <motion.div
              className="flex items-center justify-between p-3 rounded-xl bg-black/10 border"
              style={{ borderColor: 'var(--glass-border)' }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Calendar className="w-4 h-4" />
                <span>Target days per week:</span>
              </div>
              <input
                type="number"
                min="1"
                max="7"
                value={targetDaysPerWeek}
                onChange={(e) => setTargetDaysPerWeek(Number(e.target.value))}
                className="w-16 px-2 py-1 text-center font-bold bg-neutral-900 border rounded-lg"
                style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
              />
            </motion.div>
          )}

          {frequency === 'custom' && (
            <motion.div
              className="space-y-1.5"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Repeat on specific days:
              </span>
              <div className="flex items-center justify-between bg-black/10 p-2 rounded-xl border" style={{ borderColor: 'var(--glass-border)' }}>
                {daysOfWeek.map(({ value, label }) => {
                  const isSelected = customDays.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleDayToggle(value)}
                      className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? selectedColor : 'transparent',
                        color: isSelected ? 'white' : 'var(--text-secondary)',
                        border: isSelected ? 'none' : '1px solid var(--glass-border)',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ background: `linear-gradient(135deg, ${selectedColor}, #171717)` }}
            className="px-6 font-bold"
          >
            {habit ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HabitForm;
