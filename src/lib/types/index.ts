/**
 * 📝 TIPOS TYPESCRIPT COMPLETOS
 * Definições de tipos para toda a aplicação
 */

// ============================================
// USER & AUTH
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  
  // Dados físicos
  gender?: 'male' | 'female' | 'other';
  birth_date?: Date;
  height?: number;
  current_weight?: number;
  target_weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  
  // Objetivos
  goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance' | 'toning';
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  training_days_per_week?: number;
  preferred_training_time?: 'morning' | 'afternoon' | 'evening' | 'night';
  dietary_restrictions?: string[];
  food_preferences?: string[];
  
  // Assinatura
  subscription_status: 'inactive' | 'trial' | 'active' | 'cancelled' | 'expired';
  subscription_plan?: 'monthly' | 'quarterly' | 'annual';
  subscription_start_date?: Date;
  subscription_end_date?: Date;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  onboarding_completed: boolean;
  quiz_completed: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expires_at: Date;
}

// ============================================
// QUIZ
// ============================================

export interface QuizData {
  userId?: string;
  
  // Pessoal
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  
  // Físico
  weight: number;
  height: number;
  bodyFat?: number;
  
  // Objetivo
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance' | 'toning';
  targetWeight?: number;
  
  // Treino
  experience: 'beginner' | 'intermediate' | 'advanced';
  trainingDays: 3 | 4 | 5 | 6;
  trainingLocation: 'gym' | 'home' | 'both' | 'outdoor';
  availableEquipment: string[];
  injuries?: string[];
  
  // Alimentação
  dietaryRestrictions: string[];
  foodPreferences: string[];
  mealsPerDay: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  
  // Fotos
  photos?: {
    front?: string;
    side?: string;
    back?: string;
  };
  
  // Metadata
  completedAt?: Date;
}

export interface QuizResponse {
  id: string;
  user_id: string;
  responses: QuizData;
  front_photo_url?: string;
  side_photo_url?: string;
  back_photo_url?: string;
  completed_at: Date;
  version: number;
}

// ============================================
// WORKOUT
// ============================================

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  muscle_group: string;
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
  video_url?: string;
  alternatives?: string[];
}

export interface WorkoutDay {
  id: string;
  day: string;
  name: string;
  focus: string;
  duration: number;
  estimated_calories: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  warmup: string[];
  cooldown: string[];
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  week_number: number;
  goal: string;
  difficulty: string;
  days_per_week: number;
  plan_data: {
    days: WorkoutDay[];
  };
  weekly_schedule: {
    monday: WorkoutDay | 'rest';
    tuesday: WorkoutDay | 'rest';
    wednesday: WorkoutDay | 'rest';
    thursday: WorkoutDay | 'rest';
    friday: WorkoutDay | 'rest';
    saturday: WorkoutDay | 'rest';
    sunday: WorkoutDay | 'rest';
  };
  status: 'active' | 'completed' | 'paused';
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_plan_id?: string;
  workout_date: Date;
  workout_day_id: string;
  exercises_completed: number;
  total_exercises: number;
  duration_minutes: number;
  exercises_data: {
    exercise_id: string;
    sets_completed: number;
    reps_completed: number[];
    weight_used: number[];
  }[];
  difficulty_rating?: number;
  energy_level?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ExerciseProgress {
  id: string;
  user_id: string;
  exercise_name: string;
  workout_date: Date;
  sets: number;
  reps: number;
  weight: number;
  rest_seconds: number;
  created_at: Date;
}

// ============================================
// NUTRITION
// ============================================

export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  alternatives?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prep_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  recipe: Recipe;
  alternatives?: Meal[];
}

export interface NutritionPlan {
  id: string;
  user_id: string;
  week_number: number;
  goal: string;
  daily_targets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  meals_per_day: number;
  meal_schedule: Meal[];
  dietary_restrictions: string[];
  plan_data: any;
  status: 'active' | 'completed' | 'paused';
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  nutrition_plan_id?: string;
  log_date: Date;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fats_consumed: number;
  water_intake_ml: number;
  meals_data: {
    meal_id: string;
    consumed: boolean;
    time_consumed?: Date;
  }[];
  meals_logged: number;
  created_at: Date;
  updated_at: Date;
}

export interface ShoppingItem {
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

// ============================================
// PROGRESS
// ============================================

export interface ProgressTracking {
  id: string;
  user_id: string;
  tracking_date: Date;
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    left_arm?: number;
    right_arm?: number;
    left_leg?: number;
    right_leg?: number;
  };
  front_photo_url?: string;
  side_photo_url?: string;
  back_photo_url?: string;
  notes?: string;
  created_at: Date;
}

export interface ProgressReport {
  period: 'week' | 'month' | 'quarter';
  startDate: Date;
  endDate: Date;
  weightChange: number;
  bodyFatChange?: number;
  muscleMassChange?: number;
  workoutAdherence: number;
  nutritionAdherence: number;
  insights: string[];
  recommendations: string[];
  achievements: string[];
  charts: ChartData[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: any[];
  labels: string[];
}

// ============================================
// SUBSCRIPTION & PAYMENTS
// ============================================

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'monthly' | 'quarterly' | 'annual';
  status: 'active' | 'trial' | 'cancelled' | 'expired';
  amount: number;
  currency: string;
  start_date: Date;
  end_date: Date;
  payment_method?: string;
  payment_provider?: string;
  payment_id?: string;
  canceled_at?: Date;
  cancellation_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  payment_provider?: string;
  provider_payment_id?: string;
  provider_customer_id?: string;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Plan {
  name: string;
  price_monthly: number;
  price_total: number;
  billing_period: string;
  savings_percentage?: number;
  savings_amount?: number;
  features: string[];
  popular?: boolean;
  badge?: string;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  type: 'workout_reminder' | 'meal_reminder' | 'progress_update' | 'plan_update' | 'achievement' | 'subscription';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  read_at?: Date;
  action_url?: string;
  action_label?: string;
  created_at: Date;
  expires_at?: Date;
}

// ============================================
// ANALYTICS
// ============================================

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event_name: string;
  event_category: string;
  event_data?: any;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: Date;
}

export interface KPIMetrics {
  // Conversão
  quizStarted: number;
  quizCompleted: number;
  quizCompletionRate: number;
  quizToSubscription: number;
  quizToSubscriptionRate: number;

  // Ativação
  newUsers: number;
  activatedUsers: number;
  activationRate: number;
  avgTimeToActivation: number;

  // Retenção
  activeUsers: number;
  retentionDay7: number;
  retentionDay30: number;
  retentionDay90: number;
  churnRate: number;

  // Engajamento
  avgWorkoutsPerWeek: number;
  avgMealsLoggedPerDay: number;
  avgSessionDuration: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;

  // Financeiro
  mrr: number;
  arr: number;
  ltv: number;
  avgRevenuePerUser: number;
  churnMRR: number;

  // Crescimento
  newSubscriptions: number;
  canceledSubscriptions: number;
  netGrowth: number;
  growthRate: number;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Date;
    request_id: string;
  };
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ============================================
// CONTEXT TYPES
// ============================================

export interface AppContextType {
  user: User | null;
  workoutPlan: WorkoutPlan | null;
  nutritionPlan: NutritionPlan | null;
  subscription: Subscription | null;
  progress: ProgressTracking[];
  notifications: Notification[];
  
  updateUser: (data: Partial<User>) => void;
  updateProgress: (data: ProgressTracking) => void;
  markNotificationAsRead: (id: string) => void;
}
