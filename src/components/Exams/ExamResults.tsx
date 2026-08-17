import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Share2,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Printer,
  ChevronRight,
  FileText
} from 'lucide-react';
import { ExamResultItem } from '../../types';
import { ReportCardModal } from '../Common/ReportCardModal';
import { RemedialPlanModal } from '../Common/RemedialPlanModal';
import { SemesterProgressChart } from './SemesterProgressChart';

interface ExamResultsProps {
  results: ExamResultItem[];
}

export const ExamResults: React.FC<ExamResultsProps> = ({ results }) => {
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  const [selectedSem, setSelectedSem] = useState('Semester 4');
  const [selectedExamType, setSelectedExamType] = useState('Final Examinations');
  const [selectedDept, setSelectedDept] = useState('Computer Science');
  const [search, setSearch] = useState('');
  const [selectedResultForModal, setSelectedResultForModal] = useState<ExamResultItem | null>(null);
  const [showRemedialModal, setShowRemedialModal] = useState(false);
  const [published, setPublished] = useState(false);

  const filteredResults = results.filter((r) => {
    const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) || r.studentId.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Filters Bar matching Image 12.png */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Examination Results & Transcript Analytics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Official semester gradebook, pass distribution, and transcript generator
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedResultForModal(filteredResults[0] || results[0])}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
              title="Generate printable student academic & AI performance summary PDF"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Generate Summary PDF</span>
            </button>
            <button
              onClick={() => {
                const csv = results.map(r => `${r.rank},${r.studentId},${r.studentName},${r.totalMarks},${r.cgpa},${r.status}`).join('\n');
                const blob = new Blob([`Rank,ID,Name,Total,GPA,Status\n${csv}`], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'exam_results_gradebook.csv';
                a.click();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setPublished(true);
                alert('Exam results published to all Student & Parent portals!');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{published ? 'Published ✓' : 'Publish'}</span>
            </button>
          </div>
        </div>

        {/* 4 Dropdown selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="2023-2024">2023 - 2024</option>
              <option value="2022-2023">2022 - 2023</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Semester</label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="Semester 4">Semester 4 (Term 2)</option>
              <option value="Semester 3">Semester 3 (Term 1)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Exam Type</label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="Final Examinations">Final Examinations</option>
              <option value="Midterm Assessments">Midterm Assessments</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Eng.">Electrical Eng.</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Cards matching Image 12.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class Average */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Class Average</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">78.4%</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-semibold">+4.2%</span>
              <span className="text-slate-400 font-normal">vs Term 1</span>
            </div>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Overall Pass Rate</span>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-white">92.0%</h3>
              <p className="text-xs text-emerald-400 font-medium mt-1">45 / 49 Passed</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent flex items-center justify-center text-[10px] font-bold text-emerald-400 font-mono">
              92%
            </div>
          </div>
        </div>

        {/* Top Performer */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Top Performer (Rank #1)</span>
          <div className="mt-3 flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
              alt="Elena"
              className="w-10 h-10 rounded-xl object-cover border border-amber-400/60"
            />
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Elena Rostova</h4>
              <p className="text-xs font-bold text-amber-400 mt-0.5">98.2% (CGPA 3.96)</p>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900/90 border border-indigo-500/40 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">AI Diagnostic</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-snug">
            34% struggled with Data Structures Trees & Dynamic Prog.
          </p>
          <button
            onClick={() => setShowRemedialModal(true)}
            className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 text-left flex items-center gap-1"
          >
            <span>Suggest Remedial Plan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recharts Line Chart: Academic Progress & Continuous Assessment Trends */}
      <SemesterProgressChart
        results={results}
        selectedDept={selectedDept}
        selectedYear={selectedYear}
        selectedSem={selectedSem}
      />

      {/* Results Table matching Image 12.png */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Student Rank Roster & Grade Breakdown</h3>
            <p className="text-xs text-slate-400">Click any student to preview or print official transcript</p>
          </div>
          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rank list..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center">Rank</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Total Marks</th>
                <th className="py-3 px-3">CGPA</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Official Summary & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredResults.map((r) => (
                <tr key={r.studentId} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                      r.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      r.rank === 2 ? 'bg-slate-400/20 text-slate-200 border border-slate-400/40' :
                      r.rank === 3 ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40' :
                      'text-slate-400 font-normal'
                    }`}>
                      #{r.rank}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.avatar}
                        alt={r.studentName}
                        className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                      />
                      <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{r.studentName}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-300">{r.studentId}</td>

                  <td className="py-3 px-3 font-semibold text-slate-200">
                    {r.totalMarks} <span className="text-[10px] text-slate-400 font-normal">/ {r.maxMarks}</span>
                  </td>

                  <td className="py-3 px-3 font-bold text-indigo-400">
                    {r.cgpa.toFixed(2)}
                  </td>

                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      r.status === 'Pass'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      {r.status === 'Pass' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedResultForModal(r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 hover:border-indigo-500 shadow-sm transition-all"
                        title="Generate printable summary PDF with grades, attendance, and AI diagnostic"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Summary PDF</span>
                      </button>
                      <button
                        onClick={() => setSelectedResultForModal(r)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                        title="View Full Transcript"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Report Card & Printable Summary PDF Modal */}
      {selectedResultForModal && (
        <ReportCardModal
          result={selectedResultForModal}
          allResults={results}
          onSelectStudent={(res) => setSelectedResultForModal(res)}
          onClose={() => setSelectedResultForModal(null)}
        />
      )}

      {/* Remedial Plan Modal */}
      {showRemedialModal && (
        <RemedialPlanModal
          onClose={() => setShowRemedialModal(false)}
          subject="CS 101: Data Structures & Algorithms"
        />
      )}
    </div>
  );
};
