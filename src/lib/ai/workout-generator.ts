/**
 * 🤖 GERADOR DE TREINOS PERSONALIZADO
 * Sistema de IA para criar planos de treino baseados no perfil do usuário
 */

import { QuizData } from '../types/quiz';

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  muscleGroup: string;
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  alternatives?: string[];
}

export interface WorkoutDay {
  id: string;
  day: string;
  focus: string;
  duration: number;
  exercises: WorkoutExercise[];
  warmup: string[];
  cooldown: string[];
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  weekNumber: number;
  days: WorkoutDay[];
  goal: string;
  difficulty: string;
  createdAt: Date;
  notes?: string;
}

// Base de exercícios por grupo muscular
const EXERCISE_DATABASE = {
  chest: [
    { name: 'Supino Reto', equipment: ['barra', 'banco'], difficulty: 'intermediate' },
    { name: 'Supino Inclinado', equipment: ['barra', 'banco'], difficulty: 'intermediate' },
    { name: 'Flexão de Braço', equipment: [], difficulty: 'beginner' },
    { name: 'Crucifixo com Halteres', equipment: ['halteres', 'banco'], difficulty: 'beginner' },
    { name: 'Supino com Halteres', equipment: ['halteres', 'banco'], difficulty: 'beginner' },
  ],
  back: [
    { name: 'Barra Fixa', equipment: ['barra fixa'], difficulty: 'intermediate' },
    { name: 'Remada Curvada', equipment: ['barra'], difficulty: 'intermediate' },
    { name: 'Remada com Halteres', equipment: ['halteres', 'banco'], difficulty: 'beginner' },
    { name: 'Pulldown', equipment: ['máquina'], difficulty: 'beginner' },
    { name: 'Remada Baixa', equipment: ['máquina'], difficulty: 'beginner' },
  ],
  legs: [
    { name: 'Agachamento Livre', equipment: ['barra'], difficulty: 'intermediate' },
    { name: 'Leg Press', equipment: ['máquina'], difficulty: 'beginner' },
    { name: 'Cadeira Extensora', equipment: ['máquina'], difficulty: 'beginner' },
    { name: 'Cadeira Flexora', equipment: ['máquina'], difficulty: 'beginner' },
    { name: 'Afundo', equipment: ['halteres'], difficulty: 'beginner' },
    { name: 'Stiff', equipment: ['barra', 'halteres'], difficulty: 'intermediate' },
  ],
  shoulders: [
    { name: 'Desenvolvimento com Barra', equipment: ['barra'], difficulty: 'intermediate' },
    { name: 'Desenvolvimento com Halteres', equipment: ['halteres'], difficulty: 'beginner' },
    { name: 'Elevação Lateral', equipment: ['halteres'], difficulty: 'beginner' },
    { name: 'Elevação Frontal', equipment: ['halteres'], difficulty: 'beginner' },
    { name: 'Remada Alta', equipment: ['barra'], difficulty: 'intermediate' },
  ],
  arms: [
    { name: 'Rosca Direta', equipment: ['barra'], difficulty: 'beginner' },
    { name: 'Rosca Alternada', equipment: ['halteres'], difficulty: 'beginner' },
    { name: 'Tríceps Testa', equipment: ['barra'], difficulty: 'beginner' },
    { name: 'Tríceps Corda', equipment: ['máquina'], difficulty: 'beginner' },
    { name: 'Rosca Martelo', equipment: ['halteres'], difficulty: 'beginner' },
  ],
  abs: [
    { name: 'Abdominal Crunch', equipment: [], difficulty: 'beginner' },
    { name: 'Prancha', equipment: [], difficulty: 'beginner' },
    { name: 'Elevação de Pernas', equipment: [], difficulty: 'intermediate' },
    { name: 'Abdominal Bicicleta', equipment: [], difficulty: 'beginner' },
  ],
};

/**
 * Gera um plano de treino personalizado baseado no quiz
 */
