export enum Subject {
  MATH = 'Math',
  SCIENCE = 'Science',
  HISTORY = 'History',
  LANGUAGE_ARTS = 'Language Arts',
  ART = 'Art',
  PE = 'PE',
  OTHER = 'Other'
}

export interface Resource {
  title: string;
  url?: string;
  type: 'book' | 'video' | 'website' | 'worksheet';
}

export interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface Lesson {
  id: string;
  studentId: string;
  subject: Subject;
  title: string;
  date: string; // ISO Date string YYYY-MM-DD
  durationMinutes: number;
  description: string;
  resources: Resource[];
  tasks: Task[];
  isCompleted: boolean;
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  gradeLevel: string;
  color: string; // Tailwind color class suffix, e.g., 'blue-500'
  avatarUrl: string;
}

// AI Generation Types
export interface GeneratedLessonPlan {
  title: string;
  description: string;
  durationMinutes: number;
  resources: Resource[];
  tasks: string[]; // Simple string array for initial generation
}

export type ViewMode = 'home' | 'calendar' | 'children' | 'resources' | 'progress';

export type SubscriptionTier = 'free' | 'plus' | 'coop';
