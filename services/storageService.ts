import { Lesson, Student, Subject, SubscriptionTier } from "../types";

// Mock Data
const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Alice', gradeLevel: '4th Grade', color: 'emerald', avatarUrl: 'https://ui-avatars.com/api/?name=Alice&background=10b981&color=fff' },
];

const MOCK_LESSONS: Lesson[] = [
  {
    id: '101',
    studentId: '1',
    subject: Subject.MATH,
    title: 'Introduction to Fractions',
    date: new Date().toISOString().split('T')[0], // Today
    durationMinutes: 45,
    description: 'Understanding numerator and denominator using visual aids.',
    resources: [{ title: 'Pizza Fraction Cutouts', type: 'worksheet' }],
    tasks: [
      { id: 't1', description: 'Watch intro video', isCompleted: true },
      { id: 't2', description: 'Complete worksheet pg 12', isCompleted: false },
    ],
    isCompleted: false,
  },
];

const STORAGE_KEYS = {
  STUDENTS: 'homelearn_students',
  LESSONS: 'homelearn_lessons',
  SUBSCRIPTION: 'homelearn_subscription'
};

export const getStudents = (): Student[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
  return MOCK_STUDENTS;
};

export const saveStudent = (student: Student): Student[] => {
  const students = getStudents();
  const newStudents = [...students, student];
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newStudents));
  return newStudents;
};

export const getLessons = (): Lesson[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.LESSONS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(MOCK_LESSONS));
  return MOCK_LESSONS;
};

export const saveLesson = (lesson: Lesson): Lesson[] => {
  const lessons = getLessons();
  const existingIndex = lessons.findIndex(l => l.id === lesson.id);
  
  let newLessons;
  if (existingIndex >= 0) {
    newLessons = [...lessons];
    newLessons[existingIndex] = lesson;
  } else {
    newLessons = [...lessons, lesson];
  }
  
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(newLessons));
  return newLessons;
};

export const deleteLesson = (id: string): Lesson[] => {
  const lessons = getLessons().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  return lessons;
};

export const toggleTaskCompletion = (lessonId: string, taskId: string): Lesson[] => {
  const lessons = getLessons();
  const index = lessons.findIndex(l => l.id === lessonId);
  if (index === -1) return lessons;

  const lesson = lessons[index];
  const updatedTasks = lesson.tasks.map(t => 
    t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
  );

  const updatedLesson = { ...lesson, tasks: updatedTasks };
  
  // Auto-complete lesson if all tasks are done
  const allTasksDone = updatedTasks.every(t => t.isCompleted);
  updatedLesson.isCompleted = allTasksDone;

  const newLessons = [...lessons];
  newLessons[index] = updatedLesson;
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(newLessons));
  return newLessons;
};

export const getSubscription = (): SubscriptionTier => {
  return (localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION) as SubscriptionTier) || 'free';
};

export const setSubscription = (tier: SubscriptionTier) => {
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, tier);
};