export function generateWorkoutPlan(quizData: QuizData, weekNumber: number = 1): WorkoutPlan {
  const goal = quizData.goal || 'hipertrofia';
  const experience = quizData.experience || 'beginner';
  const daysPerWeek = quizData.trainingDays || 3;

  let days: WorkoutDay[] = [];

  // Gera treinos baseado na frequência semanal
  if (daysPerWeek === 3) {
    days = generateThreeDaySplit(goal, experience, weekNumber);
  } else if (daysPerWeek === 4) {
    days = generateFourDaySplit(goal, experience, weekNumber);
  } else if (daysPerWeek === 5) {
    days = generateFiveDaySplit(goal, experience, weekNumber);
  } else {
    days = generateThreeDaySplit(goal, experience, weekNumber);
  }

  return {
    id: `workout-${Date.now()}`,
    userId: quizData.userId || 'temp',
    weekNumber,
    days,
    goal,
    difficulty: experience,
    createdAt: new Date(),
    notes: `Plano personalizado para ${goal} - Semana ${weekNumber}`,
  };
}

/**
 * Treino ABC (3x por semana)
 */
function generateThreeDaySplit(goal: string, experience: string, week: number): WorkoutDay[] {
  return [
    {
      id: 'day-1',
      day: 'Segunda-feira',
      focus: 'Peito e Tríceps',
      duration: 60,
      exercises: [
        createExercise('Supino Reto', 'chest', 4, '8-12', '90s', experience, week),
        createExercise('Supino Inclinado', 'chest', 3, '10-12', '60s', experience, week),
        createExercise('Crucifixo com Halteres', 'chest', 3, '12-15', '60s', experience, week),
        createExercise('Tríceps Testa', 'arms', 3, '10-12', '60s', experience, week),
        createExercise('Tríceps Corda', 'arms', 3, '12-15', '45s', experience, week),
      ],
      warmup: ['5 min de esteira', 'Alongamento dinâmico de peito e tríceps'],
      cooldown: ['Alongamento estático', '5 min de caminhada leve'],
    },
    {
      id: 'day-2',
      day: 'Quarta-feira',
      focus: 'Costas e Bíceps',
      duration: 60,
      exercises: [
        createExercise('Barra Fixa', 'back', 4, '6-10', '90s', experience, week),
        createExercise('Remada Curvada', 'back', 4, '8-12', '90s', experience, week),
        createExercise('Remada com Halteres', 'back', 3, '10-12', '60s', experience, week),
        createExercise('Rosca Direta', 'arms', 3, '10-12', '60s', experience, week),
        createExercise('Rosca Martelo', 'arms', 3, '12-15', '45s', experience, week),
      ],
      warmup: ['5 min de esteira', 'Alongamento dinâmico de costas e bíceps'],
      cooldown: ['Alongamento estático', '5 min de caminhada leve'],
    },
    {
      id: 'day-3',
      day: 'Sexta-feira',
      focus: 'Pernas e Ombros',
      duration: 70,
      exercises: [
        createExercise('Agachamento Livre', 'legs', 4, '8-12', '120s', experience, week),
        createExercise('Leg Press', 'legs', 3, '10-15', '90s', experience, week),
        createExercise('Stiff', 'legs', 3, '10-12', '90s', experience, week),
        createExercise('Desenvolvimento com Halteres', 'shoulders', 3, '10-12', '60s', experience, week),
        createExercise('Elevação Lateral', 'shoulders', 3, '12-15', '45s', experience, week),
        createExercise('Abdominal Crunch', 'abs', 3, '15-20', '30s', experience, week),
      ],
      warmup: ['5 min de bike', 'Alongamento dinâmico de pernas e ombros'],
      cooldown: ['Alongamento estático', '5 min de caminhada leve'],
    },
  ];
}

/**
 * Treino ABCD (4x por semana)
 */
