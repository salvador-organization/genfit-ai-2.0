'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, WorkoutPlan, NutritionPlan, UserProgress, Subscription } from '@/lib/types/fitai';
import { getCurrentUser } from '@/lib/auth';

interface AppContextType {
  user: User | null;
  workoutPlan: WorkoutPlan | null;
  nutritionPlan: NutritionPlan | null;
  progress: UserProgress[];
  subscription: Subscription | null;
  updateUser: (user: Partial<User>) => void;
  updateProgress: (progress: UserProgress) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser as any);
      
      // Load mock data
      const mockWorkoutPlan = getMockWorkoutPlan(currentUser.id);
      const mockNutritionPlan = getMockNutritionPlan(currentUser.id);
      const mockProgress = getMockProgress(currentUser.id);
      const mockSubscription = getMockSubscription(currentUser.id);
      
      setWorkoutPlan(mockWorkoutPlan);
      setNutritionPlan(mockNutritionPlan);
      setProgress(mockProgress);
      setSubscription(mockSubscription);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Save to localStorage
      localStorage.setItem('fitai_user', JSON.stringify(updatedUser));
    }
  };

  const updateProgress = (newProgress: UserProgress) => {
    setProgress(prev => [...prev, newProgress]);
  };

  const refreshData = () => {
    loadUserData();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        workoutPlan,
        nutritionPlan,
        progress,
        subscription,
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

// Mock data generators
function getMockWorkoutPlan(userId: string): WorkoutPlan {
  return {
    id: 'workout-plan-1',
    user_id: userId,
    created_at: new Date(),
    goal: 'muscle_gain',
    weekly_schedule: {
      monday: {
        id: 'workout-1',
        name: 'Treino A - Peito e Tríceps',
        focus: ['chest', 'triceps'],
        duration: 45,
        estimated_calories: 350,
        difficulty: 'intermediate',
        exercises: [
          {
            id: 'ex-1',
            name: 'Supino reto',
            muscle_group: 'Peito',
            equipment: ['Barra', 'Banco'],
            sets: 4,
            reps: 12,
            rest_seconds: 90,
            video_url: 'https://example.com/supino-reto',
            alternatives: ['ex-2', 'ex-3'],
          },
          {
            id: 'ex-2',
            name: 'Supino inclinado',
            muscle_group: 'Peito superior',
            equipment: ['Halteres', 'Banco'],
            sets: 3,
            reps: 12,
            rest_seconds: 90,
            video_url: 'https://example.com/supino-inclinado',
            alternatives: ['ex-1', 'ex-4'],
          },
          {
            id: 'ex-3',
            name: 'Crucifixo',
            muscle_group: 'Peito',
            equipment: ['Halteres', 'Banco'],
            sets: 3,
            reps: 15,
            rest_seconds: 60,
            video_url: 'https://example.com/crucifixo',
            alternatives: ['ex-1', 'ex-2'],
          },
          {
            id: 'ex-4',
            name: 'Tríceps testa',
            muscle_group: 'Tríceps',
            equipment: ['Barra W'],
            sets: 3,
            reps: 15,
            rest_seconds: 60,
            video_url: 'https://example.com/triceps-testa',
            alternatives: ['ex-5', 'ex-6'],
          },
          {
            id: 'ex-5',
            name: 'Tríceps corda',
            muscle_group: 'Tríceps',
            equipment: ['Polia', 'Corda'],
            sets: 3,
            reps: 15,
            rest_seconds: 60,
            video_url: 'https://example.com/triceps-corda',
            alternatives: ['ex-4', 'ex-6'],
          },
        ],
      },
      tuesday: 'rest',
      wednesday: {
        id: 'workout-2',
        name: 'Treino B - Costas e Bíceps',
        focus: ['back', 'biceps'],
        duration: 50,
        estimated_calories: 380,
        difficulty: 'intermediate',
        exercises: [
          {
            id: 'ex-10',
            name: 'Barra fixa',
            muscle_group: 'Costas',
            equipment: ['Barra fixa'],
            sets: 4,
            reps: '8-12',
            rest_seconds: 120,
            video_url: 'https://example.com/barra-fixa',
            alternatives: ['ex-11', 'ex-12'],
          },
          {
            id: 'ex-11',
            name: 'Remada curvada',
            muscle_group: 'Costas',
            equipment: ['Barra'],
            sets: 4,
            reps: 12,
            rest_seconds: 90,
            video_url: 'https://example.com/remada-curvada',
            alternatives: ['ex-10', 'ex-12'],
          },
          {
            id: 'ex-12',
            name: 'Puxada frontal',
            muscle_group: 'Costas',
            equipment: ['Polia'],
            sets: 3,
            reps: 12,
            rest_seconds: 90,
            video_url: 'https://example.com/puxada-frontal',
            alternatives: ['ex-10', 'ex-11'],
          },
          {
            id: 'ex-13',
            name: 'Rosca direta',
            muscle_group: 'Bíceps',
            equipment: ['Barra'],
            sets: 3,
            reps: 12,
            rest_seconds: 60,
            video_url: 'https://example.com/rosca-direta',
            alternatives: ['ex-14', 'ex-15'],
          },
          {
            id: 'ex-14',
            name: 'Rosca alternada',
            muscle_group: 'Bíceps',
            equipment: ['Halteres'],
            sets: 3,
            reps: 12,
            rest_seconds: 60,
            video_url: 'https://example.com/rosca-alternada',
            alternatives: ['ex-13', 'ex-15'],
          },
        ],
      },
      thursday: 'rest',
      friday: {
        id: 'workout-3',
        name: 'Treino C - Pernas',
        focus: ['legs'],
        duration: 55,
        estimated_calories: 420,
        difficulty: 'intermediate',
        exercises: [
          {
            id: 'ex-20',
            name: 'Agachamento livre',
            muscle_group: 'Pernas',
            equipment: ['Barra'],
            sets: 4,
            reps: 12,
            rest_seconds: 120,
            video_url: 'https://example.com/agachamento',
            alternatives: ['ex-21', 'ex-22'],
          },
          {
            id: 'ex-21',
            name: 'Leg press',
            muscle_group: 'Pernas',
            equipment: ['Leg press'],
            sets: 4,
            reps: 15,
            rest_seconds: 90,
            video_url: 'https://example.com/leg-press',
            alternatives: ['ex-20', 'ex-22'],
          },
          {
            id: 'ex-22',
            name: 'Cadeira extensora',
            muscle_group: 'Quadríceps',
            equipment: ['Cadeira extensora'],
            sets: 3,
            reps: 15,
            rest_seconds: 60,
            video_url: 'https://example.com/extensora',
            alternatives: ['ex-20', 'ex-21'],
          },
          {
            id: 'ex-23',
            name: 'Mesa flexora',
            muscle_group: 'Posterior',
            equipment: ['Mesa flexora'],
            sets: 3,
            reps: 15,
            rest_seconds: 60,
            video_url: 'https://example.com/flexora',
            alternatives: ['ex-24'],
          },
          {
            id: 'ex-24',
            name: 'Panturrilha em pé',
            muscle_group: 'Panturrilha',
            equipment: ['Máquina'],
            sets: 4,
            reps: 20,
            rest_seconds: 45,
            video_url: 'https://example.com/panturrilha',
            alternatives: ['ex-23'],
          },
        ],
      },
      saturday: 'rest',
      sunday: 'rest',
    },
    workouts: [],
    progression_plan: {
      type: 'linear',
      frequency: 'weekly',
      rules: {
        increase_weight_when: {
          condition: 'completed_all_reps_for_x_sessions',
          sessions_required: 2,
          increase_percentage: 2.5,
        },
        increase_volume_when: {
          condition: 'plateau_detected',
          add_sets: 1,
          or_add_reps: 2,
        },
        adjust_calories_when: {
          condition: 'weight_change_rate',
          target_rate: 0.5,
          adjustment_percentage: 5,
        },
      },
    },
    active: true,
  };
}

function getMockNutritionPlan(userId: string): NutritionPlan {
  return {
    id: 'nutrition-plan-1',
    user_id: userId,
    created_at: new Date(),
    goal: 'muscle_gain',
    daily_targets: {
      calories: 2400,
      protein: 180,
      carbs: 270,
      fats: 67,
    },
    meals_per_day: 4,
    meal_schedule: [
      {
        id: 'meal-1',
        name: 'Café da Manhã',
        time: '07:00',
        calories: 550,
        macros: { protein: 35, carbs: 65, fats: 18 },
        recipe: {
          id: 'recipe-1',
          name: 'Omelete com Aveia',
          description: 'Omelete proteico com aveia e frutas',
          prep_time: 15,
          difficulty: 'easy',
          ingredients: [
            { name: 'Ovos', quantity: 3, unit: 'unidade' },
            { name: 'Aveia', quantity: 50, unit: 'g' },
            { name: 'Banana', quantity: 1, unit: 'unidade' },
            { name: 'Leite', quantity: 200, unit: 'ml' },
          ],
          instructions: [
            'Bata os ovos em uma tigela',
            'Adicione sal e temperos a gosto',
            'Aqueça uma frigideira antiaderente',
            'Despeje os ovos e cozinhe por 3-4 minutos',
            'Sirva com aveia e banana',
          ],
          nutrition: {
            calories: 550,
            protein: 35,
            carbs: 65,
            fats: 18,
          },
          tags: ['high_protein', 'quick', 'breakfast'],
        },
        alternatives: ['meal-2', 'meal-3'],
      },
      {
        id: 'meal-2',
        name: 'Almoço',
        time: '12:00',
        calories: 750,
        macros: { protein: 55, carbs: 85, fats: 20 },
        recipe: {
          id: 'recipe-2',
          name: 'Frango com Arroz e Legumes',
          description: 'Peito de frango grelhado com arroz integral e legumes',
          prep_time: 30,
          difficulty: 'medium',
          ingredients: [
            { name: 'Peito de frango', quantity: 200, unit: 'g' },
            { name: 'Arroz integral', quantity: 100, unit: 'g' },
            { name: 'Brócolis', quantity: 150, unit: 'g' },
            { name: 'Cenoura', quantity: 100, unit: 'g' },
            { name: 'Azeite', quantity: 10, unit: 'ml' },
          ],
          instructions: [
            'Tempere o frango com sal, alho e limão',
            'Grelhe o frango por 6-8 minutos de cada lado',
            'Cozinhe o arroz integral',
            'Cozinhe os legumes no vapor',
            'Monte o prato e regue com azeite',
          ],
          nutrition: {
            calories: 750,
            protein: 55,
            carbs: 85,
            fats: 20,
          },
          tags: ['high_protein', 'balanced', 'lunch'],
        },
        alternatives: ['meal-4', 'meal-5'],
      },
      {
        id: 'meal-3',
        name: 'Lanche da Tarde',
        time: '16:00',
        calories: 350,
        macros: { protein: 30, carbs: 40, fats: 10 },
        recipe: {
          id: 'recipe-3',
          name: 'Shake Proteico com Frutas',
          description: 'Shake de whey protein com banana e aveia',
          prep_time: 5,
          difficulty: 'easy',
          ingredients: [
            { name: 'Whey protein', quantity: 30, unit: 'g' },
            { name: 'Banana', quantity: 1, unit: 'unidade' },
            { name: 'Aveia', quantity: 30, unit: 'g' },
            { name: 'Leite desnatado', quantity: 300, unit: 'ml' },
          ],
          instructions: [
            'Coloque todos os ingredientes no liquidificador',
            'Bata por 30 segundos',
            'Sirva gelado',
          ],
          nutrition: {
            calories: 350,
            protein: 30,
            carbs: 40,
            fats: 10,
          },
          tags: ['high_protein', 'quick', 'snack'],
        },
        alternatives: ['meal-6', 'meal-7'],
      },
      {
        id: 'meal-4',
        name: 'Jantar',
        time: '19:00',
        calories: 650,
        macros: { protein: 50, carbs: 60, fats: 22 },
        recipe: {
          id: 'recipe-4',
          name: 'Salmão com Batata Doce',
          description: 'Salmão grelhado com batata doce e salada',
          prep_time: 25,
          difficulty: 'medium',
          ingredients: [
            { name: 'Salmão', quantity: 180, unit: 'g' },
            { name: 'Batata doce', quantity: 200, unit: 'g' },
            { name: 'Alface', quantity: 100, unit: 'g' },
            { name: 'Tomate', quantity: 100, unit: 'g' },
            { name: 'Azeite', quantity: 10, unit: 'ml' },
          ],
          instructions: [
            'Tempere o salmão com sal, limão e ervas',
            'Grelhe o salmão por 4-5 minutos de cada lado',
            'Cozinhe a batata doce no vapor ou forno',
            'Prepare a salada',
            'Monte o prato',
          ],
          nutrition: {
            calories: 650,
            protein: 50,
            carbs: 60,
            fats: 22,
          },
          tags: ['high_protein', 'omega3', 'dinner'],
        },
        alternatives: ['meal-8', 'meal-9'],
      },
    ],
    active: true,
  };
}

function getMockProgress(userId: string): UserProgress[] {
  const today = new Date();
  return [
    {
      id: 'progress-1',
      user_id: userId,
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      weight: 78,
      measurements: {
        waist: 85,
        hip: 98,
        chest: 100,
        thigh: 58,
        arm: 35,
      },
    },
    {
      id: 'progress-2',
      user_id: userId,
      date: today,
      weight: 77.5,
      measurements: {
        waist: 84,
        hip: 98,
        chest: 101,
        thigh: 58,
        arm: 36,
      },
    },
  ];
}

function getMockSubscription(userId: string): Subscription {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return {
    id: 'sub-1',
    user_id: userId,
    plan_type: 'monthly',
    status: 'active',
    current_period_start: today,
    current_period_end: nextMonth,
    cancel_at_period_end: false,
    created_at: today,
    updated_at: today,
  };
}
