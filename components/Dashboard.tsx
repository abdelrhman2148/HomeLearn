import React from 'react';
import { Lesson, Student } from '../types';
import { AlertTriangle, Calendar, CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import HeroSection from './HeroSection';

interface DashboardProps {
  lessons: Lesson[];
  students: Student[];
  onToggleTask: (lessonId: string, taskId: string) => void;
  onViewChange: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lessons, students, onToggleTask, onViewChange }) => {
  const today = new Date().toISOString().split('T')[0];
  const threeDaysOut = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  // Risk: Overdue items - STRICT RED
  const overdueLessons = lessons.filter(l => l.date < today && !l.isCompleted);
  // Today: Active
  const todaysLessons = lessons.filter(l => l.date === today);
  // Upcoming
  const upcomingLessons = lessons.filter(l => l.date > today && l.date <= threeDaysOut);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Standard Content Container - Restoring padding for the actual dashboard content */}
      <div className="p-4 lg:p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
        
        {/* Header - Simple & Clean */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Good Morning</h1>
            <p className="text-lg text-stone-500 mt-1 font-medium">Overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span>School Day {Math.floor(Math.random() * 180)}</span>
            </div>
          </div>
        </div>

        {/* RISK SECTION - FLOATING ALERT */}
        {overdueLessons.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="p-2.5 bg-white rounded-xl border border-red-100 shrink-0 text-red-600 shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 text-lg">Action Required</h3>
              <p className="text-red-700 mt-1">
                You have {overdueLessons.length} overdue lesson{overdueLessons.length !== 1 ? 's' : ''}.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {overdueLessons.slice(0, 3).map(l => (
                  <div key={l.id} className="flex items-center gap-3 text-sm text-red-900 bg-white/60 px-3 py-2 rounded-lg border border-red-100/50">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="font-semibold">{l.subject}:</span>
                    <span className="truncate">{l.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TODAY SECTION - FLOATING CARDS */}
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            Today's Schedule
          </h2>
          
          {students.length === 0 ? (
            <div className="bg-stone-50 p-10 rounded-3xl border-2 border-dashed border-stone-200 text-center">
              <p className="text-stone-500 mb-2 text-lg">No students added yet.</p>
            </div>
          ) : todaysLessons.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-stone-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-stone-300" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">All Clear Today</h3>
              <p className="text-stone-500 mb-6">No lessons scheduled. Enjoy the break!</p>
              <button 
                onClick={() => onViewChange('calendar')}
                className="text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-6 py-2.5 rounded-full transition-colors"
              >
                Plan a lesson
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {students.map(student => {
                const studentLessons = todaysLessons.filter(l => l.studentId === student.id);
                if (studentLessons.length === 0) return null;

                return (
                  <div key={student.id} className="bg-white rounded-3xl shadow-sm border border-stone-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {/* Card Header */}
                    <div className="px-6 py-5 border-b border-stone-50 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-${student.color}-100 flex items-center justify-center text-${student.color}-600 font-bold text-xl`}>
                          {student.name[0]}
                        </div>
                        <h3 className="font-bold text-xl text-stone-900">{student.name}</h3>
                      </div>
                      <span className="text-sm font-semibold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                        {studentLessons.filter(l => l.isCompleted).length} / {studentLessons.length} Done
                      </span>
                    </div>

                    {/* Lesson List */}
                    <div className="flex-1 p-3 space-y-1">
                      {studentLessons.map(lesson => (
                        <div 
                          key={lesson.id} 
                          className={`group flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 ${
                            lesson.isCompleted 
                              ? 'bg-stone-50/50 opacity-60' 
                              : 'hover:bg-stone-50 hover:scale-[1.01] hover:shadow-sm'
                          }`}
                        >
                          <button 
                            onClick={() => {
                              if (lesson.tasks.length > 0) {
                                onToggleTask(lesson.id, lesson.tasks[0].id);
                              }
                            }}
                            className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                              ${lesson.isCompleted 
                                ? 'bg-green-500 border-green-500 text-white scale-110' 
                                : 'bg-white border-stone-300 text-transparent hover:border-indigo-400'
                              }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4 className={`text-base font-semibold leading-tight ${lesson.isCompleted ? 'text-stone-500 line-through' : 'text-stone-900'}`}>
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-${student.color}-50 text-${student.color}-700`}>
                                {lesson.subject}
                              </span>
                              <span className="text-stone-300">•</span>
                              <span className="text-xs font-medium text-stone-400">{lesson.durationMinutes} min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* UPCOMING - SIMPLE LIST */}
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-6">Coming Up</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden divide-y divide-stone-50">
            {upcomingLessons.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-sm">Nothing scheduled for the next 3 days.</div>
            ) : (
              upcomingLessons.slice(0, 5).map(lesson => (
                <div key={lesson.id} className="p-5 flex items-center justify-between group hover:bg-stone-50 transition-colors duration-200">
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-stone-50 rounded-2xl border border-stone-100 text-stone-600">
                      <span className="text-[10px] font-bold uppercase tracking-wide">
                          {new Date(lesson.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-xl font-bold leading-none mt-0.5">
                          {new Date(lesson.date).getDate()}
                      </span>
                    </div>
                    <div>
                        <h4 className="text-base font-semibold text-stone-900 group-hover:text-indigo-700 transition-colors">{lesson.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                          <p className="text-xs font-medium text-stone-500">{lesson.subject}</p>
                        </div>
                    </div>
                  </div>
                  <div className="text-stone-300 group-hover:translate-x-1 transition-transform duration-200">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              ))
            )}
            <button 
              onClick={() => onViewChange('calendar')}
              className="w-full py-5 text-sm text-center text-stone-500 font-semibold hover:bg-stone-50 hover:text-indigo-600 transition-colors"
            >
              Open Full Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;