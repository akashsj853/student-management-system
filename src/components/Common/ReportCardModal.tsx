import React from 'react';
import { X, Printer, Download, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { ExamResultItem } from '../../types';

interface ReportCardModalProps {
  result: ExamResultItem;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ result, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <GraduationCap className="w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Official Semester Academic Transcript</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Print Transcript"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Document */}
        <div className="my-6 p-6 sm:p-8 rounded-xl bg-slate-900 border border-slate-700/60 shadow-inner space-y-6">
          {/* Institution Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">EDUAI INSTITUTE OF TECHNOLOGY</h2>
              <p className="text-xs text-slate-400">Accredited by Higher Education Commission • Grade A++</p>
              <p className="text-xs text-slate-400">Term 2 Examination Results • Academic Year 2023-2024</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                result.status === 'Pass' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {result.status === 'Pass' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {result.status === 'Pass' ? 'PASSED & PROMOTED' : 'ACADEMIC PROBATION'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">Serial: TCR-2023-{result.studentId.replace(/[^0-9]/g, '')}</p>
            </div>
          </div>

          {/* Student Profile Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Student Name</span>
              <span className="font-bold text-white text-sm">{result.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Student ID</span>
              <span className="font-mono font-semibold text-indigo-300">{result.studentId}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Department</span>
              <span className="font-semibold text-slate-200">{result.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Overall Rank</span>
              <span className="font-bold text-amber-400">Rank #{result.rank}</span>
            </div>
          </div>

          {/* Marks Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold border-y border-slate-700/60">
                <tr>
                  <th className="py-2.5 px-3">Subject / Module Code</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Obtained</th>
                  <th className="py-2.5 px-3 text-center">Letter Grade</th>
                  <th className="py-2.5 px-3 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {result.breakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-medium text-white">{item.subject}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">100</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-200">{item.marks}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                        item.grade.startsWith('A') ? 'bg-emerald-500/20 text-emerald-300' :
                        item.grade.startsWith('B') ? 'bg-blue-500/20 text-blue-300' :
                        item.grade.startsWith('C') ? 'bg-amber-500/20 text-amber-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-xs text-slate-400">
                      {item.marks >= 90 ? 'Outstanding' : item.marks >= 75 ? 'Very Good' : item.marks >= 50 ? 'Satisfactory' : 'Needs Improvement'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & CGPA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40 text-center">
              <span className="text-xs text-slate-400">Total Marks</span>
              <p className="text-xl font-bold text-white mt-0.5">{result.totalMarks} <span className="text-xs text-slate-400 font-normal">/ {result.maxMarks}</span></p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40 text-center">
              <span className="text-xs text-slate-400">Semester GPA (SGPA)</span>
              <p className="text-xl font-bold text-indigo-400 mt-0.5">{result.cgpa.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 4.00</span></p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40 text-center">
              <span className="text-xs text-slate-400">Percentage Equivalent</span>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">{((result.totalMarks / result.maxMarks) * 100).toFixed(1)}%</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end pt-8 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="space-y-1">
              <div className="w-32 border-b border-slate-600 pb-1 font-mono text-[10px] text-slate-500">DIGITALLY SIGNED</div>
              <p>Controller of Examinations</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-24 h-12 flex items-center justify-center text-[10px] text-slate-500 border border-dashed border-slate-700 rounded">
                SEAL
              </div>
              <p>Official Institute Stamp</p>
            </div>
            <div className="space-y-1 text-right">
              <div className="w-32 border-b border-slate-600 pb-1 font-mono text-[10px] text-slate-500 ml-auto">VERIFIED BY AI</div>
              <p>Dean of Academic Affairs</p>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            Print Transcript
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
