import React from 'react';
import { Student, SubscriptionTier } from '../types';
import { User, BookOpen, GraduationCap, Lock, Plus } from 'lucide-react';

interface ChildrenViewProps {
  students: Student[];
  subscriptionTier: SubscriptionTier;
  onAddStudent: () => void;
}

const ChildrenView: React.FC<ChildrenViewProps> = ({ students, subscriptionTier, onAddStudent }) => {
  const canAddStudent = subscriptionTier !== 'free' || students.length < 1;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-stone-900">My Students</h1>
           <p className="text-stone-500 mt-1 font-medium">Manage profiles and learning preferences.</p>
        </div>
        <button 
          onClick={onAddStudent}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 font-semibold shadow-sm
            ${canAddStudent 
              ? 'text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md' 
              : 'text-stone-500 bg-stone-100 hover:bg-stone-200'
            }`}
        >
          {canAddStudent ? <Plus className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
          Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {students.map(student => (
          <div key={student.id} className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-300 group">
            <div className={`h-32 bg-${student.color}-50 relative pattern-grid-lg`}>
              <div className="absolute -bottom-10 left-8">
                <img 
                  src={student.avatarUrl} 
                  alt={student.name} 
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover bg-white" 
                />
              </div>
            </div>
            
            <div className="pt-14 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">{student.name}</h2>
                  <div className="flex items-center gap-2 text-stone-500 mt-1 font-medium">
                    <GraduationCap className="w-5 h-5" />
                    <span>{student.gradeLevel}</span>
                  </div>
                </div>
                <button className="text-sm font-semibold text-stone-400 hover:text-indigo-600 border border-stone-200 px-4 py-1.5 rounded-full hover:bg-stone-50 transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-stone-100 pt-6">
                <div className="bg-stone-50 p-4 rounded-2xl text-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-stone-100">
                  <span className="block text-3xl font-bold text-stone-800">12</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-1 block">Completed</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl text-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-stone-100">
                  <span className="block text-3xl font-bold text-stone-800">85%</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-1 block">Avg Score</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Upsell Card */}
        {subscriptionTier === 'free' && students.length >= 1 && (
          <div 
            onClick={onAddStudent}
            className="border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center hover:bg-stone-50 hover:border-indigo-300 cursor-pointer transition-all duration-300 group min-h-[300px]"
          >
            <div className="p-5 bg-stone-100 rounded-full mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300 group-hover:scale-110">
              <Lock className="w-8 h-8 text-stone-400 group-hover:text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Add another student</h3>
            <p className="text-stone-500 font-medium max-w-xs">Upgrade to Plus to manage unlimited student profiles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenView;