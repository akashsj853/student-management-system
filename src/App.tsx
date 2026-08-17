import React, { useState } from 'react';
import { UserRole } from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE_HEATMAP,
  INITIAL_DEFAULTERS,
  INITIAL_EXAMS,
  INITIAL_EXAM_RESULTS,
  INITIAL_FEE_LEDGER,
  INITIAL_NOTIFICATIONS,
  INITIAL_AI_INSIGHTS,
  INITIAL_HOSTEL_ROOMS,
  INITIAL_BUS_ROUTES,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_CAMPUS_LICENSES
} from './data/mockData';

// Components
import { LoginScreen } from './components/Auth/LoginScreen';
import { Sidebar } from './components/Navigation/Sidebar';
import { Header } from './components/Navigation/Header';
import { PlatformOverview } from './components/Dashboard/PlatformOverview';
import { StudentDirectory } from './components/Students/StudentDirectory';
import { FacultyRoster } from './components/Teachers/FacultyRoster';
import { AttendanceAnalytics } from './components/Attendance/AttendanceAnalytics';
import { WeeklyTimetable } from './components/Timetable/WeeklyTimetable';
import { ExamResults } from './components/Exams/ExamResults';
import { FeeManagement } from './components/Finance/FeeManagement';
import { CampusServices } from './components/Campus/CampusServices';
import { LicenseManagement } from './components/Licenses/LicenseManagement';
import { AIChatModal } from './components/AI/AIChatModal';
import { ParentCommModal } from './components/Parent/ParentCommModal';
import { RemedialPlanModal } from './components/Common/RemedialPlanModal';
import { AuditLogs } from './components/Audit/AuditLogs';

export function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  // Navigation state
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Data State
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [attendanceHeatmap, setAttendanceHeatmap] = useState(INITIAL_ATTENDANCE_HEATMAP);
  const [defaulters, setDefaulters] = useState(INITIAL_DEFAULTERS);
  const [examRecords, setExamRecords] = useState(INITIAL_EXAMS);
  const [examResults, setExamResults] = useState(INITIAL_EXAM_RESULTS);
  const [feeLedger, setFeeLedger] = useState(INITIAL_FEE_LEDGER);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [libraryBooks, setLibraryBooks] = useState(INITIAL_LIBRARY_BOOKS);
  const [hostelRooms, setHostelRooms] = useState(INITIAL_HOSTEL_ROOMS);
  const [busRoutes, setBusRoutes] = useState(INITIAL_BUS_ROUTES);
  const [licenses, setLicenses] = useState(INITIAL_CAMPUS_LICENSES);

  // Global Modals State
  const [showAIChat, setShowAIChat] = useState(false);
  const [parentCommStudent, setParentCommStudent] = useState<{ name: string; reason: string } | null>(null);
  const [showGlobalRemedial, setShowGlobalRemedial] = useState(false);

  // Handle Login
  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#070d19] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSidebarOpen(false);
        }}
        currentRole={currentRole}
        onOpenAIChat={() => setShowAIChat(true)}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Sticky Header */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          onOpenAIChat={() => setShowAIChat(true)}
          setSidebarOpen={setSidebarOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {currentTab === 'dashboard' && (
            <PlatformOverview
              students={students}
              teachers={teachers}
              exams={examRecords}
              insights={INITIAL_AI_INSIGHTS}
              onNavigate={setCurrentTab}
              onOpenQR={() => setCurrentTab('attendance')}
              onAddStudent={() => setCurrentTab('students')}
            />
          )}

          {currentTab === 'students' && (
            <StudentDirectory
              students={students}
              setStudents={setStudents}
              onOpenRemedial={() => setShowGlobalRemedial(true)}
            />
          )}

          {currentTab === 'teachers' && (
            <FacultyRoster
              teachers={teachers}
              setTeachers={setTeachers}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceAnalytics
              heatmapData={attendanceHeatmap}
              defaulters={defaulters}
              onOpenParentAlert={(studentName, details) => {
                setParentCommStudent({ name: studentName, reason: details });
              }}
            />
          )}

          {currentTab === 'courses' && (
            <WeeklyTimetable
              timetable={timetable}
              setTimetable={setTimetable}
              courses={courses}
            />
          )}

          {currentTab === 'exams' && (
            <ExamResults results={examResults} />
          )}

          {currentTab === 'finance' && (
            <FeeManagement
              ledger={feeLedger}
              setLedger={setFeeLedger}
              onOpenParentAlert={(studentName, details) => {
                setParentCommStudent({ name: studentName, reason: details });
              }}
            />
          )}

          {currentTab === 'campus' && (
            <CampusServices
              hostelRooms={hostelRooms}
              setHostelRooms={setHostelRooms}
              busRoutes={busRoutes}
              setBusRoutes={setBusRoutes}
              libraryBooks={libraryBooks}
              setLibraryBooks={setLibraryBooks}
              currentRole={currentRole}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'licenses' && (
            <LicenseManagement
              licenses={licenses}
              setLicenses={setLicenses}
              currentRole={currentRole}
            />
          )}

          {currentTab === 'audit' && (
            <AuditLogs currentRole={currentRole} />
          )}

          {currentTab === 'settings' && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white">Campus Platform Configuration</h2>
                <p className="text-xs text-slate-400 mt-1">Configure automated AI grading heuristics, Gemini endpoints, and role permissions</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">AI Remedial Syllabus Generation</h4>
                    <p className="text-slate-400">Synthesize 2-week student intervention plans upon quiz underperformance</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600" />
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Dynamic Geofenced Attendance QRs</h4>
                    <p className="text-slate-400">Expire QR codes after 60 seconds with 50-meter classroom radius validation</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600" />
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Autonomous Parent Alert Gateway</h4>
                    <p className="text-slate-400">Trigger email/SMS warnings when student falls below 75% attendance</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global AI Copilot Modal */}
      {showAIChat && (
        <AIChatModal
          onClose={() => setShowAIChat(false)}
          onNavigateTab={(tab) => {
            setCurrentTab(tab);
            setShowAIChat(false);
          }}
        />
      )}

      {/* Parent Dispatch Alert Modal */}
      {parentCommStudent && (
        <ParentCommModal
          studentName={parentCommStudent.name}
          defaultReason={parentCommStudent.reason}
          onClose={() => setParentCommStudent(null)}
        />
      )}

      {/* Global Remedial Plan Modal */}
      {showGlobalRemedial && (
        <RemedialPlanModal
          subject="CS 101: Data Structures & Algorithms"
          onClose={() => setShowGlobalRemedial(false)}
        />
      )}
    </div>
  );
}

export default App;
