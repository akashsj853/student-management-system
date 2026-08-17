import React, { useState } from 'react';
import { X, Sparkles, Download, CheckCircle, BookOpen, Clock, Users, Loader2 } from 'lucide-react';

interface RemedialPlanModalProps {
  onClose: () => void;
  subject?: string;
  initialContext?: string;
}

export const RemedialPlanModal: React.FC<RemedialPlanModalProps> = ({
  onClose,
  subject = 'CS 101: Data Structures & Algorithms',
  initialContext = '34% of students scored below 60% in Binary Trees and Dynamic Programming on the recent quiz.'
}) => {
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [planContent, setPlanContent] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/remedial-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          issueSummary: customPrompt || initialContext,
          targetStudents: 'Students with marks < 60% in CS 101 Midterms'
        })
      });
      const data = await res.json();
      if (data.plan) {
        setPlanContent(data.plan);
      } else {
        throw new Error(data.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      console.warn('Remedial plan error:', err);
      // Fallback content in case of offline/network issue
      setPlanContent(`## 📘 2-Week Accelerated Remedial Mastery Plan
**Target Course:** ${subject}
**Cohort:** Underperforming Students (<60% Midterm Score)
**Lead Instructor:** Department of Computer Science & Academic Support

---

### 1. Executive Diagnostic & Learning Gap Analysis
- **Core Stumbling Blocks**: Conceptual gaps in recursive stack frames, memory pointers, and recurrence relations.
- **Engagement Strategy**: Interactive step-through debugging, tactile whiteboard exercises, and peer code reviews.

---

### 2. Two-Week Intensive Intervention Roadmap
- **Session 1 (Mon 17:00 - 18:30)**: Visualizing Tree Traversals & BST Invariants
- **Session 2 (Wed 17:00 - 18:30)**: Balanced Trees & Binary Search Bounds
- **Session 3 (Mon 17:00 - 18:30)**: Memoization vs. Tabulation DP Patterns
- **Session 4 (Wed 17:00 - 18:30)**: Live Mock Diagnostic & Timed Coding Checkpoint

---

### 3. Passing Criteria
- Minimum 100% attendance across all 4 workshop sessions.
- Passing test-suite completion on all assigned problem sets in the campus online judge.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0f172a] border border-indigo-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">AI Remedial Curriculum Planner</h3>
              <p className="text-xs text-indigo-300">Targeted 2-week mastery recovery roadmap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview banner */}
        <div className="my-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400">Target Subject:</span>
            <h4 className="text-sm sm:text-base font-bold text-white">{subject}</h4>
            <p className="text-xs text-rose-400 mt-0.5">{initialContext}</p>
          </div>
          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Diagnostics...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {planContent ? 'Regenerate Plan' : 'Generate with Gemini AI'}
              </>
            )}
          </button>
        </div>

        {/* Content Box */}
        {planContent ? (
          <div className="max-h-[50vh] overflow-y-auto p-5 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {planContent}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 text-center space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                <Clock className="w-4 h-4 text-indigo-400 mb-1" />
                <h5 className="font-semibold text-slate-200 text-xs">2-Week Timeline</h5>
                <p className="text-[11px] text-slate-400 mt-1">4 intensive evening workshops & peer code reviews</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                <Users className="w-4 h-4 text-emerald-400 mb-1" />
                <h5 className="font-semibold text-slate-200 text-xs">Cohort Targeted</h5>
                <p className="text-[11px] text-slate-400 mt-1">16 flagged students with automatic LMS assignment sync</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                <BookOpen className="w-4 h-4 text-amber-400 mb-1" />
                <h5 className="font-semibold text-slate-200 text-xs">Adaptive Practice</h5>
                <p className="text-[11px] text-slate-400 mt-1">Visual algorithms, recursion trees, and memoization hacks</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">Click "Generate with Gemini AI" to synthesize a complete curriculum module.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-medium transition-colors border border-slate-700"
          >
            Close
          </button>
          {planContent && (
            <button
              onClick={() => {
                const blob = new Blob([planContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Remedial_Plan_${subject.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                a.click();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium transition-colors shadow-lg shadow-emerald-500/25"
            >
              <Download className="w-4 h-4" />
              Export & Assign to LMS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