function generateFourDaySplit(goal: string, experience: string, week: number): WorkoutDay[] {
  return [
    {
      id: 'day-1',
      day: 'Segunda-feira',
      focus: 'Peito',
      duration: 60,
      exercises: [
        createExercise('Supino Reto', 'chest', 4, '8-12', '90s', experience, week),
        createExercise('Supino Inclinado', 'chest', 4, '8-12', '90s', experience, week),
        createExercise('Crucifixo com Halteres', 'chest', 3, '12-15', '60s', experience, week),
        createExercise('Flexão de Braço', 'chest', 3, 'máximo', '60s', experience, week),
      ],
      warmup: ['5 min de esteira', 'Alongamento dinâmico de peito'],
      cooldown: ['Alongamento estático'],
    },
    {
      id: 'day-2',
      day: 'Terça-feira',
      focus: 'Costas',
      duration: 60,
      exercises: [
        createExercise('Barra Fixa', 'back', 4, '6-10', '90s', experience, week),
        createExercise('Remada Curvada', 'back', 4, '8-12', '90s', experience, week),
        createExercise('Pulldown', 'back', 3, '10-12', '60s', experience, week),
        createExercise('Remada Baixa', 'back', 3, '12-15', '60s', experience, week),
      ],
      warmup: ['5 min de esteira', 'Alongamento dinâmico de costas'],
      cooldown: ['Alongamento estático'],
    },
    {
      id: 'day-3',
      day: 'Quinta-feira',
      focus: 'Pernas',
      duration: 70,
      exercises: [
        createExercise('Agachamento Livre', 'legs', 4, '8-12', '120s', experience, week),
        createExercise('Leg Press', 'legs', 4, '10-15', '90s', experience, week),
        createExercise('Cadeira Extensora', 'legs', 3, '12-15', '60s', experience, week),
        createExercise('Stiff', 'legs', 3, '10-12', '90s', experience, week),
        createExercise('Cadeira Flexora', 'legs', 3, '12-15', '60s', experience, week),
      ],
      warmup: ['5 min de bike', 'Alongamento dinâmico de pernas'],
      cooldown: ['Alongamento estático'],
    },
    {
      id: 'day-4',
      day: 'Sexta-feira',
      focus: 'Ombros e Braços',
      duration: 60,
      exercises: [
        createExercise('Desenvolvimento com Barra', 'shoulders', 4, '8-12', '90s', experience, week),
        createExercise('Elevação Lateral', 'shoulders', 3, '12-15', '60s', experience, week),
        createExercise('Elevação Frontal', 'shoulders', 3, '12-15', '60s', experience, week),
        createExercise('Rosca Direta', 'arms', 3, '10-12', '60s', experience, week),
        createExercise('Tríceps Testa', 'arms', 3, '10-12', '60s', experience, week),
      ],
      warmup: ['5 min de esteira', 'Alongamento dinâmico de ombros e braços'],
      cooldown: ['Alongamento estático'],
    },
  ];
}

/**
 * Treino ABCDE (5x por semana)
 */
function generateFiveDaySplit(goal: string, experience: string, week: number): WorkoutDay[] {
  const fourDays = generateFourDaySplit(goal, experience, week);
  return [
    ...fourDays,
    {
      id: 'day-5',
      day: 'Sábado',
      focus: 'Abdômen e Cardio',
      duration: 45,
      exercises: [
        createExercise('Abdominal Crunch', 'abs', 4, '15-20', '30s', experience, week),
        createExercise('Prancha', 'abs', 4, '30-60s', '30s', experience, week),
        createExercise('Elevação de Pernas', 'abs', 3, '12-15', '30s', experience, week),
        createExercise('Abdominal Bicicleta', 'abs', 3, '20-30', '30s', experience, week),
      ],
      warmup: ['5 min de esteira', '20 min de cardio moderado'],
      cooldown: ['Alongamento completo', '5 min de caminhada'],
    },
  ];
}

/**
 * Cria um exercício com progressão baseada na semana
 */
