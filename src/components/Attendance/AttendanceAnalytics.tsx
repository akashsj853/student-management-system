import React, { useState } from 'react';
import {
  CalendarCheck,
  QrCode,
  Users,
  AlertTriangle,
  Mail,
  Phone,
  Sparkles,
  TrendingDown,
  Camera,
  CheckCircle2,
  X,
  Send,
  Loader2,
  Calendar,
  ChevronRight,
  Eye
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AttendanceDayRecord, DefaulterStudent } from '../../types';

interface AttendanceAnalyticsProps {
  heatmapData: AttendanceDayRecord[];
  defaulters: DefaulterStudent[];
  onOpenParentAlert: (studentName: string, details: string) => void;
}

const DROPOUT_PREDICTION_DATA = [
  { cohort: 'CS 1st Yr', riskStudents: 3, total: 140 },
  { cohort: 'CS 2nd Yr', riskStudents: 5, total: 135 },
  { cohort: 'EE 2nd Yr', riskStudents: 2, total: 95 },
  { cohort: 'ME 3rd Yr', riskStudents: 2, total: 80 },
];

export const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({
  heatmapData,
  defaulters,
  onOpenParentAlert
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<AttendanceDayRecord | null>(heatmapData[28]); // Nov 29 default
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceSuccess, setFaceSuccess] = useState<string | null>(null);

  const handleSimulateFaceRecognition = () => {
    setFaceScanning(true);
    setFaceSuccess(null);
    setTimeout(() => {
      setFaceScanning(false);
      setFaceSuccess('Elena Rodriguez (CS-2023-089) Marked Present at 08:58 AM');
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Metric Cards matching Image 5.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Attendance */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">92.4%</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1">+1.8% vs yesterday</p>
          </div>
        </div>

        {/* Total Absences */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Absences</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">143</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Across 4 departments</p>
          </div>
        </div>

        {/* Predicted Dropouts */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900/90 border border-indigo-500/40 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">Predicted Dropout Risk</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">12 Students</h3>
            <p className="text-xs text-amber-400 font-medium mt-1">High risk due to &lt;75% att.</p>
          </div>
        </div>

        {/* Quick Check-in Actions */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">Automated Taker</span>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowQRModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </button>
            <button
              onClick={() => setShowFaceModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>AI Face ID</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Heatmap Grid + Action Required Defaulters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Heatmap (2 cols) matching Image 5.png */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Monthly Attendance Heatmap (November 2023)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Campus-wide presence density (target: 95%)
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              Term 2 • Week 12
            </span>
          </div>

          {/* 30-Day Heatmap Grid */}
          <div className="my-6">
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 mb-2">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {heatmapData.map((d) => {
                const isWeekend = d.status === 'weekend';
                const isHoliday = d.status === 'holiday';
                const isSelected = selectedDay?.date === d.date;

                return (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDay(d)}
                    className={`aspect-square rounded-xl p-1.5 flex flex-col justify-between items-center transition-all border ${
                      isSelected
                        ? 'ring-2 ring-indigo-400 border-indigo-400'
                        : 'border-transparent'
                    } ${
                      isWeekend
                        ? 'bg-slate-950/40 text-slate-400 border-slate-900'
                        : isHoliday
                        ? 'bg-amber-950/20 text-amber-400 border-amber-500/20'
                        : d.attendancePercent >= 90
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50'
                        : d.attendancePercent >= 80
                        ? 'bg-blue-950/40 text-blue-300 border-blue-500/30 hover:bg-blue-900/50'
                        : 'bg-rose-950/40 text-rose-300 border-rose-500/30 hover:bg-rose-900/50'
                    }`}
                  >
                    <span className="text-[11px] font-bold self-start">{d.day}</span>
                    {!isWeekend && !isHoliday && (
                      <span className="text-[10px] font-mono font-semibold">{d.attendancePercent}%</span>
                    )}
                    {isWeekend && <span className="text-[8px] opacity-40">OFF</span>}
                    {isHoliday && <span className="text-[8px] font-bold">HOL</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Bar */}
          {selectedDay && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Selected Date: <strong className="text-white">{selectedDay.date}</strong></span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">Attendance: <strong className="text-emerald-400">{selectedDay.attendancePercent}%</strong></span>
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold">1,146 / 1,240 Present</span>
            </div>
          )}
        </div>

        {/* Action Required: Defaulters List matching Image 5.png */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Action Required</h4>
                <p className="text-[11px] text-slate-400">Defaulters below 75% attendance</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300">
              {defaulters.length} Critical
            </span>
          </div>

          {/* Student Defaulter Cards */}
          <div className="space-y-3 flex-1 overflow-y-auto">
            {defaulters.map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={d.avatar}
                      alt={d.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{d.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{d.studentId} • {d.department}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {d.attendance}% Att.
                  </span>
                </div>

                <div className="flex gap-2 pt-1 border-t border-slate-800/60">
                  <button
                    onClick={() => onOpenParentAlert(d.name, `Attendance slipped to ${d.attendance}% in core classes.`)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[11px] font-semibold transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Alert Parent</span>
                  </button>
                  <button
                    onClick={() => alert(`Calling Parent at ${d.parentPhone}`)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                    title="Direct Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => onOpenParentAlert('All 12 Flagged Defaulters', 'Batch notification regarding semester eligibility')}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs transition-all shadow-md"
            >
              Broadcast Batch Warnings to Parents
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Chart: Predictive Dropout Analysis */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI Predictive Dropout Risk by Cohort
            </h3>
            <p className="text-xs text-slate-400">
              Correlating attendance declines with midterm assessment grades
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400">Model Accuracy: 94.2%</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DROPOUT_PREDICTION_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="cohort" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="total" name="Total Students" fill="#334155" radius={[6, 6, 0, 0]} />
              <Bar dataKey="riskStudents" name="High Risk Flagged" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#0f172a] border border-indigo-500/40 rounded-3xl p-6 shadow-2xl text-center">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Session QR Code</h3>
            <p className="text-xs text-slate-400 mt-1">CS 101 Lecture • Lab 3 • Valid for 60s</p>

            {/* Simulated Dynamic QR Box */}
            <div className="my-5 p-6 bg-white rounded-2xl inline-block shadow-xl">
              <div className="w-48 h-48 bg-slate-900 rounded-lg flex items-center justify-center p-2">
                <QrCode className="w-44 h-44 text-white" />
              </div>
            </div>

            <p className="text-[11px] text-emerald-400 font-mono animate-pulse">Geo-fenced within Campus Radius (50m)</p>
            <button
              onClick={() => setShowQRModal(false)}
              className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

      {/* AI Face Recognition Scanner Modal */}
      {showFaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                AI Classroom Facial Recognition
              </h3>
              <button
                onClick={() => setShowFaceModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
                alt="Classroom"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Scanning crosshairs simulation */}
              <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-2xl flex items-center justify-center">
                {faceScanning && (
                  <div className="w-full h-1 bg-emerald-400 shadow-lg shadow-emerald-400 animate-bounce" />
                )}
              </div>

              {faceSuccess && (
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                  {faceSuccess}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSimulateFaceRecognition}
                disabled={faceScanning}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {faceScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                <span>Scan Classroom Camera</span>
              </button>
              <button
                onClick={() => setShowFaceModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
