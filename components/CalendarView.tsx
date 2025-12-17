import React, { useState } from 'react';
import { Lesson, Student, SubscriptionTier } from '../types';
import { ChevronLeft, ChevronRight, CheckSquare, Square, Trash2, Plus, Calendar as CalendarIcon, Printer, Lock } from 'lucide-react';

interface CalendarViewProps {
  lessons: Lesson[];
  students: Student[];
  subscriptionTier: SubscriptionTier;
  onToggleTask: (lessonId: string, taskId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onAddLessonRequest: () => void;
  onUpgradeRequest: () => void;
}

type CalendarMode = 'day' | 'week';

const CalendarView: React.FC<CalendarViewProps> = ({ 
  lessons, 
  students,
  subscriptionTier,
  onToggleTask, 
  onDeleteLesson,
  onAddLessonRequest,
  onUpgradeRequest
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mode, setMode] = useState<CalendarMode>('day');
  const canPrint = subscriptionTier !== 'free';

  // Navigation Logic
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (mode === 'day') newDate.setDate(newDate.getDate() - 1);
    else newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (mode === 'day') newDate.setDate(newDate.getDate() + 1);
    else newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Data Filtering
  const getLessonsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return lessons.filter(l => l.date === dateStr);
  };

  // Week View Helpers
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff);

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  // Renderers
  const renderLessonCard = (lesson: Lesson, condensed = false) => {
    const student = students.find(s => s.id === lesson.studentId);
    if (!student) return null;

    return (
      <div key={lesson.id} className="group relative bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-4 mb-3">
        {/* Color Marker */}
        <div className={`absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full bg-${student.color}-500`} />
        
        <div className="pl-4">
          <div className="flex justify-between items-start mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full">
               {lesson.subject}
            </span>
            <button 
             onClick={(e) => { e.stopPropagation(); onDeleteLesson(lesson.id); }}
             className="text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <h4 className={`text-base font-semibold leading-snug ${lesson.isCompleted ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
            {lesson.title}
          </h4>
          
          <div className="mt-2 flex items-center gap-2">
             <div className="flex -space-x-2">
               <div className={`w-6 h-6 rounded-full bg-${student.color}-100 border-2 border-white flex items-center justify-center`}>
                  <span className={`text-[10px] font-bold text-${student.color}-700`}>{student.name[0]}</span>
               </div>
             </div>
             <span className="text-xs text-stone-400">{lesson.durationMinutes}m</span>
          </div>

          {!condensed && (
            <div className="space-y-3 mt-4 pt-3 border-t border-stone-50">
              {lesson.tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => onToggleTask(lesson.id, task.id)}
                  className="flex items-start gap-3 cursor-pointer group/task hover:bg-stone-50 rounded-lg p-2 -ml-2 transition-colors"
                >
                  {task.isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-300 group-hover/task:text-indigo-500 mt-0.5 shrink-0" />
                  )}
                  <span className={`text-sm ${task.isCompleted ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                    {task.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-2 sm:p-3 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex items-center gap-3 mb-4 sm:mb-0 w-full sm:w-auto px-2">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl">
            <button 
              onClick={() => setMode('day')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'day' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'week' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Week
            </button>
          </div>
          
          <button 
            onClick={canPrint ? () => alert("PDF Export triggered") : onUpgradeRequest}
            className="p-2.5 text-stone-400 hover:bg-stone-50 rounded-xl transition-colors flex items-center gap-2"
            title="Print Schedule"
          >
            <Printer className="w-5 h-5" />
            {!canPrint && <Lock className="w-3 h-3 text-indigo-500 -ml-1" />}
          </button>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end px-2 sm:px-0">
           <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="p-2 hover:bg-stone-100 rounded-xl text-stone-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-stone-900 min-w-[150px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: mode === 'day' ? 'numeric' : undefined })}
            </h2>
            <button onClick={handleNext} className="p-2 hover:bg-stone-100 rounded-xl text-stone-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={onAddLessonRequest}
            className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-lg shadow-stone-200 hover:translate-y-px font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Lesson</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {mode === 'day' ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 text-center">
               <span className="text-stone-400 font-bold uppercase tracking-widest text-xs">
                 {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
               </span>
            </div>
            
            {getLessonsForDate(currentDate).length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                <CalendarIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h3 className="text-stone-900 font-bold text-lg">No plans for today</h3>
                <p className="text-stone-500 mt-1">Enjoy the free time!</p>
              </div>
            ) : (
               getLessonsForDate(currentDate).map(l => renderLessonCard(l))
            )}
          </div>
        ) : (
          /* Week View */
          <div className="overflow-x-auto pb-4">
             <div className="min-w-[1000px] grid grid-cols-7 gap-4">
               {getWeekDates().map((date, i) => {
                 const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                 const dayLessons = getLessonsForDate(date);
                 
                 return (
                   <div key={i} className={`flex flex-col min-h-[600px] rounded-3xl border ${isToday ? 'border-indigo-200 bg-indigo-50/20' : 'border-stone-200 bg-stone-50/50'}`}>
                      <div className={`p-4 text-center border-b ${isToday ? 'border-indigo-100 bg-indigo-50/50' : 'border-stone-100 bg-white/50'} rounded-t-3xl`}>
                        <p className={`text-xs font-bold uppercase ${isToday ? 'text-indigo-600' : 'text-stone-400'}`}>
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className={`text-2xl font-bold mt-1 ${isToday ? 'text-indigo-900' : 'text-stone-700'}`}>
                          {date.getDate()}
                        </p>
                      </div>
                      <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[70vh] scrollbar-thin">
                        {dayLessons.map(l => renderLessonCard(l, true))}
                      </div>
                   </div>
                 )
               })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;