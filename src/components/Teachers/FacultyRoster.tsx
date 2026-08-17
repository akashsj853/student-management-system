import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  Clock,
  Plus,
  Search,
  Star,
  X,
  Building
} from 'lucide-react';
import { Teacher } from '../../types';

interface FacultyRosterProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

export const FacultyRoster: React.FC<FacultyRosterProps> = ({ teachers, setTeachers }) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // New Faculty State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newOffice, setNewOffice] = useState('Tech Wing Room 305');

  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === 'All' || t.department === selectedDept;
    return matchSearch && matchDept;
  });

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const newFaculty: Teacher = {
      id: `t_${Date.now()}`,
      name: newName,
      email: newEmail,
      teacherId: `FAC-${newDept.slice(0, 2).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      department: newDept,
      subjects: ['Intro to AI', 'Software Eng.'],
      status: 'Active',
      performance: 'Excellent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      rating: 4.8,
      salary: 8800,
      phone: '+1 (555) 333-8899',
      officeRoom: newOffice,
      joinDate: new Date().toISOString().split('T')[0],
      classesCount: 3
    };

    setTeachers([newFaculty, ...teachers]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            Faculty & Academic Staff Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Managing {teachers.length} professors, lecturers, and lab instructors
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty by name, department, or office..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Biotechnology">Biotechnology</option>
            <option value="Humanities & Arts">Humanities & Arts</option>
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header: Photo & Name & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700 group-hover:border-indigo-400 transition-colors"
                  />
                  <div>
                    <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">
                      {t.name}
                    </h4>
                    <p className="text-xs text-indigo-400 font-mono font-medium">{t.teacherId}</p>
                    <p className="text-[11px] text-slate-400">{t.department}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  t.status === 'Active'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  {t.status}
                </span>
              </div>

              {/* Office & Contact Info */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="font-mono">{t.officeRoom}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>

              {/* Assigned Course Chips */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Assigned Subjects:</span>
                <div className="flex flex-wrap gap-1.5">
                  {t.subjects.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Metrics Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{t.rating || 4.9}</span>
                <span className="text-slate-400 font-normal text-[11px]">/ 5.0</span>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">{t.classesCount * 4} hrs/wk</span>
              </div>

              <button
                onClick={() => setSelectedTeacher(t)}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
              >
                Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Faculty Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Add Faculty Member
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaculty} className="my-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Robert Lang"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="r.lang@eduai.edu"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Humanities & Arts">Humanities & Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Office / Cabin Location</label>
                <input
                  type="text"
                  value={newOffice}
                  onChange={(e) => setNewOffice(e.target.value)}
                  placeholder="e.g. Tech Wing Room 402"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
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
                  Save Faculty Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
