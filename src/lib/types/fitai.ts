// 🏋️ FitAI - Type Definitions

// ============================================
// QUIZ TYPES
// ============================================

export type Goal = 
  | 'weight_loss' 
  | 'muscle_gain' 
  | 'toning' 
  | 'maintenance' 
  | 'cardio' 
  | 'rehabilitation';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type SessionDuration = '15-25' | '25-40' | '40-60' | '60+';

export type WeeklyFrequency = '2' | '3' | '4-5' | '6-7';

export type TrainingLocation = 
  | 'home_no_equipment' 
  | 'home_with_equipment' 
  | 'gym' 
  | 'outdoor';

export type Sex = 'male' | 'female' | 'other';

export type MealsPerDay = '2' | '3' | '4' | '5+';

export type NotificationFrequency = 'daily' | 'weekly' | 'minimal';

export type CoachingTone = 'tough' | 'motivational' | 'technical' | 'friendly';

export interface QuizData {
  // Objetivo e experiência
  goal: Goal;
  experience_level: ExperienceLevel;
  rehabilitation_details?: string;
  
  // Disponibilidade
  session_duration: SessionDuration;
  weekly_frequency: WeeklyFrequency;
  training_location: TrainingLocation;
  
  // Dados físicos
  height: number; // cm
  weight: number; // kg
  age: number;
  sex?: Sex;
  
  // Saúde e restrições
  dietary_restrictions: string[];
  dietary_preferences?: string;
  health_conditions: string[];
  health_details?: string;
  
  // Preferências
  meals_per_day: MealsPerDay;
  intermittent_fasting: boolean;
  training_preferences: string[];
  available_equipment: string[];
  
  // Motivação
  motivators: string[];
  obstacles: string[];
  notification_frequency: NotificationFrequency;
  coaching_tone?: CoachingTone;
  
  // Medidas opcionais
  measurements?: {
    waist?: number;
    hip?: number;
    chest?: number;
    thigh?: number;
  };
  photos?: string[];
  
  // Email
  email: string;
  terms_accepted: boolean;
  privacy_accepted: boolean;
}

// ============================================
// WORKOUT TYPES
// ============================================

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string[];
  sets: number;
  reps: number | string; // "12" ou "12-15" ou "até a falha"
  rest_seconds: number;
  weight_suggestion?: number;
  notes?: string;
  video_url: string;
  alternatives: string[]; // IDs de exercícios alternativos
}

