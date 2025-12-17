import React, { useState, useEffect } from 'react';
import { 
  getLessons, 
  getStudents, 
  saveLesson, 
  deleteLesson, 
  toggleTaskCompletion,
  saveStudent,
  getSubscription
} from './services/storageService';
import { Lesson, Student, ViewMode, GeneratedLessonPlan, Subject, SubscriptionTier } from './types';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ChildrenView from './components/ChildrenView';
import ResourcesView from './components/ResourcesView';
import ProgressView from './components/ProgressView';
import AILessonModal from './components/AILessonModal';
import UpgradeModal from './components/UpgradeModal';
import { 
  Home, 
  Calendar as CalendarIcon, 
  Users, 
  BookOpen, 
  BarChart2,
  GraduationCap,
  Menu,
  X,
  Sparkles,
  Settings
} from 'lucide-react';

const App: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    setLessons(getLessons());
    setStudents(getStudents());
    setSubscriptionTier(getSubscription());
  }, []);

  // Handlers
  const handleAddLesson = (plan: GeneratedLessonPlan, studentId: string, subject: Subject, date: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      studentId,
      subject,
      title: plan.title,
      description: plan.description,
      durationMinutes: plan.durationMinutes,
      date: date,
      isCompleted: false,
      resources: plan.resources,
      tasks: plan.tasks.map((t, i) => ({
        id: `t-${Date.now()}-${i}`,
        description: t,
        isCompleted: false
      }))
    };

    const updatedLessons = saveLesson(newLesson);
    setLessons(updatedLessons);
  };

  const handleTaskToggle = (lessonId: string, taskId: string) => {
    const updatedLessons = toggleTaskCompletion(lessonId, taskId);
    setLessons(updatedLessons);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const updatedLessons = deleteLesson(lessonId);
      setLessons(updatedLessons);
    }
  };

  const handleAddStudent = () => {
    if (subscriptionTier === 'free' && students.length >= 1) {
      setIsUpgradeModalOpen(true);
      return;
    }
    // Simple add student for MVP
    const colors = ['blue', 'emerald', 'indigo', 'purple', 'rose', 'amber'];
    const newStudent: Student = {
      id: Date.now().toString(),
      name: `Student ${students.length + 1}`,
      gradeLevel: 'Grade 1',
      color: colors[students.length % colors.length],
      avatarUrl: `https://ui-avatars.com/api/?name=Student+${students.length + 1}&background=random`
    };
    const updated = saveStudent(newStudent);
    setStudents(updated);
  };

  const SidebarItem = ({ view, icon: Icon, label }: { view: ViewMode, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-out ${
        currentView === view 
          ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
          : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
      }`}
    >
      <Icon className={`w-5 h-5 transition-colors ${currentView === view ? 'text-indigo-600' : 'text-stone-400'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans text-stone-800">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/10 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white/80 backdrop-blur-md border-r border-stone-100 transform transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3 text-indigo-700">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-800">HomeLearn</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-stone-400 hover:text-stone-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5">
            <SidebarItem view="home" icon={Home} label="Home" />
            <SidebarItem view="calendar" icon={CalendarIcon} label="Calendar" />
            <SidebarItem view="children" icon={Users} label="Children" />
            <SidebarItem view="resources" icon={BookOpen} label="Resources" />
            <SidebarItem view="progress" icon={BarChart2} label="Progress" />
          </nav>

          <div className="pt-6 border-t border-stone-100 space-y-6">
             {/* Plan Indicator */}
             <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ring-2 ring-white ${subscriptionTier === 'free' ? 'bg-stone-300' : 'bg-indigo-500'}`} />
                 <span className="text-xs font-bold uppercase tracking-wider text-stone-400">{subscriptionTier} Plan</span>
               </div>
               {subscriptionTier === 'free' && (
                 <button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-2 py-1 hover:bg-indigo-50 rounded-md transition-colors"
                 >
                   Upgrade
                 </button>
               )}
             </div>

             {/* Profile */}
             <div className="flex items-center gap-3 px-2 group cursor-pointer rounded-xl hover:bg-stone-50 p-2 transition-colors">
                <div className="w-10 h-10 rounded-full bg-stone-100 border-2 border-white shadow-sm flex items-center justify-center text-stone-500 font-bold">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">Sarah Johnson</p>
                  <p className="text-xs text-stone-500 truncate group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Manage Settings
                  </p>
                </div>
             </div>

             {/* Neutral Promo Box */}
             <div className="bg-stone-50 border border-stone-100 rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-semibold text-stone-900 text-sm">Need ideas?</h4>
                  </div>
                  <p className="text-xs text-stone-500 mb-4 leading-relaxed">Let our AI assistant generate a complete lesson plan for you.</p>
                  <button 
                    onClick={() => setIsAIModalOpen(true)}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white text-sm py-2.5 rounded-xl transition-all duration-200 font-medium shadow-md shadow-stone-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Create Plan
                  </button>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-stone-50">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 p-4 flex items-center justify-between lg:hidden shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2 font-bold text-stone-900">
             <GraduationCap className="w-6 h-6 text-indigo-600" />
             HomeLearn
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-stone-500 hover:bg-stone-100 rounded-xl transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* View Container - Conditional Padding */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-200">
            {currentView === 'home' ? (
              // Dashboard handles its own layout for Hero Section
              <Dashboard 
                lessons={lessons} 
                students={students} 
                onToggleTask={handleTaskToggle} 
                onViewChange={setCurrentView} 
              />
            ) : (
              // Other views get standard padding wrapper
              <div className="p-4 lg:p-10 h-full max-w-6xl mx-auto">
                {currentView === 'calendar' && (
                  <CalendarView 
                    lessons={lessons} 
                    students={students}
                    subscriptionTier={subscriptionTier}
                    onToggleTask={handleTaskToggle}
                    onDeleteLesson={handleDeleteLesson}
                    onAddLessonRequest={() => setIsAIModalOpen(true)}
                    onUpgradeRequest={() => setIsUpgradeModalOpen(true)}
                  />
                )}
                {currentView === 'children' && (
                  <ChildrenView 
                    students={students} 
                    subscriptionTier={subscriptionTier}
                    onAddStudent={handleAddStudent}
                  />
                )}
                {currentView === 'resources' && (
                  <ResourcesView lessons={lessons} />
                )}
                {currentView === 'progress' && (
                  <ProgressView 
                    lessons={lessons} 
                    students={students} 
                    subscriptionTier={subscriptionTier}
                    onUpgradeRequest={() => setIsUpgradeModalOpen(true)}
                  />
                )}
              </div>
            )}
        </div>
      </main>

      {/* Modals */}
      <AILessonModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        students={students}
        onAcceptPlan={handleAddLesson}
      />

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={(tier) => setSubscriptionTier(tier)}
      />
    </div>
  );
};

export default App;