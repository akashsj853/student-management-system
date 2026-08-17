import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  X
} from 'lucide-react';
import { UserRole, NotificationItem } from '../../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenAIChat: () => void;
  setSidebarOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  onOpenAIChat,
  setSidebarOpen,
  notifications,
  setNotifications,
  searchQuery,
  setSearchQuery
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator (Dean)',
    teacher: 'Faculty Member',
    student: 'Student Portal',
    parent: 'Parent / Guardian',
    superadmin: 'Super Admin'
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b1120]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left side: Hamburger & Title/Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>EduAI Campus</span>
            <span>/</span>
            <span className="capitalize text-indigo-400 font-semibold">{currentTab}</span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-white capitalize leading-tight">
            {currentTab === 'dashboard' ? 'Institutional Overview' :
             currentTab === 'students' ? 'Student Enrollment & Records' :
             currentTab === 'teachers' ? 'Faculty & Staff Roster' :
             currentTab === 'courses' ? 'Master Timetable & Curriculum' :
             currentTab === 'attendance' ? 'Attendance & Predictive Analytics' :
             currentTab === 'exams' ? 'Examination & Transcript Analytics' :
             currentTab === 'finance' ? 'Fee Management & Accounts' :
             currentTab === 'campus' ? 'Hostel Accommodation & Live Transit Fleet' :
             currentTab === 'licenses' ? 'Institutional Software & License Hub' :
             currentTab === 'audit' ? 'Audit Logs & Cryptographic Ledger' : 'System Settings'}
          </h1>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md hidden md:block relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, faculty, courses, transactions (e.g. Elena, CS 101)..."
            className="w-full pl-9 pr-12 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Quick Menu Matches Dropdown */}
        {searchQuery.trim().length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs animate-fadeIn space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Menu Jump
            </div>
            {[
              { id: 'dashboard', label: 'Institutional Dashboard Overview', match: ['dash', 'home', 'overview', 'kpi'] },
              { id: 'students', label: 'Student Directory & Records', match: ['stud', 'enroll', 'gpa', 'id'] },
              { id: 'teachers', label: 'Faculty & Staff Roster', match: ['teach', 'fac', 'prof', 'staff', 'cabin'] },
              { id: 'courses', label: 'Master Timetable & Curriculum', match: ['cours', 'time', 'class', 'sched', 'clash'] },
              { id: 'attendance', label: 'Attendance & Dropout Predictor', match: ['atten', 'absent', 'defaul', 'qr', 'face'] },
              { id: 'exams', label: 'Examinations & Transcripts', match: ['exam', 'result', 'grade', 'rank', 'transcript'] },
              { id: 'finance', label: 'Fee Management & Accounts', match: ['fee', 'finan', 'pay', 'due', 'receipt', 'money'] },
              { id: 'campus', label: 'Hostel, Transit & Library Services', match: ['camp', 'host', 'bus', 'trans', 'room', 'dorm', 'bed', 'fleet', 'gps', 'pass', 'book', 'lib'] },
              { id: 'licenses', label: 'Institutional Software & License Hub', match: ['licen', 'soft', 'matlab', 'office', 'adobe', 'aws', 'jetbrains', 'spss', 'key', 'compliance', 'po', 'seats'] },
              { id: 'audit', label: 'Audit Logs & Governance Ledger', match: ['audit', 'log', 'security', 'hash', 'grade change', 'attendance change', 'login', 'timestamp', 'accountability', 'sha'] },
              { id: 'settings', label: 'Campus Platform Settings', match: ['set', 'config', 'pref', 'api'] }
            ]
              .filter(m =>
                m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.match.some(keyword => searchQuery.toLowerCase().includes(keyword))
              )
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-indigo-600/30 flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-[10px] text-indigo-400 uppercase font-mono">Jump →</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Right side: AI pill, Notifications, Role Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* AI Assistant Pill */}
        <button
          onClick={onOpenAIChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all shadow-sm group hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors border border-slate-800"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto my-2">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setNotifications(prev =>
                        prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
                      );
                    }}
                    className={`py-3 px-2 flex gap-3 cursor-pointer rounded-lg hover:bg-slate-800/50 transition-colors ${
                      !item.read ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {item.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white">{item.title}</p>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline font-semibold">{roleLabels[currentRole]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Portal View
              </div>
              {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentRole === r
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="capitalize">{roleLabels[r]}</span>
                  {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
