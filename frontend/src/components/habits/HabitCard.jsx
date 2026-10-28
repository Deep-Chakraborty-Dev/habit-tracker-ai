import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Flame, Archive, Trash2, Edit2, Trophy } from 'lucide-react';
import Button from '../ui/Button';

// Dynamic icon resolver
const HabitIcon = ({ name, className, style }) => {
  const IconComponent = Icons[name] || Icons.Check;
  return <IconComponent className={className} style={style} />;
};

const HabitCard = ({
  habit,
  onEdit,
  onArchive,
  onDelete,
  onToggleLog,
  isCompletedToday = false,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    _id,
    name,
    category,
    icon,
    color,
    frequency,
    currentStreak = 0,
    longestStreak = 0,
    targetDaysPerWeek,
    customDays = [],
  } = habit;

  const frequencyLabel = () => {
    if (frequency === 'daily') return 'Every day';

    if (frequency === 'weekly') {
      return `${targetDaysPerWeek}x / week`;
    }

    if (frequency === 'custom') {
      const days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
      return customDays.map((d) => days[d]).join(' · ');
    }

    return '';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        bg-[#0b0b0f]
        border border-white/[0.07]
        hover:border-white/[0.14]
        transition-colors
        duration-300
      "
    >

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          backgroundColor: isCompletedToday
            ? color
            : 'rgba(255,255,255,0.06)',
        }}
      />

      <div className="p-5">

        {/* HEADER */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4 min-w-0">

            {/* Icon */}

            <div
              className="
                w-12 h-12
                rounded-xl
                flex items-center justify-center
                shrink-0
                border
              "
              style={{
                backgroundColor: `${color}12`,
                borderColor: `${color}25`,
              }}
            >
              <HabitIcon
                name={icon}
                className="w-5 h-5"
                style={{ color }}
              />
            </div>

            {/* Name */}

            <div className="min-w-0">

              <h3 className="
                text-[15px]
                font-semibold
                text-white
                truncate
              ">
                {name}
              </h3>

              <div className="
                flex
                items-center
                gap-2
                mt-1
                text-[11px]
                text-zinc-500
              ">
                <span>{category}</span>

                <span className="text-zinc-700">
                  /
                </span>

                <span>{frequencyLabel()}</span>
              </div>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="
            flex
            items-center
            gap-1
            ml-2
          ">

            <button
              onClick={() => onEdit(habit)}
              className="
                p-2
                rounded-lg
                text-zinc-600
                hover:text-white
                hover:bg-white/[0.06]
                transition
                cursor-pointer
              "
              title="Edit habit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onArchive(_id)}
              className="
                p-2
                rounded-lg
                text-zinc-600
                hover:text-amber-400
                hover:bg-white/[0.06]
                transition
                cursor-pointer
              "
              title="Archive habit"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowConfirmDelete(true)}
              className="
                p-2
                rounded-lg
                text-zinc-600
                hover:text-red-400
                hover:bg-white/[0.06]
                transition
                cursor-pointer
              "
              title="Delete habit"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>


        {/* STATS */}

        <div className="
          grid
          grid-cols-2
          mt-6
          border-y
          border-white/[0.06]
          py-4
        ">

          {/* Current streak */}

          <div className="flex items-center gap-3">

            <div className="
              w-8 h-8
              rounded-lg
              bg-orange-500/10
              flex
              items-center
              justify-center
            ">
              <Flame
                className="w-4 h-4"
                style={{
                  color:
                    currentStreak > 0
                      ? '#f97316'
                      : '#52525b',
                }}
              />
            </div>

            <div>

              <div className="flex items-baseline gap-1">

                <span className="
                  text-lg
                  font-semibold
                  text-white
                ">
                  {currentStreak}
                </span>

                <span className="
                  text-[10px]
                  text-zinc-600
                ">
                  days
                </span>

              </div>

              <p className="
                text-[9px]
                uppercase
                tracking-wider
                text-zinc-600
                font-semibold
              ">
                Current
              </p>

            </div>

          </div>


          {/* Best streak */}

          <div className="
            flex
            items-center
            gap-3
            border-l
            border-white/[0.06]
            pl-5
          ">

            <div className="
              w-8 h-8
              rounded-lg
              bg-violet-500/10
              flex
              items-center
              justify-center
            ">
              <Trophy className="w-4 h-4 text-violet-400" />
            </div>

            <div>

              <div className="flex items-baseline gap-1">

                <span className="
                  text-lg
                  font-semibold
                  text-white
                ">
                  {longestStreak}
                </span>

                <span className="
                  text-[10px]
                  text-zinc-600
                ">
                  days
                </span>

              </div>

              <p className="
                text-[9px]
                uppercase
                tracking-wider
                text-zinc-600
                font-semibold
              ">
                Best
              </p>

            </div>

          </div>

        </div>


        {/* CHECK-IN */}

        <div className="pt-4">

          <button
            onClick={() =>
              onToggleLog && onToggleLog(_id)
            }
            className={`
              w-full
              flex
              items-center
              justify-between
              px-4
              py-3
              rounded-xl
              border
              transition-all
              duration-200
              cursor-pointer
              ${
                isCompletedToday
                  ? 'border-violet-500/30 bg-violet-500/10'
                  : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12]'
              }
            `}
          >

            <div className="flex items-center gap-3">

              {isCompletedToday ? (

                <div className="
                  w-6 h-6
                  rounded-full
                  bg-violet-500
                  flex
                  items-center
                  justify-center
                ">
                  <Icons.Check
                    className="w-3.5 h-3.5 text-white"
                    strokeWidth={3}
                  />
                </div>

              ) : (

                <div className="
                  w-6 h-6
                  rounded-full
                  border
                  border-zinc-700
                  flex
                  items-center
                  justify-center
                ">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                </div>

              )}

              <div className="text-left">

                <p className={`
                  text-xs
                  font-semibold
                  ${
                    isCompletedToday
                      ? 'text-violet-300'
                      : 'text-zinc-300'
                  }
                `}>
                  {isCompletedToday
                    ? 'Completed today'
                    : 'Mark as complete'}
                </p>

                <p className="
                  text-[10px]
                  text-zinc-600
                  mt-0.5
                ">
                  {isCompletedToday
                    ? 'Nice work. Keep the streak alive.'
                    : 'Check in for today'}
                </p>

              </div>

            </div>


            <Icons.ChevronRight
              className={`
                w-4 h-4
                ${
                  isCompletedToday
                    ? 'text-violet-400'
                    : 'text-zinc-700'
                }
              `}
            />

          </button>

        </div>

      </div>


      {/* DELETE CONFIRMATION */}

      {showConfirmDelete && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            absolute
            inset-0
            z-20
            bg-[#08080b]/95
            backdrop-blur-md
            flex
            flex-col
            items-center
            justify-center
            p-6
            text-center
          "
        >

          <div className="
            w-12 h-12
            rounded-xl
            bg-red-500/10
            border
            border-red-500/20
            flex
            items-center
            justify-center
            mb-4
          ">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>

          <h4 className="
            text-base
            font-semibold
            text-white
          ">
            Delete this habit?
          </h4>

          <p className="
            text-xs
            leading-5
            text-zinc-500
            mt-2
            max-w-[230px]
          ">
            All of this habit's 90-day history
            will be permanently deleted.
          </p>

          <div className="
            flex
            items-center
            gap-2
            mt-5
          ">

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setShowConfirmDelete(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(_id);
                setShowConfirmDelete(false);
              }}
            >
              Delete
            </Button>

          </div>

        </motion.div>

      )}

    </motion.div>
  );
};

export default HabitCard;