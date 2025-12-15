// 🔍 Supabase Database Queries
import { createClient } from './client';
import type {
  User,
  WorkoutPlan,
  NutritionPlan,
  UserProgress,
  Subscription,
  WorkoutLog,
  MealLog,
  Notification,
} from '@/lib/types/fitai';

// ============================================
// USER QUERIES
// ============================================

export async function getUserProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateQuizData(userId: string, quizData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .update({
      quiz_completed: true,
      quiz_data: quizData,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// WORKOUT QUERIES
// ============================================

export async function getActiveWorkoutPlan(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data as WorkoutPlan | null;
}

export async function createWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'created_at'>) {
  const supabase = createClient();
  
  // Deactivate old plans
  await supabase
    .from('workout_plans')
    .update({ active: false })
    .eq('user_id', plan.user_id);

  // Create new plan
  const { data, error } = await supabase
    .from('workout_plans')
    .insert(plan)
    .select()
    .single();

  if (error) throw error;
  return data as WorkoutPlan;
}

export async function logWorkout(log: Omit<WorkoutLog, 'id' | 'completed_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('workout_logs')
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data as WorkoutLog;
}

export async function getWorkoutLogs(userId: string, limit = 10) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as WorkoutLog[];
}

// ============================================
// NUTRITION QUERIES
// ============================================

export async function getActiveNutritionPlan(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('nutrition_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as NutritionPlan | null;
}

export async function createNutritionPlan(plan: Omit<NutritionPlan, 'id' | 'created_at'>) {
  const supabase = createClient();
  
  // Deactivate old plans
  await supabase
    .from('nutrition_plans')
    .update({ active: false })
    .eq('user_id', plan.user_id);

  // Create new plan
  const { data, error } = await supabase
    .from('nutrition_plans')
    .insert(plan)
    .select()
    .single();

  if (error) throw error;
  return data as NutritionPlan;
}

export async function logMeal(log: Omit<MealLog, 'id' | 'consumed_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('meal_logs')
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data as MealLog;
}

export async function getMealLogs(userId: string, startDate: Date, endDate: Date) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('consumed_at', startDate.toISOString())
    .lte('consumed_at', endDate.toISOString())
    .order('consumed_at', { ascending: false });

  if (error) throw error;
  return data as MealLog[];
}

// ============================================
// PROGRESS QUERIES
// ============================================

export async function getUserProgress(userId: string, limit = 30) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as UserProgress[];
}

export async function addProgress(progress: Omit<UserProgress, 'id'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_progress')
    .upsert(progress, { onConflict: 'user_id,date' })
    .select()
    .single();

  if (error) throw error;
  return data as UserProgress;
}

// ============================================
// SUBSCRIPTION QUERIES
// ============================================

export async function getActiveSubscription(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Subscription | null;
}

export async function createSubscription(subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

export async function updateSubscription(subscriptionId: string, updates: Partial<Subscription>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

// ============================================
// NOTIFICATION QUERIES
// ============================================

export async function getNotifications(userId: string, unreadOnly = false) {
  const supabase = createClient();
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Notification[];
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
}

// ============================================
// ANALYTICS QUERIES
// ============================================

export async function getWeeklyStats(userId: string) {
  const supabase = createClient();
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get workout logs
  const { data: workoutLogs, error: workoutError } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('completed_at', weekAgo.toISOString());

  if (workoutError) throw workoutError;

  // Get meal logs
  const { data: mealLogs, error: mealError } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('consumed_at', weekAgo.toISOString());

  if (mealError) throw mealError;

  // Calculate stats
  const workoutsCompleted = workoutLogs?.length || 0;
  const totalDuration = workoutLogs?.reduce((sum, log) => sum + log.duration, 0) || 0;
  const totalCaloriesBurned = workoutLogs?.reduce((sum, log) => sum + (log.calories_burned || 0), 0) || 0;
  const averageRating = workoutLogs?.length 
    ? workoutLogs.reduce((sum, log) => sum + (log.rating || 0), 0) / workoutLogs.length 
    : 0;

  const mealsLogged = mealLogs?.length || 0;
  const averageCalories = mealLogs?.length
    ? mealLogs.reduce((sum, log) => sum + log.calories, 0) / mealLogs.length
    : 0;

  return {
    workouts_completed: workoutsCompleted,
    workouts_planned: 7, // TODO: Calculate from workout plan
    total_duration: totalDuration,
    total_calories_burned: totalCaloriesBurned,
    average_rating: averageRating,
    meals_logged: mealsLogged,
    average_calories: averageCalories,
    adherence_percentage: 0, // TODO: Calculate
    weight_change: 0, // TODO: Calculate from progress
    current_weight: 0, // TODO: Get from latest progress
  };
}