function createExercise(
  name: string,
  muscleGroup: string,
  sets: number,
  reps: string,
  rest: string,
  experience: string,
  week: number
): WorkoutExercise {
  // Progressão: aumenta carga/volume a cada 2 semanas
  const progressionFactor = Math.floor(week / 2);
  const adjustedSets = sets + (progressionFactor > 0 ? 1 : 0);

  return {
    id: `exercise-${name.toLowerCase().replace(/\s/g, '-')}`,
    name,
    sets: adjustedSets,
    reps,
    rest,
    muscleGroup,
    equipment: getEquipment(name),
    difficulty: experience as any,
    notes: week > 2 ? `Semana ${week}: Aumente a carga em 5-10% se possível` : undefined,
    alternatives: getAlternatives(name, muscleGroup),
  };
}

/**
 * Retorna equipamentos necessários para o exercício
 */
function getEquipment(exerciseName: string): string[] {
  const equipmentMap: Record<string, string[]> = {
    'Supino Reto': ['barra', 'banco'],
    'Supino Inclinado': ['barra', 'banco'],
    'Flexão de Braço': [],
    'Crucifixo com Halteres': ['halteres', 'banco'],
    'Barra Fixa': ['barra fixa'],
    'Remada Curvada': ['barra'],
    'Remada com Halteres': ['halteres', 'banco'],
    'Agachamento Livre': ['barra', 'rack'],
    'Leg Press': ['máquina'],
    'Desenvolvimento com Barra': ['barra'],
    'Desenvolvimento com Halteres': ['halteres'],
    'Elevação Lateral': ['halteres'],
    'Rosca Direta': ['barra'],
    'Tríceps Testa': ['barra'],
  };
  return equipmentMap[exerciseName] || [];
}

/**
 * Retorna exercícios alternativos
 */
function getAlternatives(exerciseName: string, muscleGroup: string): string[] {
  const alternatives: Record<string, string[]> = {
    'Supino Reto': ['Supino com Halteres', 'Flexão de Braço'],
    'Barra Fixa': ['Pulldown', 'Remada Alta'],
    'Agachamento Livre': ['Leg Press', 'Agachamento no Smith'],
    'Desenvolvimento com Barra': ['Desenvolvimento com Halteres', 'Desenvolvimento no Smith'],
  };
  return alternatives[exerciseName] || [];
}

/**
 * Ajusta treino baseado em feedback do usuário
 */
export function adjustWorkout(
  currentPlan: WorkoutPlan,
  feedback: {
    tooEasy?: boolean;
    tooHard?: boolean;
    lackOfTime?: boolean;
    injury?: string;
  }
): WorkoutPlan {
  const adjustedPlan = { ...currentPlan };

  if (feedback.tooEasy) {
    // Aumenta volume e intensidade
    adjustedPlan.days = adjustedPlan.days.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => ({
        ...ex,
        sets: ex.sets + 1,
        rest: `${parseInt(ex.rest) - 15}s`,
      })),
    }));
  }

  if (feedback.tooHard) {
    // Reduz volume
    adjustedPlan.days = adjustedPlan.days.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => ({
        ...ex,
        sets: Math.max(2, ex.sets - 1),
      })),
    }));
  }

  if (feedback.lackOfTime) {
    // Reduz número de exercícios
    adjustedPlan.days = adjustedPlan.days.map(day => ({
      ...day,
      duration: day.duration - 15,
      exercises: day.exercises.slice(0, -1),
    }));
  }

  return adjustedPlan;
}

/**
 * Sugere substituição de exercício
 */
export function suggestExerciseSubstitution(
  exercise: WorkoutExercise,
  reason: 'equipment' | 'injury' | 'preference'
): WorkoutExercise[] {
  const muscleGroup = exercise.muscleGroup;
  const alternatives = EXERCISE_DATABASE[muscleGroup as keyof typeof EXERCISE_DATABASE] || [];

  return alternatives
    .filter(alt => alt.name !== exercise.name)
    .map(alt => ({
      id: `exercise-${alt.name.toLowerCase().replace(/\s/g, '-')}`,
      name: alt.name,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.rest,
      muscleGroup,
      equipment: alt.equipment,
      difficulty: alt.difficulty,
      alternatives: [],
    }));
}