export interface Workout {
  id: string;
  name: string; // "Treino A - Peito e Tríceps"
  focus: string[]; // ["chest", "triceps"]
  duration: number; // minutos
  estimated_calories: number;
  difficulty: Difficulty;
  exercises: Exercise[];
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WorkoutPlan {
  id: string;
  user_id: string;
  created_at: Date;
  goal: Goal;
  weekly_schedule: Record<DayOfWeek, Workout | 'rest'>;
  workouts: Workout[];
  progression_plan: ProgressionPlan;
  active: boolean;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_id: string;
  completed_at: Date;
  duration: number; // minutos
  calories_burned: number;
  rating: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  exercises_completed: {
    exercise_id: string;
    sets_completed: number;
    reps_completed: number[];
    weight_used?: number[];
  }[];
}

// ============================================
// NUTRITION TYPES
// ============================================

export interface Macros {
  protein: number; // gramas
  carbs: number; // gramas
  fats: number; // gramas
}

export interface Nutrition extends Macros {
  calories: number;
  fiber?: number;
  sodium?: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string; // "g", "ml", "unidade"
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prep_time: number; // minutos
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
  tags: string[]; // ["high_protein", "quick", "vegetarian"]
  image_url?: string;
}

export interface Meal {
  id: string;
  name: string; // "Café da Manhã"
  time: string; // "07:00"
  calories: number;
  macros: Macros;
  recipe: Recipe;
  alternatives: string[]; // IDs de receitas alternativas
}

export interface NutritionPlan {
  id: string;
  user_id: string;
  created_at: Date;
  goal: Goal;
  daily_targets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  meals_per_day: number;
  meal_schedule: Meal[];
  active: boolean;
}

export interface MealLog {
  id: string;
  user_id: string;
  recipe_id: string;
  meal_type: string; // "breakfast", "lunch", "dinner", "snack"
  consumed_at: Date;
  calories: number;
  macros: Macros;
  notes?: string;
}

// ============================================
// PROGRESSION TYPES
// ============================================

export type ProgressionType = 'linear' | 'wave' | 'block';

export type ProgressionFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface ProgressionPlan {
  type: ProgressionType;
  frequency: ProgressionFrequency;
  rules: {
    increase_weight_when: {
      condition: 'completed_all_reps_for_x_sessions';
      sessions_required: number;
      increase_percentage: number; // 2.5% - 5%
    };
    increase_volume_when: {
      condition: 'plateau_detected';
      add_sets: number;
      or_add_reps: number;
    };
    adjust_calories_when: {
      condition: 'weight_change_rate';
      target_rate: number; // kg/semana
      adjustment_percentage: number; // 5% - 10%
    };
  };
}

// ============================================
// USER PROGRESS TYPES
// ============================================

export interface UserProgress {
  id: string;
  user_id: string;
  date: Date;
  weight?: number; // kg
  measurements?: {
    waist?: number;
    hip?: number;
    chest?: number;
    thigh?: number;
    arm?: number;
  };
  photos?: {
    front?: string;
    side?: string;
    back?: string;
  };
  notes?: string;
}

export interface BodyComposition {
  body_fat_percentage?: number;
  lean_mass?: number; // kg
  fat_mass?: number; // kg
  bmi: number;
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export type PlanType = 'monthly' | 'quarterly' | 'annual';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  stripe_subscription_id?: string;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PlanDetails {
  type: PlanType;
  name: string;
  price_monthly: number;
  price_total: number;
  billing_period: string;
  savings_percentage?: number;
  savings_amount?: number;
  features: string[];
  badge?: string;
  popular?: boolean;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType = 
  | 'workout_reminder'
  | 'meal_reminder'
  | 'progress_update'
  | 'streak_milestone'
  | 'plan_adjustment'
  | 'subscription_reminder'
  | 'new_content'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: Date;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface WeeklyStats {
  workouts_completed: number;
  workouts_planned: number;
  total_duration: number; // minutos
  total_calories_burned: number;
  average_rating: number;
  
  meals_logged: number;
  average_calories: number;
  adherence_percentage: number;
  
  weight_change: number; // kg
  current_weight: number;
}

export interface MonthlyStats extends WeeklyStats {
  weeks: WeeklyStats[];
  body_composition_change?: {
    body_fat: number;
    lean_mass: number;
  };
  measurements_change?: {
    waist: number;
    hip: number;
    chest: number;
  };
}

// ============================================
// GAMIFICATION TYPES
// ============================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked_at?: Date;
}

export interface Streak {
  current_days: number;
  longest_days: number;
  last_activity_date: Date;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  tasks: {
    id: string;
    description: string;
    completed: boolean;
  }[];
  reward_points: number;
  reward_badge?: string;
  completed: boolean;
  completed_at?: Date;
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture?: string;
  created_at: Date;
  updated_at: Date;
  
  // Quiz data
  quiz_completed: boolean;
  quiz_data?: QuizData;
  
  // Plans
  current_workout_plan_id?: string;
  current_nutrition_plan_id?: string;
  
  // Subscription
  subscription?: Subscription;
  
  // Gamification
  points: number;
  badges: Badge[];
  streak: Streak;
  
  // Preferences
  notification_preferences: {
    push_enabled: boolean;
    email_enabled: boolean;
    frequency: NotificationFrequency;
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
}

export interface ResetPasswordForm {
  email: string;
}

export interface NewPasswordForm {
  password: string;
  password_confirmation: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardData {
  user: User;
  today_workout?: Workout;
  next_meal?: Meal;
  weekly_progress: WeeklyStats;
  streak: Streak;
  upcoming_workouts: {
    day: DayOfWeek;
    workout: Workout | 'rest';
  }[];
  recent_notifications: Notification[];
}

// ============================================
// EXPORT ALL
// ============================================

export type {
  // Quiz
  QuizData,
  
  // Workout
  Exercise,
  Workout,
  WorkoutPlan,
  WorkoutLog,
  
  // Nutrition
  Recipe,
  Meal,
  NutritionPlan,
  MealLog,
  
  // Progress
  ProgressionPlan,
  UserProgress,
  BodyComposition,
  
  // Subscription
  Subscription,
  PlanDetails,
  
  // Notifications
  Notification,
  
  // Analytics
  WeeklyStats,
  MonthlyStats,
  
  // Gamification
  Badge,
  Streak,
  Mission,
  
  // User
  User,
  
  // API
  ApiResponse,
  PaginatedResponse,
  
  // Forms
  LoginForm,
  SignupForm,
  ResetPasswordForm,
  NewPasswordForm,
  
  // Dashboard
  DashboardData,
};
