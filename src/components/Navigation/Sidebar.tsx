import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  CalendarCheck,
  Award,
  DollarSign,
  Building2,
  Settings,
  Sparkles,
  LifeBuoy,
  LogOut,
  ChevronRight,
  ShieldCheck,
  QrCode,
  UserPlus,
  AlertTriangle,
  KeyRound,
  GraduationCap,
  Bus,
  CheckCircle2,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  onOpenAIChat: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  onOpenAIChat,
  isOpen,
  setIsOpen,
  onLogout
}) => {
  const menuSections = [
    {
      title: 'Core & Intelligence',
      items: [
        {
          id: 'dashboard',
          label: 'Institutional Overview',
          shortLabel: 'Dashboard',
          icon: LayoutDashboard,
          badge: 'Live',
          badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        }
      ]
    },
    {
      title: 'Academic Management',
      items: [
        {
          id: 'students',
          label: 'Student Directory',
          shortLabel: 'Students',
          icon: Users,
          badge: '1,240',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        },
        {
          id: 'teachers',
          label: 'Faculty & Staff Roster',
          shortLabel: 'Faculty',
          icon: Briefcase,
          badge: '84',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        },
        {
          id: 'courses',
          label: 'Courses & Timetable',
          shortLabel: 'Timetable',
          icon: BookOpen,
          badge: 'AI Solver',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        },
        {
          id: 'attendance',
          label: 'Attendance & Dropout ML',
          shortLabel: 'Attendance',
          icon: CalendarCheck,
          badge: '4 Alert',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        },
        {
          id: 'exams',
          label: 'Exams & Transcripts',
          shortLabel: 'Exams & Grades',
          icon: Award,
          badge: 'GPA 3.82',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        }
      ]
    },
    {
      title: 'Administration & Campus',
      items: [
        {
          id: 'audit',
          label: 'Audit Logs & Governance',
          shortLabel: 'Audit Logs',
          icon: ShieldCheck,
          badge: 'SHA-256',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        },
        {
          id: 'finance',
          label: 'Finance & Fee Ledger',
          shortLabel: 'Finance & Fees',
          icon: DollarSign,
          badge: '$42.5k',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        },
        {
          id: 'campus',
          label: 'Hostel, Transit & Library',
          shortLabel: 'Hostel & Transit',
          icon: Building2,
          badge: 'GPS Active',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        },
        {
          id: 'licenses',
          label: 'Software Licenses & Hub',
          shortLabel: 'Licenses',
          icon: KeyRound,
          badge: '8 Active',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        },
        {
          id: 'settings',
          label: 'Platform Configuration',
          shortLabel: 'Settings',
          icon: Settings
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#09101f] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out shrink-0 h-full select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-[#070c18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
              E
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">EduAI</span>
                <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  CAMPUS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Management</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Copilot Primary Launcher */}
        <div className="p-3 bg-[#0a1224] border-b border-slate-800/60">
          <button
            onClick={() => {
              onOpenAIChat();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-indigo-950/80 to-purple-950/60 border border-indigo-500/40 hover:border-indigo-400 text-slate-200 hover:text-white transition-all shadow-md shadow-indigo-950/40 group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white group-hover:text-indigo-200">
                  EduAI Copilot
                </span>
                <span className="block text-[10px] text-slate-400">Gemini 3.7 Intelligence</span>
              </div>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                <span>{section.title}</span>
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1 rounded-lg ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-slate-400 group-hover:text-indigo-300 group-hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold border ${
                            isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-90" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Quick Actions Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                Quick Actions
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setCurrentTab('attendance');
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scan QR</span>
              </button>
              <button
                onClick={() => {
                  setCurrentTab('students');
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>+ Student</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer: User Profile & Controls */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#060c18]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Profile"
              className="w-8 h-8 rounded-xl object-cover border border-indigo-500/40"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-white truncate">Dr. Robert Torres</p>
                <ShieldCheck className="w-3 h-3 text-indigo-400 shrink-0" />
              </div>
              <p className="text-[10px] text-indigo-300 font-semibold capitalize truncate">
                {currentRole} Access • Dean
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => {
                setCurrentTab('settings');
                setIsOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium hover:text-white rounded-lg hover:bg-slate-800/70 transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Help & Docs</span>
            </button>
            <div className="w-px h-3.5 bg-slate-800" />
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
