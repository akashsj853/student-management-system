import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area
} from 'recharts';
import {
  TrendingUp,
  Award,
  User,
  BookOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { SemesterProgressPoint, ExamResultItem } from '../../types';
import { INITIAL_SEMESTER_PROGRESS } from '../../data/mockData';

interface SemesterProgressChartProps {
  progressData?: SemesterProgressPoint[];
  results: ExamResultItem[];
  selectedDept?: string;
  selectedYear?: string;
  selectedSem?: string;
}

export const SemesterProgressChart: React.FC<SemesterProgressChartProps> = ({
  progressData = INITIAL_SEMESTER_PROGRESS,
  results,
  selectedDept = 'Computer Science',
  selectedYear = '2023-2024',
  selectedSem = 'Semester 4'
}) => {
  const [viewMode, setViewMode] = useState<'cohort' | 'student' | 'subjects'>('cohort');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(results[0]?.studentId || 'CS-2023-089');
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number | null>(null);

  // Line Toggles
  const [showClassAvg, setShowClassAvg] = useState(true);
  const [showTopQuartile, setShowTopQuartile] = useState(true);
  const [showMedian, setShowMedian] = useState(true);
  const [showPassingTarget, setShowPassingTarget] = useState(true);
  const [showStudentLine, setShowStudentLine] = useState(true);

  // Active selected student object
  const selectedStudent = results.find(r => r.studentId === selectedStudentId) || results[0];

  // Prepare chart data format
  const chartData = progressData.map((pt, idx) => {
    const studentScore = pt.studentScores[selectedStudentId] ?? null;
    return {
      name: pt.shortLabel,
      fullMilestone: pt.milestone,
      week: pt.week,
      date: pt.date,
      index: idx,
      classAverage: pt.classAverage,
      topQuartile: pt.topQuartile,
      medianScore: pt.medianScore,
      passingBenchmark: pt.passingBenchmark,
      studentScore: studentScore,
      dataStructures: pt.subjectAverages.dataStructures,
      linearAlgebra: pt.subjectAverages.linearAlgebra,
      quantumPhysics: pt.subjectAverages.quantumPhysics,
      technicalWriting: pt.subjectAverages.technicalWriting
    };
  });

  // Calculate semester metrics
  const baselineAvg = progressData[0]?.classAverage || 68;
  const finalAvg = progressData[progressData.length - 1]?.classAverage || 84;
  const growthDelta = (finalAvg - baselineAvg).toFixed(1);

  const studentBaseline = progressData[0]?.studentScores[selectedStudentId] || 0;
  const studentFinal = progressData[progressData.length - 1]?.studentScores[selectedStudentId] || 0;
  const studentGrowth = (studentFinal - studentBaseline).toFixed(1);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-md text-xs space-y-2 max-w-xs">
          <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between gap-2">
            <div>
              <span className="font-bold text-white text-sm">{dataPoint.fullMilestone}</span>
              <p className="text-[11px] text-slate-400">{dataPoint.week} • {dataPoint.date}</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30">
              {selectedSem}
            </span>
          </div>

          <div className="space-y-1 pt-1">
            {payload.map((entry: any, index: number) => {
              if (entry.value === null || entry.value === undefined) return null;
              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-300 capitalize text-[11px]">{entry.name}</span>
                  </div>
                  <span className="font-bold font-mono text-white text-[11px]">{Number(entry.value).toFixed(1)}%</span>
                </div>
              );
            })}
          </div>

          {viewMode === 'student' && selectedStudent && (
            <div className="mt-1 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Class Delta:</span>
              <span className={`font-bold font-mono ${
                (dataPoint.studentScore ?? 0) >= dataPoint.classAverage ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {((dataPoint.studentScore ?? 0) - dataPoint.classAverage) >= 0 ? '+' : ''}
                {((dataPoint.studentScore ?? 0) - dataPoint.classAverage).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Semester Academic Progress & Performance Trends
              </h3>
              <p className="text-xs text-slate-400">
                Continuous assessment trajectory across {selectedSem} ({selectedYear}) • {selectedDept}
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('cohort')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'cohort'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cohort Benchmark</span>
            </button>

            <button
              onClick={() => setViewMode('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Drill-Down</span>
            </button>

            <button
              onClick={() => setViewMode('subjects')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'subjects'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Subject Trajectories</span>
            </button>
          </div>

          {/* Student Selector if in Student Mode */}
          {viewMode === 'student' && (
            <div className="flex items-center gap-2">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {results.map((r) => (
                  <option key={r.studentId} value={r.studentId}>
                    {r.studentName} (#{r.rank} • {r.studentId})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* KPI Overview Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
            Semester Growth Delta
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-400">+{growthDelta}%</span>
            <span className="text-[10px] text-slate-400">Baseline → Finals</span>
          </div>
          <span className="text-[10px] text-emerald-400/90 font-medium">Class Avg: 68.2% → 84.6%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
            Top Quartile Peak
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-amber-400">97.4%</span>
            <span className="text-[10px] text-slate-400">Top 25%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">+13.4% progression rate</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
            Passing Target (70%)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-indigo-400">92.0%</span>
            <span className="text-[10px] text-emerald-400">Met Threshold</span>
          </div>
          <span className="text-[10px] text-indigo-400/90 font-medium">45 / 49 Students Cleared</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
            {viewMode === 'student' ? 'Selected Student' : 'Best Progressing Subject'}
          </span>
          <div className="mt-1 flex items-baseline gap-2 truncate">
            {viewMode === 'student' ? (
              <>
                <span className="text-xl font-black text-fuchsia-400">{studentFinal}%</span>
                <span className={`text-[10px] font-bold ${Number(studentGrowth) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {Number(studentGrowth) >= 0 ? `+${studentGrowth}%` : `${studentGrowth}%`}
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-black text-cyan-400">Data Structures</span>
                <span className="text-[10px] text-emerald-400">+22.5%</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 truncate block">
            {viewMode === 'student' ? `${selectedStudent?.studentName} (${selectedStudentId})` : '64.0% Baseline → 86.5% Finals'}
          </span>
        </div>
      </div>

      {/* Toggle Line Checkboxes */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Metrics Overlay:</span>

          {viewMode !== 'subjects' && (
            <>
              <button
                type="button"
                onClick={() => setShowClassAvg(!showClassAvg)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                  showClassAvg
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Class Average</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTopQuartile(!showTopQuartile)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                  showTopQuartile
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Top Quartile (75th Percentile)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMedian(!showMedian)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                  showMedian
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 opacity-60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Median Score</span>
              </button>
            </>
          )}

          {viewMode === 'student' && (
            <button
              type="button"
              onClick={() => setShowStudentLine(!showStudentLine)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                showStudentLine
                  ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
              <span>{selectedStudent?.studentName}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowPassingTarget(!showPassingTarget)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
              showPassingTarget
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Target Benchmark (70%)</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          N = 49 Enrolled Candidates
        </span>
      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="h-80 sm:h-96 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="classAvgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
              axisLine={{ stroke: '#334155' }}
              dy={8}
            />

            <YAxis
              domain={[40, 100]}
              ticks={[40, 50, 60, 70, 80, 90, 100]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Passing Target Reference Line */}
            {showPassingTarget && (
              <ReferenceLine
                y={70}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Passing Benchmark (70%)',
                  fill: '#fb7185',
                  fontSize: 10,
                  position: 'insideBottomRight'
                }}
              />
            )}

            {/* View Mode: Cohort / Student Mode Lines */}
            {viewMode !== 'subjects' && (
              <>
                {showTopQuartile && (
                  <Line
                    type="monotone"
                    dataKey="topQuartile"
                    name="Top 25% Quartile"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 1, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                  />
                )}

                {showClassAvg && (
                  <Line
                    type="monotone"
                    dataKey="classAverage"
                    name="Class Average"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 1, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                )}

                {showMedian && (
                  <Line
                    type="monotone"
                    dataKey="medianScore"
                    name="Median Score"
                    stroke="#818cf8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: '#818cf8' }}
                    activeDot={{ r: 6, fill: '#818cf8' }}
                  />
                )}

                {viewMode === 'student' && showStudentLine && (
                  <Line
                    type="monotone"
                    dataKey="studentScore"
                    name={selectedStudent ? `${selectedStudent.studentName} Score` : 'Student Score'}
                    stroke="#d946ef"
                    strokeWidth={3.5}
                    dot={{ r: 5, fill: '#d946ef', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#d946ef', stroke: '#ffffff', strokeWidth: 3 }}
                  />
                )}
              </>
            )}

            {/* View Mode: Subjects Breakdown Lines */}
            {viewMode === 'subjects' && (
              <>
                <Line
                  type="monotone"
                  dataKey="dataStructures"
                  name="Data Structures"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#06b6d4' }}
                  activeDot={{ r: 7, fill: '#06b6d4' }}
                />
                <Line
                  type="monotone"
                  dataKey="linearAlgebra"
                  name="Linear Algebra"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                  activeDot={{ r: 7, fill: '#8b5cf6' }}
                />
                <Line
                  type="monotone"
                  dataKey="quantumPhysics"
                  name="Quantum Physics"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ec4899' }}
                  activeDot={{ r: 7, fill: '#ec4899' }}
                />
                <Line
                  type="monotone"
                  dataKey="technicalWriting"
                  name="Technical Writing"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 7, fill: '#10b981' }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Milestone Cards Navigation / Inspection Grid */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Semester Assessment Milestones Timeline
          </span>
          <span className="text-[11px] text-slate-400">Click any milestone for breakdown</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {progressData.map((m, idx) => {
            const isSelected = activeMilestoneIdx === idx;
            const isAboveTarget = m.classAverage >= m.passingBenchmark;
            const studentPtScore = m.studentScores[selectedStudentId];

            return (
              <div
                key={m.week}
                onClick={() => setActiveMilestoneIdx(isSelected ? null : idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300">{m.week}</span>
                  <span>{m.date.split(',')[0]}</span>
                </div>

                <h4 className="text-xs font-bold text-white mt-1 truncate" title={m.milestone}>
                  {m.milestone}
                </h4>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {m.classAverage}%
                  </span>
                  <span className="text-[10px] font-semibold text-amber-400 font-mono">
                    Top: {m.topQuartile}%
                  </span>
                </div>

                {viewMode === 'student' && studentPtScore !== undefined && (
                  <div className="mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Student:</span>
                    <span className={`font-bold font-mono ${studentPtScore >= m.classAverage ? 'text-fuchsia-400' : 'text-rose-400'}`}>
                      {studentPtScore}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Academic Trend Takeaways Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="text-white">Predictive Progression Insight:</strong> Cohort showed steady upward trajectory (+16.4% gain). 
            Data Structures & Linear Algebra stabilized post-Midterm review sessions (Week 8).
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            High Retention Cohort
          </span>
        </div>
      </div>
    </div>
  );
};
