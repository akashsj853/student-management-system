import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Award,
  AlertTriangle,
  TrendingUp,
  Download,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Eye,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { Student, PerformanceStatus } from '../../types';
import { IDCardModal } from '../Common/IDCardModal';

interface StudentDirectoryProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  onOpenRemedial?: () => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  setStudents,
  onOpenRemedial
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStudentForID, setSelectedStudentForID] = useState<Student | null>(null);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newSemester, setNewSemester] = useState('Semester 4');
  const [newYear, setNewYear] = useState('Year 2');
  const [newSection, setNewSection] = useState('Section A');
  const [newPhone, setNewPhone] = useState('+1 (555) 000-1122');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());

      const matchDept = selectedDept === 'All' || s.department === selectedDept;
      const matchSem = selectedSemester === 'All' || s.semester === selectedSemester;
      const matchStatus = selectedStatus === 'All' || s.performanceStatus === selectedStatus;

      return matchSearch && matchDept && matchSem && matchStatus;
    });
  }, [students, search, selectedDept, selectedSemester, selectedStatus]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `s_${Date.now()}`,
      name: newName,
      email: newEmail,
      studentId: `CS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      department: newDept,
      semester: newSemester,
      year: newYear,
      section: newSection,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      performanceStatus: 'Excelling',
      attendanceRate: 100,
      gpa: 4.0,
      totalMarks: 950,
      phone: newPhone,
      parentName: newParentName || 'Guardian',
      parentPhone: newParentPhone || '+1 (555) 999-0000',
      parentEmail: 'guardian@gmail.com',
      bloodGroup: 'O+',
      address: 'Campus Dormitory Block B',
      enrollmentDate: new Date().toISOString().split('T')[0],
      dob: '2004-01-01',
      feesPending: 0,
      feesStatus: 'Paid',
      courses: ['CS 101', 'MTH 204']
    };

    setStudents([newStudent, ...students]);
    setShowAddModal(false);
    // Reset form
    setNewName('');
    setNewEmail('');
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to archive this student record?')) {
      setStudents(students.filter(s => s.id !== id));
      if (selectedStudentProfile?.id === id) {
        setSelectedStudentProfile(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Student Directory & Academic Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Managing {students.length} active undergraduate and postgraduate students
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const csv = students.map(s => `${s.studentId},${s.name},${s.department},${s.gpa},${s.attendanceRate}%`).join('\n');
              const blob = new Blob([`Student ID,Name,Department,GPA,Attendance\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'students_export.csv';
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Student</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar matching Image 3.png */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Eng.">Electrical Eng.</option>
              <option value="Mechanical Eng.">Mechanical Eng.</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Semesters</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 6">Semester 6</option>
            </select>
          </div>

          {/* Performance AI Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Performance Levels</option>
              <option value="Excelling">Excelling (GPA &gt; 3.7)</option>
              <option value="Improving">Improving (GPA 3.0 - 3.7)</option>
              <option value="At Risk">At Risk (GPA &lt; 3.0 or Att &lt; 75%)</option>
            </select>
          </div>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800">
          <span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{students.filter(s => s.performanceStatus === 'Excelling').length} Excelling</span>
          <span>•</span>
          <span className="text-rose-400 font-semibold">{students.filter(s => s.performanceStatus === 'At Risk').length} At Risk</span>
        </div>
      </div>

      {/* Main Students Table matching Image 3.png */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Section / Sem</th>
                <th className="py-3 px-3">AI Status</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">CGPA</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors group">
                  {/* Name & Avatar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{s.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{s.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="py-3 px-3 font-mono font-medium text-slate-300">
                    {s.studentId}
                  </td>

                  {/* Department */}
                  <td className="py-3 px-3 text-slate-300 font-medium">
                    {s.department}
                  </td>

                  {/* Section & Sem */}
                  <td className="py-3 px-3 text-slate-400">
                    <span className="text-slate-200 font-medium">{s.section}</span> • {s.semester}
                  </td>

                  {/* AI Status */}
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      s.performanceStatus === 'Excelling'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : s.performanceStatus === 'Improving'
                        ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      {s.performanceStatus === 'Excelling' ? <CheckCircle2 className="w-3 h-3" /> :
                       s.performanceStatus === 'Improving' ? <TrendingUp className="w-3 h-3" /> :
                       <AlertTriangle className="w-3 h-3" />}
                      {s.performanceStatus}
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-3">
                    <div className="w-24">
                      <div className="flex justify-between text-[10px] font-semibold mb-1">
                        <span className={s.attendanceRate >= 85 ? 'text-emerald-400' : s.attendanceRate >= 75 ? 'text-amber-400' : 'text-rose-400'}>
                          {s.attendanceRate}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.attendanceRate >= 85 ? 'bg-emerald-500' : s.attendanceRate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${s.attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* GPA */}
                  <td className="py-3 px-3 font-bold text-white">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                      {s.gpa.toFixed(2)}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedStudentProfile(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedStudentForID(s)}
                        className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition-colors"
                        title="View Student ID Badge"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Archive Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Drawer / Modal */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentProfile.avatar}
                  alt={selectedStudentProfile.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedStudentProfile.name}</h3>
                  <p className="text-xs text-indigo-400 font-mono">{selectedStudentProfile.studentId} • {selectedStudentProfile.department}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="my-6 space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Cumulative GPA</span>
                  <span className="text-lg font-bold text-indigo-400 mt-1 block">{selectedStudentProfile.gpa.toFixed(2)} / 4.0</span>
                </div>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Attendance</span>
                  <span className={`text-lg font-bold mt-1 block ${selectedStudentProfile.attendanceRate >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedStudentProfile.attendanceRate}%
                  </span>
                </div>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Fee Balance</span>
                  <span className={`text-lg font-bold mt-1 block ${selectedStudentProfile.feesPending === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ${selectedStudentProfile.feesPending}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Current Rank</span>
                  <span className="text-lg font-bold text-white mt-1 block">#{selectedStudentProfile.rank || 1}</span>
                </div>
              </div>

              {/* Contact & Parent Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    Student Contact
                  </h4>
                  <p><span className="text-slate-400">Phone:</span> <span className="text-slate-200">{selectedStudentProfile.phone}</span></p>
                  <p><span className="text-slate-400">Email:</span> <span className="text-slate-200">{selectedStudentProfile.email}</span></p>
                  <p><span className="text-slate-400">Address:</span> <span className="text-slate-200">{selectedStudentProfile.address}</span></p>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Parent / Guardian Details
                  </h4>
                  <p><span className="text-slate-400">Parent Name:</span> <span className="text-slate-200 font-semibold">{selectedStudentProfile.parentName}</span></p>
                  <p><span className="text-slate-400">Phone:</span> <span className="text-slate-200">{selectedStudentProfile.parentPhone}</span></p>
                  <p><span className="text-slate-400">Email:</span> <span className="text-slate-200">{selectedStudentProfile.parentEmail}</span></p>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div>
                <h4 className="font-bold text-white text-xs mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Enrolled Course Modules
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudentProfile.courses.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-slate-200 border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedStudentForID(selectedStudentProfile);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25"
              >
                <Award className="w-4 h-4" />
                <span>View Digital ID Badge</span>
              </button>
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Enroll New Student
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="my-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Campus Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="jordan.m@eduai.edu"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Eng.">Electrical Eng.</option>
                    <option value="Mechanical Eng.">Mechanical Eng.</option>
                    <option value="Biotechnology">Biotechnology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Section</label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    placeholder="e.g. Robert Miller"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Parent Contact Phone</label>
                  <input
                    type="text"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    placeholder="+1 (555) 000-9988"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/25"
                >
                  Save & Generate ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital ID Card Modal */}
      {selectedStudentForID && (
        <IDCardModal
          student={selectedStudentForID}
          onClose={() => setSelectedStudentForID(null)}
        />
      )}
    </div>
  );
};
