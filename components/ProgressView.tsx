import React from 'react';
import { Lesson, Student, Subject, SubscriptionTier } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trophy, Lock } from 'lucide-react';

interface ProgressViewProps {
  lessons: Lesson[];
  students: Student[];
  subscriptionTier: SubscriptionTier;
  onUpgradeRequest: () => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ lessons, students, subscriptionTier, onUpgradeRequest }) => {
  const isLocked = subscriptionTier === 'free';

  // Compute Stats (Dummy for locked view logic)
  const getStudentStats = (studentId: string) => {
    const studentLessons = lessons.filter(l => l.studentId === studentId);
    const subjectStats: Record<string, { total: number; completed: number }> = {};
    Object.values(Subject).forEach(s => { subjectStats[s] = { total: 0, completed: 0 }; });
    studentLessons.forEach(l => {
      if (subjectStats[l.subject]) {
        subjectStats[l.subject].total += 1;
        if (l.isCompleted) subjectStats[l.subject].completed += 1;
      }
    });
    return Object.keys(subjectStats).map(subject => ({
      subject,
      completed: subjectStats[subject].completed,
      total: subjectStats[subject].total,
      percentage: subjectStats[subject].total > 0 ? Math.round((subjectStats[subject].completed / subjectStats[subject].total) * 100) : 0
    })).filter(s => s.total > 0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600 shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Progress Tracker</h1>
          <p className="text-stone-500 font-medium">Visualizing consistency and completion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {students.map(student => {
          const data = getStudentStats(student.id);
          
          return (
            <div key={student.id} className="relative bg-white p-8 rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <img src={student.avatarUrl} className="w-10 h-10 rounded-xl" alt="" />
                <h3 className="text-xl font-bold text-stone-900">{student.name}'s Progress</h3>
              </div>

              <div className={`h-72 transition-all duration-500 ${isLocked ? 'blur-md opacity-40 select-none grayscale-[0.5]' : ''}`}>
                 <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={isLocked ? [] : data} // Don't render real data if locked to be safe/simple, or render mock data
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e7e5e4" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="subject" type="category" width={120} tick={{fill: '#78716c', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#fafaf9'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '12px' }}
                    />
                    <Bar 
                      dataKey="percentage" 
                      fill={`var(--color-${student.color}-500, #6366f1)`} 
                      radius={[0, 6, 6, 0]} 
                      barSize={24} 
                      background={{ fill: '#f5f5f4', radius: [0, 6, 6, 0] }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Paywall Overlay */}
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/10 backdrop-blur-[2px]">
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 text-center max-w-sm">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full w-fit mx-auto mb-5">
                       <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-3">Unlock Detailed Insights</h3>
                    <p className="text-stone-500 mb-8 leading-relaxed">
                      See weekly trends, subject completion rates, and historical data with HomeLearn Plus.
                    </p>
                    <button 
                      onClick={onUpgradeRequest}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                    >
                      Upgrade to Plus ($6/mo)
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressView;