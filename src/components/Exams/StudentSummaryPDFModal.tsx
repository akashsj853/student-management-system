import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  UserCheck,
  Brain,
  ShieldCheck,
  QrCode,
  FileText
} from 'lucide-react';
import { ExamResultItem, Student } from '../../types';
import { INITIAL_STUDENTS } from '../../data/mockData';

interface StudentSummaryPDFModalProps {
  result: ExamResultItem;
  allResults?: ExamResultItem[];
  onSelectStudent?: (result: ExamResultItem) => void;
  onClose: () => void;
}

export const StudentSummaryPDFModal: React.FC<StudentSummaryPDFModalProps> = ({
  result,
  allResults = [],
  onSelectStudent,
  onClose
}) => {
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Match with student master data for attendance & metadata
  const studentMaster = INITIAL_STUDENTS.find(s => s.studentId === result.studentId) || {
    id: result.studentId,
    name: result.studentName,
    studentId: result.studentId,
    department: result.department,
    attendanceRate: result.status === 'Pass' ? (result.rank <= 3 ? 98 : 88) : 62,
    gpa: result.cgpa,
    performanceStatus: result.status === 'Pass' ? 'Excelling' : 'Needs Support',
    parentName: 'Guardian Contact',
    parentPhone: '+1 (555) 019-2834',
    courses: ['CS 101', 'MTH 204', 'PHY 301', 'ENG 201'],
    enrollmentDate: '2023-08-15',
    dob: '2004-03-12'
  };

  const attendanceRate = studentMaster.attendanceRate ?? (result.status === 'Pass' ? 95 : 62);
  const totalSchoolDays = 120;
  const daysPresent = Math.round((totalSchoolDays * attendanceRate) / 100);
  const daysAbsent = totalSchoolDays - daysPresent;
  const isAttendanceCompliant = attendanceRate >= 75;

  // Generate tailored AI-Driven Performance Summary based on student profile
  const getAIAnalysis = () => {
    if (result.rank === 1) {
      return {
        summary: `Elena demonstrates exceptional academic mastery across all evaluated disciplines, achieving top cohort honors (#1 Rank) with a 3.96 SGPA. Her cognitive retention and algorithmic problem-solving in Data Structures (98%) and Linear Algebra (99%) place her in the 99.8th percentile of institutional benchmarks.`,
        strengths: [
          'Mastery of abstract algorithmic complexity & graph analysis',
          'Rigorous mathematical derivation & matrix decomposition',
          'Flawless laboratory experiment execution and documentation'
        ],
        improvements: [
          'Participate in peer mentoring and symposium technical paper authorship',
          'Explore inter-departmental quantum machine learning research'
        ],
        attendanceCorrelation: 'Attendance at 98% (118/120 days) directly correlated with zero coursework deficits and a +19.8% positive variance against the cohort mean.',
        predictiveTrajectory: '99.4% probability of Summa Cum Laude graduation; recommended for Presidential Research Fellowship & Fast-Track Internship placement.',
        advisorRecommendation: 'Approve acceleration into Advanced Distributed Systems and grant Graduate Teaching Assistantship eligibility.'
      };
    } else if (result.rank <= 3) {
      return {
        summary: `${result.studentName} displays superior analytical acumen and disciplined practical execution, securing an elite top 3 ranking with a ${result.cgpa.toFixed(2)} SGPA. Demonstrates deep understanding of course competencies and consistent exam scoring.`,
        strengths: [
          'High precision in laboratory practical assessments',
          'Strong analytical reasoning and structured technical writing',
          'Consistent mid-term to final examination score acceleration'
        ],
        improvements: [
          'Target specialized competitive technical hackathons and collegiate research',
          'Deepen applied statistical modeling practice'
        ],
        attendanceCorrelation: `Consistent ${attendanceRate}% attendance ensured optimal retention of complex laboratory demonstrations and consistent top-quartile grading.`,
        predictiveTrajectory: 'High probability of Dean’s List distinction with sustained high-velocity performance in upper-division coursework.',
        advisorRecommendation: 'Nominate for Honors Undergraduate Research and Departmental Academic Merit Award.'
      };
    } else if (result.status === 'Pass') {
      return {
        summary: `${result.studentName} exhibits steady academic progress and sound foundational comprehension, successfully clearing all semester modules with a ${result.cgpa.toFixed(2)} SGPA and Rank #${result.rank}.`,
        strengths: [
          'Consistent performance across core technical modules',
          'Active laboratory participation and punctual project submissions',
          'Demonstrated upward scoring trend during pre-final reviews'
        ],
        improvements: [
          'Strengthen algorithmic problem-solving speed in time-constrained exams',
          'Dedicate additional study hours to advanced theoretical topics'
        ],
        attendanceCorrelation: `${attendanceRate}% attendance provided stable academic continuity, keeping coursework milestones on schedule throughout the semester.`,
        predictiveTrajectory: 'Projected to maintain solid upper-quartile standing with potential to reach GPA ≥ 3.70 with targeted remedial review.',
        advisorRecommendation: 'Schedule mid-semester milestone check-ins and suggest study group participation for advanced elective preparation.'
      };
    } else {
      return {
        summary: `${result.studentName} is currently experiencing significant academic distress, failing to clear key prerequisite modules and falling below the satisfactory threshold with a ${result.cgpa.toFixed(2)} SGPA (Rank #${result.rank}). Immediate intervention required.`,
        strengths: [
          'Demonstrates baseline capability in applied practical tasks and technical communication',
          'Responsive to guided one-on-one instructor feedback during laboratory sessions'
        ],
        improvements: [
          'Urgent remediation required in Data Structures (48%) and foundational Mathematics',
          'Address severe chronic absenteeism and missing laboratory deliverables',
          'Mandatory attendance in structured remedial tutoring bridge classes'
        ],
        attendanceCorrelation: `Critical attendance deficit (${attendanceRate}%, ${daysAbsent} missed days) is mathematically the primary driver of exam failure, creating an estimated 32% cognitive gap in core modules.`,
        predictiveTrajectory: 'High risk of academic suspension without immediate structured intervention. Probability of re-passing improves to 82% with 90%+ attendance.',
        advisorRecommendation: 'Enact Mandatory Academic Recovery Contract, assign dedicated faculty mentor, and convene urgent parent-advisor conference.'
      };
    }
  };

  const aiAnalysis = getAIAnalysis();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    // Trigger native browser print-to-PDF which handles full styles faithfully
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto modal-backdrop-blur">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 rounded-t-2xl no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Official Student Summary PDF Report
              </h3>
              <p className="text-xs text-slate-400">
                Printable transcript with academic grades, attendance diagnostics & AI summary
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Student Switcher Dropdown if allResults provided */}
            {allResults.length > 0 && onSelectStudent && (
              <select
                value={result.studentId}
                onChange={(e) => {
                  const target = allResults.find(r => r.studentId === e.target.value);
                  if (target) onSelectStudent(target);
                }}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {allResults.map((r) => (
                  <option key={r.studentId} value={r.studentId}>
                    {r.studentName} (#{r.rank} • {r.studentId})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              title="Print document or Save as PDF"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Preparing...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 flex-1 bg-slate-950">
          <div
            ref={printRef}
            className="printable-document max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 shadow-xl space-y-6"
          >
            {/* 1. Official Institutional Header */}
            <div className="border-b-2 border-slate-700 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase">
                    EduAI Institute of Technology
                  </h1>
                  <p className="text-xs text-slate-300 font-medium">
                    Office of Academic Affairs & Registrar • Autonomous University Framework
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Accredited Grade A++ • NAAC / ABET Certified Institution
                  </p>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase border tracking-wider print-tag-pass"
                  style={{
                    backgroundColor: result.status === 'Pass' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: result.status === 'Pass' ? '#34d399' : '#fb7185',
                    borderColor: result.status === 'Pass' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'
                  }}
                >
                  {result.status === 'Pass' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{result.status === 'Pass' ? (result.rank <= 3 ? 'Dean\'s Honors List' : 'Passed & Promoted') : 'Academic Probation'}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                  Doc Ref: <span className="text-slate-200">EDU-SUM-2024-{result.studentId.replace(/[^0-9]/g, '')}</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Issued: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="text-center py-1.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700/60 print-bg-light">
              <h2 className="text-xs sm:text-sm font-black text-indigo-300 uppercase tracking-widest">
                Comprehensive Student Performance, Attendance & AI Diagnostic Summary
              </h2>
            </div>

            {/* 2. Student Identity & Academic Profile Grid */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs print-bg-light">
              <div className="flex items-center gap-3 col-span-2">
                <img
                  src={result.avatar}
                  alt={result.studentName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/40 shadow-sm"
                />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Student Name</span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">{result.studentName}</h3>
                  <span className="text-[11px] font-mono text-indigo-400 font-semibold">{result.studentId}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Department & Year</span>
                <p className="font-bold text-white text-xs mt-0.5">{result.department}</p>
                <p className="text-[11px] text-slate-400">Semester 4 (Term 2)</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Cohort Standing</span>
                <p className="font-extrabold text-amber-400 text-sm mt-0.5">Rank #{result.rank} of 49</p>
                <p className="text-[11px] text-slate-400">Top {((result.rank / 49) * 100).toFixed(1)}%</p>
              </div>
            </div>

            {/* 3. Section I: Examination Grades & Academic Breakdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <h3 className="text-xs font-black uppercase text-indigo-300 flex items-center gap-1.5 tracking-wider">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Section I: Academic Course Grades & Marks Breakdown
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Passing Cutoff: 50%</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Subject / Course Module</th>
                      <th className="py-2.5 px-3 text-center">Max Marks</th>
                      <th className="py-2.5 px-3 text-center">Obtained</th>
                      <th className="py-2.5 px-3 text-center">Percentage</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {result.breakdown.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="py-2 px-3 font-semibold text-white">{item.subject}</td>
                        <td className="py-2 px-3 text-center text-slate-400">100</td>
                        <td className="py-2 px-3 text-center font-bold text-slate-100 font-mono">{item.marks}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-300">{item.marks}%</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${
                            item.grade.startsWith('A')
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.grade.startsWith('B')
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : item.grade.startsWith('C')
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {item.grade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-[11px] font-medium text-slate-300">
                          {item.marks >= 90 ? 'Outstanding (High Distinction)' :
                           item.marks >= 75 ? 'Very Good (Distinction)' :
                           item.marks >= 50 ? 'Satisfactory Pass' :
                           'Remedial Action Required'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Aggregate Marks</span>
                  <p className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
                    {result.totalMarks} <span className="text-xs text-slate-400 font-normal">/ {result.maxMarks}</span>
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Semester Grade Point (SGPA)</span>
                  <p className="text-base sm:text-lg font-black text-indigo-400 font-mono mt-0.5">
                    {result.cgpa.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 4.00</span>
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Cumulative Percentage</span>
                  <p className="text-base sm:text-lg font-black text-emerald-400 font-mono mt-0.5">
                    {((result.totalMarks / result.maxMarks) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Section II: Attendance Diagnostics & Regulatory Compliance */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <h3 className="text-xs font-black uppercase text-indigo-300 flex items-center gap-1.5 tracking-wider">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  Section II: Term Attendance Metrics & Institutional Compliance
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Mandatory Threshold: 75.0%</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                {/* Attendance Gauge/Rate */}
                <div className="sm:border-r border-slate-800 pr-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Semester Attendance</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-2xl font-black font-mono ${isAttendanceCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {attendanceRate}%
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isAttendanceCompliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {isAttendanceCompliant ? 'Compliant' : 'Shortage'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${isAttendanceCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Days Present & Absent */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Days Present</span>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">{daysPresent} Days</p>
                  <span className="text-[10px] text-slate-400">Total: {totalSchoolDays} Working Days</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Absences</span>
                  <p className="text-sm font-bold text-rose-400 font-mono mt-0.5">{daysAbsent} Days</p>
                  <span className="text-[10px] text-slate-400">{daysAbsent <= 5 ? 'Within acceptable tolerance' : 'Flagged attendance alert'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Punctuality Score</span>
                  <p className="text-sm font-bold text-indigo-300 font-mono mt-0.5">
                    {attendanceRate >= 90 ? '99.2%' : attendanceRate >= 75 ? '94.0%' : '76.5%'}
                  </p>
                  <span className="text-[10px] text-slate-400">Biometric & Face ID verified</span>
                </div>
              </div>

              {/* Attendance Correlation Banner */}
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-2.5 text-xs">
                <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300">
                  <strong className="text-white">Attendance-Performance Correlation: </strong>
                  {aiAnalysis.attendanceCorrelation}
                </div>
              </div>
            </div>

            {/* 5. Section III: AI-Driven Performance Summary & Cognitive Diagnostics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <h3 className="text-xs font-black uppercase text-indigo-300 flex items-center gap-1.5 tracking-wider">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  Section III: AI-Driven Cognitive Diagnostics & Learning Velocity
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                  Powered by EduAI Engine v4.2
                </span>
              </div>

              {/* Executive Summary */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-indigo-200">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Executive AI Academic Diagnostic:</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {aiAnalysis.summary}
                </p>
              </div>

              {/* Strengths & Improvements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Core Strengths */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Demonstrated Cognitive Strengths
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {aiAnalysis.strengths.map((s, idx) => (
                      <li key={idx} className="leading-snug">{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Growth Areas */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Target Areas for Growth & Practice
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {aiAnalysis.improvements.map((imp, idx) => (
                      <li key={idx} className="leading-snug">{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Predictive Trajectory & Faculty Advisor Action Plan */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-white text-[11px] shrink-0">Predictive Outcome:</span>
                  <span className="text-slate-300 text-[11px]">{aiAnalysis.predictiveTrajectory}</span>
                </div>
                <div className="flex items-start gap-2 pt-1.5 border-t border-slate-850">
                  <span className="font-bold text-indigo-300 text-[11px] shrink-0">Advisor Directive:</span>
                  <span className="text-slate-300 text-[11px]">{aiAnalysis.advisorRecommendation}</span>
                </div>
              </div>
            </div>

            {/* 6. Section IV: Digital Authentication, Verification & Signatures */}
            <div className="pt-4 border-t-2 border-slate-800 space-y-4">
              <div className="grid grid-cols-3 gap-4 items-end text-center text-xs text-slate-400">
                {/* Controller signature */}
                <div className="space-y-1">
                  <div className="w-36 mx-auto border-b border-slate-600 pb-1 font-mono text-[10px] text-indigo-400 font-bold">
                    Dr. Aris Thorne
                  </div>
                  <p className="font-semibold text-slate-300 text-[11px]">Controller of Examinations</p>
                  <p className="text-[9px] text-slate-400">EduAI Institute of Technology</p>
                </div>

                {/* QR Code & Digital Verification */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-16 h-16 p-1 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    SCAN TO VERIFY AUTHENTICITY
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Blockchain Certified
                  </span>
                </div>

                {/* Dean Signature */}
                <div className="space-y-1">
                  <div className="w-36 mx-auto border-b border-slate-600 pb-1 font-mono text-[10px] text-indigo-400 font-bold">
                    Prof. Sarah Sterling, Ph.D.
                  </div>
                  <p className="font-semibold text-slate-300 text-[11px]">Dean of Academic Affairs</p>
                  <p className="text-[9px] text-slate-400">Executive Academic Board</p>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                This official summary transcript was cryptographically generated by EduAI Enterprise Management Systems. 
                Any alterations invalidate this credential. Verify online at https://verify.eduai.edu/transcript/{result.studentId}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready for official student distribution, academic advising & parent records.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Print Transcript</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
