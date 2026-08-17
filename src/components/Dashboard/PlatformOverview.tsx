import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  QrCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Lock,
  Award,
  Fingerprint,
  Building2,
  Bus,
  KeyRound
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Student, Teacher, ExamRecord, AIInsight } from '../../types';
import { RemedialPlanModal } from '../Common/RemedialPlanModal';

interface PlatformOverviewProps {
  students: Student[];
  teachers: Teacher[];
  exams: ExamRecord[];
  insights: AIInsight[];
  onNavigate: (tab: string) => void;
  onOpenQR: () => void;
  onAddStudent: () => void;
}

const GROWTH_DATA_TERM2 = [
  { month: 'Jul', students: 1050, cs: 380, eng: 290, math: 210, bio: 170 },
  { month: 'Aug', students: 1120, cs: 410, eng: 310, math: 230, bio: 170 },
  { month: 'Sep', students: 1180, cs: 440, eng: 325, math: 240, bio: 175 },
  { month: 'Oct', students: 1210, cs: 455, eng: 335, math: 245, bio: 175 },
  { month: 'Nov', students: 1240, cs: 470, eng: 345, math: 250, bio: 175 },
];

const GROWTH_DATA_TERM1 = [
  { month: 'Jan', students: 920, cs: 330, eng: 260, math: 190, bio: 140 },
  { month: 'Feb', students: 950, cs: 345, eng: 270, math: 195, bio: 140 },
  { month: 'Mar', students: 990, cs: 360, eng: 280, math: 200, bio: 150 },
  { month: 'Apr', students: 1010, cs: 370, eng: 285, math: 205, bio: 150 },
  { month: 'May', students: 1040, cs: 375, eng: 290, math: 210, bio: 165 },
];

export const PlatformOverview: React.FC<PlatformOverviewProps> = ({
  students,
  teachers,
  exams,
  insights,
  onNavigate,
  onOpenQR,
  onAddStudent
}) => {
  const [termToggle, setTermToggle] = useState<'term1' | 'term2'>('term2');
  const [showRemedialModal, setShowRemedialModal] = useState(false);

  const activeData = termToggle === 'term2' ? GROWTH_DATA_TERM2 : GROWTH_DATA_TERM1;

  return (
    <div className="space-y-6">
      {/* Top Stat Cards matching screenshots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">1,240</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-semibold">+12%</span>
              <span className="text-slate-400 font-normal">from last semester</span>
            </div>
          </div>
        </div>

        {/* Active Teachers */}
        <div
          onClick={() => onNavigate('teachers')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Faculty Staff</span>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">84</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 font-semibold">80 Active</span>
              <span>• 4 On Leave</span>
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div
          onClick={() => onNavigate('attendance')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Attendance</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">92.4%</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-semibold">+2.1%</span>
              <span className="text-slate-400 font-normal">target: 95.0%</span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div
          onClick={() => onNavigate('finance')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Term 2 Revenue</span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">$42,500</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">94%</span>
              <span>collected of $45k goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Student Growth Chart + AI Predictive Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Area Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Student Enrollment & Cohort Growth</h3>
              <p className="text-xs text-slate-400">Department distribution trends over time</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
              <button
                onClick={() => setTermToggle('term1')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  termToggle === 'term1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Term 1 (Spring)
              </button>
              <button
                onClick={() => setTermToggle('term2')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  termToggle === 'term2' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Term 2 (Fall)
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 sm:h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="cs" name="Computer Science" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCs)" />
                <Area type="monotone" dataKey="eng" name="Engineering" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEng)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Computer Science</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Electrical / Mech Eng</span>
            </div>
            <button onClick={() => onNavigate('students')} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              View Detailed Roster <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Insight Card matching Image 7.png */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-indigo-950/70 via-slate-900/90 to-slate-900/90 border border-indigo-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">AI Diagnostic Insight</h4>
                  <span className="text-[10px] text-amber-400 font-semibold">Priority Action Recommended</span>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Gemini 3.7
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Curriculum Performance Gap (CS 101)
              </h5>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                34% of Computer Science students scored below 60% on Binary Tree & Dynamic Programming concepts on the recent quiz.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-slate-200">Recommended Next Steps:</p>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Synthesize 2-week remedial workshop syllabus</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dispatch peer mentor invites to top 5 rank holders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Schedule auxiliary lab session on Friday afternoon</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-indigo-500/20">
            <button
              onClick={() => setShowRemedialModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Suggest Remedial Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit & Governance Admin Review Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0b1329] via-[#091122] to-[#070c18] border border-indigo-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Platform Accountability & Audit Ledger</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> SHA-256 Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              10 recent critical events logged (Grade adjustments, manual attendance overrides, 2FA admin authentication).
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('audit')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all shrink-0"
        >
          <span>Open Full Audit Trail</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Facilities & Software Licenses Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hostel & Transit Status */}
        <div
          onClick={() => onNavigate('campus')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Hostel & Transit Fleet Logistics
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">396 / 450 Residents • 4 Active Bus Routes with Live GPS</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-amber-400" />
              <span>Fleet Telemetry: 100% On-Schedule</span>
            </span>
            <span className="text-amber-400 font-bold group-hover:underline">Manage Facilities →</span>
          </div>
        </div>

        {/* Software Licenses Status */}
        <div
          onClick={() => onNavigate('licenses')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition-transform">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  Institutional Software & Licenses Hub
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">8 Software Suites • 4,896 Seats Allocated • $75.6k Annual Budget</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>96.4% Compliance Score</span>
            </span>
            <span className="text-purple-400 font-bold group-hover:underline">Open License Hub →</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming Exams Table + Quick Action Toolbar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Upcoming Examinations & Invigilation</h3>
            <p className="text-xs text-slate-400">Scheduled midterms, finals, and room assignments</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
            <button
              onClick={onOpenQR}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>QR Scanner</span>
            </button>
          </div>
        </div>

        {/* Exams Table matching Image 7.png */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Subject & Code</th>
                <th className="py-3 px-3">Cohort</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Invigilator</th>
                <th className="py-3 px-3">Room</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {exams.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{ex.subject}</td>
                  <td className="py-3 px-3 text-slate-300">{ex.cohort}</td>
                  <td className="py-3 px-3 text-slate-300 font-medium">{ex.dateTime}</td>
                  <td className="py-3 px-3 text-slate-200">{ex.invigilator}</td>
                  <td className="py-3 px-3 text-indigo-300 font-semibold">{ex.room}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      ex.status === 'Ready'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : ex.status === 'Drafting'
                        ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      {ex.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigate('exams')}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remedial Plan Modal */}
      {showRemedialModal && (
        <RemedialPlanModal
          onClose={() => setShowRemedialModal(false)}
          subject="CS 101: Data Structures & Algorithms"
          initialContext="34% of Computer Science students scored below 60% in Binary Trees and Dynamic Programming on the recent quiz."
        />
      )}
    </div>
  );
};
