import React, { useState } from 'react';
import { generateLessonPlan } from '../services/geminiService';
import { Subject, Student, GeneratedLessonPlan } from '../types';
import { Sparkles, X, Check, Calendar } from 'lucide-react';

interface AILessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onAcceptPlan: (plan: GeneratedLessonPlan, studentId: string, subject: Subject, date: string) => void;
}

const AILessonModal: React.FC<AILessonModalProps> = ({ isOpen, onClose, students, onAcceptPlan }) => {
  const [topic, setTopic] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.SCIENCE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedLessonPlan | null>(null);

  const handleGenerate = async () => {
    if (!topic || !selectedStudentId) return;

    setIsLoading(true);
    setGeneratedPlan(null);

    const student = students.find(s => s.id === selectedStudentId);
    const plan = await generateLessonPlan(
      topic, 
      selectedSubject, 
      student?.gradeLevel || 'Grade 1', 
      duration
    );

    setGeneratedPlan(plan);
    setIsLoading(false);
  };

  const handleAccept = () => {
    if (generatedPlan && selectedStudentId) {
      onAcceptPlan(generatedPlan, selectedStudentId, selectedSubject, date);
      handleClose();
    }
  };

  const handleClose = () => {
    setGeneratedPlan(null);
    setTopic('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] scale-100 animate-in zoom-in-95 duration-200">
        {/* Header - Neutral, Clear */}
        <div className="bg-white border-b border-stone-100 p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Plan Lesson</h2>
          </div>
          <button onClick={handleClose} className="text-stone-400 hover:bg-stone-50 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          {isLoading ? (
            // Skeleton Loading State
            <div className="space-y-8 animate-pulse">
              <div className="space-y-3">
                <div className="h-6 bg-stone-100 rounded-lg w-1/3"></div>
                <div className="h-4 bg-stone-50 rounded-lg w-1/2"></div>
              </div>
              <div className="h-40 bg-stone-50 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-4 bg-stone-100 rounded-lg w-1/4"></div>
                <div className="h-12 bg-stone-50 rounded-xl"></div>
                <div className="h-12 bg-stone-50 rounded-xl"></div>
              </div>
            </div>
          ) : !generatedPlan ? (
            // Input Form
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-2">What do you want to teach?</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis, Fractions, The Civil War"
                  className="w-full text-lg border-stone-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-4 border placeholder:text-stone-300 transition-all"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Student</label>
                  <select 
                    value={selectedStudentId} 
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full border-stone-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 p-3 border bg-white"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Subject</label>
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                    className="w-full border-stone-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 p-3 border bg-white"
                  >
                    {Object.values(Subject).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border-stone-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 p-3 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Duration (min)</label>
                  <input 
                    type="number" 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border-stone-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 p-3 border"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleGenerate}
                  disabled={!topic}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200
                    ${!topic
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-lg hover:translate-y-px'
                    }`}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Plan
                </button>
              </div>
            </div>
          ) : (
            // Results View
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Topic</label>
                <h3 className="text-2xl font-bold text-stone-900 leading-tight">{generatedPlan.title}</h3>
                <p className="text-stone-600 mt-2 leading-relaxed">{generatedPlan.description}</p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-stone-400" />
                  Tasks
                </h4>
                <ul className="space-y-4">
                  {generatedPlan.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-700">
                      <div className="w-2 h-2 rounded-full bg-stone-300 mt-2 shrink-0" />
                      <span className="text-base">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-3">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedPlan.resources.map((res, i) => (
                    <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-sm text-stone-600 font-medium">
                      <span className="text-xs font-bold text-stone-400 uppercase">{res.type}</span>
                      <span className="truncate max-w-[150px]">{res.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {generatedPlan && (
          <div className="p-5 bg-white border-t border-stone-100 flex justify-end gap-3 shrink-0">
            <button 
              onClick={() => setGeneratedPlan(null)}
              className="px-6 py-3 text-stone-600 font-bold hover:bg-stone-50 rounded-xl transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleAccept}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all"
            >
              <Calendar className="w-4 h-4" />
              Add to Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILessonModal;