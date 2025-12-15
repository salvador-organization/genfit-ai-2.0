'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, WorkoutPlan, NutritionPlan, UserProgress, Subscription } from '@/lib/types/fitai';
import { createClient } from '@/lib/supabase/client';
import {
  getUserProfile,
  getActiveWorkoutPlan,
  getActiveNutritionPlan,
  getUserProgress,
  getActiveSubscription,
} from '@/lib/supabase/queries';

interface AppContextType {
  user: User | null;
  workoutPlan: WorkoutPlan | null;
  nutritionPlan: NutritionPlan | null;
  progress: UserProgress[];
  subscription: Subscription | null;
  loading: boolean;
  updateUser: (user: Partial<User>) => void;
  updateProgress: (progress: UserProgress) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    
    // Subscribe to auth changes
    const supabase = createClient();
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setWorkoutPlan(null);
          setNutritionPlan(null);
          setProgress([]);
          setSubscription(null);
        }
      }
    );

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Load user profile
      try {
        const userProfile = await getUserProfile(session.user.id);
        setUser(userProfile);

        // Load workout plan
        const workout = await getActiveWorkoutPlan(session.user.id);
        setWorkoutPlan(workout);

        // Load nutrition plan
        const nutrition = await getActiveNutritionPlan(session.user.id);
        setNutritionPlan(nutrition);

        // Load progress
        const userProgress = await getUserProgress(session.user.id);
        setProgress(userProgress);

        // Load subscription
        const sub = await getActiveSubscription(session.user.id);
        setSubscription(sub);
      } catch (error) {
        console.error('Error loading user data:', error);
        // If user doesn't exist in database, create profile
        if ((error as any)?.code === 'PGRST116') {
          // User not found, create basic profile
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
            })
            .select()
            .single();

          if (!createError && newUser) {
            setUser(newUser as User);
          }
        }
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setUser(data as User);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const updateProgress = (newProgress: UserProgress) => {
    setProgress(prev => [newProgress, ...prev]);
  };

  const refreshData = async () => {
    await loadUserData();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        workoutPlan,
        nutritionPlan,
        progress,
        subscription,
        loading,
        updateUser,
        updateProgress,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
