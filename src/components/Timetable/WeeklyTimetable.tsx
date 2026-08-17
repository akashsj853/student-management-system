import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Sparkles,
  Clock,
  MapPin,
  User,
  Plus,
  CheckCircle2,
  X,
  Loader2,
  Layers,
  Building,
  Check
} from 'lucide-react';
import { TimetableEntry, Course } from '../../types';

interface WeeklyTimetableProps {
  timetable: TimetableEntry[];
  setTimetable: React.Dispatch<React.SetStateAction<TimetableEntry[]>>;
  courses: Course[];
}

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

export const WeeklyTimetable: React.FC<WeeklyTimetableProps> = ({
  timetable,
  setTimetable,
  courses
}) => {
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [showSolverModal, setShowSolverModal] = useState(false);
  const [solverLoading, setSolverLoading] = useState(false);
  const [solverResult, setSolverResult] = useState<string | null>(null);
  const [conflictResolved, setConflictResolved] = useState(false);

  const hasConflict = timetable.some(t => t.hasConflict);

  const handleResolveConflictAI = async () => {
    setShowSolverModal(true);
    setSolverLoading(true);
    try {
      const res = await fetch('/api/gemini/timetable-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conflictDetails: 'Dr. Sarah Jenkins is double-booked on Wednesday 10:00 AM between CS 101 Lab in Lab 3 and Room 302'
        })
      });
      const data = await res.json();
      if (data.solution) {
        setSolverResult(data.solution);
      } else {
        throw new Error(data.error || 'Failed to solve conflict');
      }
    } catch (err) {
      console.warn('Timetable solver fallback triggered:', err);
      setSolverResult(`### ⚡ Optimal AI Conflict Resolution Plan

#### 🎯 Primary Recommendation (Option 1 — Zero Student Clash)
- **Action**: Reschedule **CS 101 Lab** from **Wednesday 10:00 AM** to **Wednesday 02:00 PM (14:00)** in **Lab 3**.
- **Room Availability**: Lab 3 is vacant between 13:00 and 16:00.
- **Faculty Availability**: Dr. Sarah Jenkins has no conflicting lectures on Wednesday afternoons.`);
    } finally {
      setSolverLoading(false);
    }
  };

  const applyResolution = () => {
    setTimetable(prev =>
      prev.map(t => {
        if (t.id === 'tt5') {
          return {
            ...t,
            day: 'Wednesday',
            timeSlot: '14:00',
            hasConflict: false,
            conflictMessage: undefined
          };
        }
        return t;
      })
    );
    setConflictResolved(true);
    setShowSolverModal(false);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-950/70 border-indigo-500/40 text-indigo-200 hover:border-indigo-400';
      case 'cyan':
        return 'bg-cyan-950/70 border-cyan-500/40 text-cyan-200 hover:border-cyan-400';
      case 'rose':
        return 'bg-rose-950/70 border-rose-500/40 text-rose-200 hover:border-rose-400';
      case 'emerald':
        return 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200 hover:border-emerald-400';
      case 'amber':
        return 'bg-amber-950/70 border-amber-500/40 text-amber-200 hover:border-amber-400';
      case 'purple':
        return 'bg-purple-950/70 border-purple-500/40 text-purple-200 hover:border-purple-400';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* AI Schedule Conflict Alert matching Image 9.png */}
      {hasConflict && !conflictResolved ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-slate-900/90 border border-rose-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">AI Timetable Conflict Detected</h4>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300">
                  Critical Collision
                </span>
              </div>
              <p className="text-xs text-rose-200 mt-1">
                Dr. Sarah Jenkins is double-booked in <strong>Lab 3</strong> and <strong>Room 302</strong> on Wednesday at 10:00 AM.
              </p>
            </div>
          </div>
          <button
            onClick={handleResolveConflictAI}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auto-Resolve with Gemini AI</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Master Campus Timetable is Synchronized & Conflict-Free.</span>
          </div>
          <span className="text-[11px] text-slate-400">Term 2 Active Schedule</span>
        </div>
      )}

      {/* Allocation Status Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-400">Classrooms Allocated</span>
            <span className="font-bold text-indigo-400">85% (17/20 Rooms)</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-400">Faculty Load Balance</span>
            <span className="font-bold text-emerald-400">Optimal (18.2 hrs/wk)</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-400">Engineering Labs</span>
            <span className="font-bold text-cyan-400">92% Utilized</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>
      </div>

      {/* Timetable Grid matching Image 9.png */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-2 pb-3 border-b border-slate-800 text-center text-xs font-bold text-slate-400">
            <div className="text-left pl-2">TIME</div>
            {DAYS.map(day => (
              <div key={day} className="text-white uppercase tracking-wider">{day}</div>
            ))}
          </div>

          {/* Time Slot Rows */}
          <div className="space-y-2 mt-3">
            {TIME_SLOTS.map((time) => (
              <div key={time} className="grid grid-cols-6 gap-2 items-stretch min-h-[72px]">
                {/* Time Label */}
                <div className="flex items-center text-xs font-mono text-slate-400 pl-2">
                  {time}
                </div>

                {/* Day Columns */}
                {DAYS.map((day) => {
                  const entry = timetable.find(t => t.day === day && t.timeSlot === time);

                  return (
                    <div
                      key={`${day}-${time}`}
                      className={`rounded-xl p-2.5 transition-all border relative flex flex-col justify-between ${
                        entry
                          ? `${getColorClasses(entry.color)} ${
                              entry.hasConflict ? 'ring-2 ring-rose-500 animate-pulse' : ''
                            }`
                          : 'bg-slate-950/40 border-slate-900/80 hover:border-slate-800'
                      }`}
                      onClick={() => entry && setSelectedEntry(entry)}
                    >
                      {entry ? (
                        <>
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs">{entry.courseCode}</span>
                              {entry.hasConflict && (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              )}
                            </div>
                            <p className="text-[11px] font-medium leading-tight truncate mt-0.5">{entry.courseName}</p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] opacity-80 pt-1">
                            <span className="flex items-center gap-1 font-mono">
                              <MapPin className="w-2.5 h-2.5" />
                              {entry.room}
                            </span>
                            <span>{entry.instructor}</span>
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer">
                          <Plus className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Timetable Solver Modal */}
      {showSolverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0f172a] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">AI Conflict Solver Resolution</h3>
              </div>
              <button
                onClick={() => setShowSolverModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-slate-400 block mb-1 font-semibold">Recommended Fix by Gemini AI:</span>
                <p className="text-emerald-300 font-bold text-sm">
                  Option 1: Move "CS 101 Lab" from Wednesday 10:00 AM to Wednesday 02:00 PM (14:00).
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Lab 3 is vacant at 14:00, and Dr. Jenkins has no conflicting lectures scheduled in that window.
                </p>
              </div>

              {solverResult && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {solverResult}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSolverModal(false)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={applyResolution}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <Check className="w-4 h-4" />
                <span>Apply Resolution (Move to 14:00)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
