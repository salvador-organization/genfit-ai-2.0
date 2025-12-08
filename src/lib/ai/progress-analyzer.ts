/**
 * 📊 SISTEMA DE ANÁLISE E RELATÓRIOS
 * Gera insights, progressão e recomendações inteligentes
 */

export interface ProgressData {
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    legs?: number;
  };
  photos?: string[];
}

export interface WorkoutLog {
  date: Date;
  workoutId: string;
  exercisesCompleted: number;
  totalExercises: number;
  duration: number;
  notes?: string;
}

export interface NutritionLog {
  date: Date;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatsConsumed: number;
  waterIntake: number;
  mealsLogged: number;
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

/**
 * Gera relatório de progresso
 */
export function generateProgressReport(
  progressData: ProgressData[],
  workoutLogs: WorkoutLog[],
  nutritionLogs: NutritionLog[],
  period: 'week' | 'month' | 'quarter' = 'week'
): ProgressReport {
  const now = new Date();
  const startDate = getStartDate(now, period);
  const endDate = now;

  // Filtra dados do período
  const periodProgress = progressData.filter(p => p.date >= startDate && p.date <= endDate);
  const periodWorkouts = workoutLogs.filter(w => w.date >= startDate && w.date <= endDate);
  const periodNutrition = nutritionLogs.filter(n => n.date >= startDate && n.date <= endDate);

  // Calcula mudanças
  const weightChange = calculateWeightChange(periodProgress);
  const bodyFatChange = calculateBodyFatChange(periodProgress);
  const muscleMassChange = calculateMuscleMassChange(periodProgress);

  // Calcula aderência
  const workoutAdherence = calculateWorkoutAdherence(periodWorkouts, period);
  const nutritionAdherence = calculateNutritionAdherence(periodNutrition, period);

  // Gera insights
  const insights = generateInsights(
    weightChange,
    bodyFatChange,
    workoutAdherence,
    nutritionAdherence
  );

  // Gera recomendações
  const recommendations = generateRecommendations(
    weightChange,
    workoutAdherence,
    nutritionAdherence,
    periodWorkouts,
    periodNutrition
  );

  // Gera conquistas
  const achievements = generateAchievements(
    periodWorkouts,
    periodNutrition,
    workoutAdherence,
    nutritionAdherence
  );

  // Gera gráficos
  const charts = generateCharts(periodProgress, periodWorkouts, periodNutrition);

  return {
    period,
    startDate,
    endDate,
    weightChange,
    bodyFatChange,
    muscleMassChange,
    workoutAdherence,
    nutritionAdherence,
    insights,
    recommendations,
    achievements,
    charts,
  };
}

/**
 * Calcula data de início baseado no período
 */
function getStartDate(endDate: Date, period: 'week' | 'month' | 'quarter'): Date {
  const date = new Date(endDate);
  
  if (period === 'week') {
    date.setDate(date.getDate() - 7);
  } else if (period === 'month') {
    date.setMonth(date.getMonth() - 1);
  } else if (period === 'quarter') {
    date.setMonth(date.getMonth() - 3);
  }

  return date;
}

/**
 * Calcula mudança de peso
 */
function calculateWeightChange(progressData: ProgressData[]): number {
  if (progressData.length < 2) return 0;

  const sorted = [...progressData].sort((a, b) => a.date.getTime() - b.date.getTime());
  const first = sorted[0].weight;
  const last = sorted[sorted.length - 1].weight;

  return Number((last - first).toFixed(1));
}

/**
 * Calcula mudança de gordura corporal
 */
function calculateBodyFatChange(progressData: ProgressData[]): number | undefined {
  const withBodyFat = progressData.filter(p => p.bodyFat !== undefined);
  if (withBodyFat.length < 2) return undefined;

  const sorted = [...withBodyFat].sort((a, b) => a.date.getTime() - b.date.getTime());
  const first = sorted[0].bodyFat!;
  const last = sorted[sorted.length - 1].bodyFat!;

  return Number((last - first).toFixed(1));
}

/**
 * Calcula mudança de massa muscular
 */
function calculateMuscleMassChange(progressData: ProgressData[]): number | undefined {
  const withMuscle = progressData.filter(p => p.muscleMass !== undefined);
  if (withMuscle.length < 2) return undefined;

  const sorted = [...withMuscle].sort((a, b) => a.date.getTime() - b.date.getTime());
  const first = sorted[0].muscleMass!;
  const last = sorted[sorted.length - 1].muscleMass!;

  return Number((last - first).toFixed(1));
}

/**
 * Calcula aderência aos treinos
 */
function calculateWorkoutAdherence(workoutLogs: WorkoutLog[], period: 'week' | 'month' | 'quarter'): number {
  const expectedWorkouts = period === 'week' ? 4 : period === 'month' ? 16 : 48;
  const completedWorkouts = workoutLogs.filter(w => w.exercisesCompleted === w.totalExercises).length;

  return Math.round((completedWorkouts / expectedWorkouts) * 100);
}

/**
 * Calcula aderência à dieta
 */
function calculateNutritionAdherence(nutritionLogs: NutritionLog[], period: 'week' | 'month' | 'quarter'): number {
  const expectedDays = period === 'week' ? 7 : period === 'month' ? 30 : 90;
  const daysWithAllMeals = nutritionLogs.filter(n => n.mealsLogged >= 4).length;

  return Math.round((daysWithAllMeals / expectedDays) * 100);
}

/**
 * Gera insights baseados nos dados
 */
function generateInsights(
  weightChange: number,
  bodyFatChange: number | undefined,
  workoutAdherence: number,
  nutritionAdherence: number
): string[] {
  const insights: string[] = [];

  // Insights sobre peso
  if (weightChange > 0) {
    insights.push(`Você ganhou ${weightChange}kg neste período`);
  } else if (weightChange < 0) {
    insights.push(`Você perdeu ${Math.abs(weightChange)}kg neste período`);
  } else {
    insights.push('Seu peso se manteve estável neste período');
  }

  // Insights sobre gordura corporal
  if (bodyFatChange !== undefined) {
    if (bodyFatChange < 0) {
      insights.push(`Excelente! Você reduziu ${Math.abs(bodyFatChange)}% de gordura corporal`);
    } else if (bodyFatChange > 0) {
      insights.push(`Sua gordura corporal aumentou ${bodyFatChange}%`);
    }
  }

  // Insights sobre aderência
  if (workoutAdherence >= 80) {
    insights.push('Sua consistência nos treinos está excelente!');
  } else if (workoutAdherence >= 60) {
    insights.push('Boa consistência nos treinos, mas há espaço para melhorar');
  } else {
    insights.push('Sua frequência de treinos precisa melhorar');
  }

  if (nutritionAdherence >= 80) {
    insights.push('Você está seguindo muito bem o plano alimentar!');
  } else if (nutritionAdherence >= 60) {
    insights.push('Boa aderência à dieta, mas pode melhorar');
  } else {
    insights.push('Foque mais em seguir o plano alimentar');
  }

  return insights;
}

/**
 * Gera recomendações personalizadas
 */
function generateRecommendations(
  weightChange: number,
  workoutAdherence: number,
  nutritionAdherence: number,
  workoutLogs: WorkoutLog[],
  nutritionLogs: NutritionLog[]
): string[] {
  const recommendations: string[] = [];

  // Recomendações baseadas em aderência
  if (workoutAdherence < 70) {
    recommendations.push('Tente treinar pelo menos 4x por semana para melhores resultados');
  }

  if (nutritionAdherence < 70) {
    recommendations.push('Planeje suas refeições com antecedência para melhorar a aderência');
  }

  // Recomendações baseadas em progresso
  if (Math.abs(weightChange) < 0.5) {
    recommendations.push('Considere ajustar suas calorias para ver mais progresso');
  }

  // Recomendações baseadas em consistência
  const avgWorkoutDuration = workoutLogs.reduce((acc, w) => acc + w.duration, 0) / workoutLogs.length;
  if (avgWorkoutDuration < 45) {
    recommendations.push('Tente aumentar a duração dos treinos para 50-60 minutos');
  }

  // Recomendações de hidratação
  const avgWater = nutritionLogs.reduce((acc, n) => acc + n.waterIntake, 0) / nutritionLogs.length;
  if (avgWater < 2000) {
    recommendations.push('Aumente sua ingestão de água para pelo menos 2.5L por dia');
  }

  // Recomendações gerais
  if (recommendations.length === 0) {
    recommendations.push('Continue com o ótimo trabalho! Mantenha a consistência');
  }

  return recommendations;
}

/**
 * Gera conquistas do período
 */
function generateAchievements(
  workoutLogs: WorkoutLog[],
  nutritionLogs: NutritionLog[],
  workoutAdherence: number,
  nutritionAdherence: number
): string[] {
  const achievements: string[] = [];

  // Conquistas de treino
  const totalWorkouts = workoutLogs.length;
  if (totalWorkouts >= 20) {
    achievements.push('🏆 20+ treinos completados!');
  } else if (totalWorkouts >= 10) {
    achievements.push('💪 10+ treinos completados!');
  }

  // Conquistas de aderência
  if (workoutAdherence >= 90) {
    achievements.push('⭐ Aderência excepcional aos treinos!');
  }

  if (nutritionAdherence >= 90) {
    achievements.push('🥗 Aderência excepcional à dieta!');
  }

  // Conquistas de consistência
  const consecutiveDays = calculateConsecutiveDays(workoutLogs);
  if (consecutiveDays >= 7) {
    achievements.push(`🔥 ${consecutiveDays} dias consecutivos treinando!`);
  }

  return achievements;
}

/**
 * Calcula dias consecutivos de treino
 */
function calculateConsecutiveDays(workoutLogs: WorkoutLog[]): number {
  if (workoutLogs.length === 0) return 0;

  const sorted = [...workoutLogs].sort((a, b) => b.date.getTime() - a.date.getTime());
  let consecutive = 1;
  let currentDate = new Date(sorted[0].date);

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);

    const logDate = new Date(sorted[i].date);
    logDate.setHours(0, 0, 0, 0);
    prevDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === prevDate.getTime()) {
      consecutive++;
      currentDate = logDate;
    } else {
      break;
    }
  }

  return consecutive;
}

/**
 * Gera dados para gráficos
 */
function generateCharts(
  progressData: ProgressData[],
  workoutLogs: WorkoutLog[],
  nutritionLogs: NutritionLog[]
): ChartData[] {
  const charts: ChartData[] = [];

  // Gráfico de peso
  if (progressData.length > 0) {
    const sorted = [...progressData].sort((a, b) => a.date.getTime() - b.date.getTime());
    charts.push({
      type: 'line',
      title: 'Evolução do Peso',
      data: sorted.map(p => p.weight),
      labels: sorted.map(p => p.date.toLocaleDateString('pt-BR')),
    });
  }

  // Gráfico de treinos por semana
  if (workoutLogs.length > 0) {
    const workoutsByWeek = groupByWeek(workoutLogs);
    charts.push({
      type: 'bar',
      title: 'Treinos por Semana',
      data: Object.values(workoutsByWeek),
      labels: Object.keys(workoutsByWeek),
    });
  }

  // Gráfico de calorias
  if (nutritionLogs.length > 0) {
    const sorted = [...nutritionLogs].sort((a, b) => a.date.getTime() - b.date.getTime());
    charts.push({
      type: 'line',
      title: 'Calorias Consumidas',
      data: sorted.map(n => n.caloriesConsumed),
      labels: sorted.map(n => n.date.toLocaleDateString('pt-BR')),
    });
  }

  return charts;
}

/**
 * Agrupa treinos por semana
 */
function groupByWeek(workoutLogs: WorkoutLog[]): Record<string, number> {
  const weeks: Record<string, number> = {};

  workoutLogs.forEach(log => {
    const weekStart = getWeekStart(log.date);
    const weekKey = weekStart.toLocaleDateString('pt-BR');

    if (!weeks[weekKey]) {
      weeks[weekKey] = 0;
    }
    weeks[weekKey]++;
  });

  return weeks;
}

/**
 * Retorna início da semana
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Prediz progresso futuro baseado em dados históricos
 */
export function predictProgress(
  progressData: ProgressData[],
  weeksAhead: number = 4
): { predictedWeight: number; confidence: number } {
  if (progressData.length < 3) {
    return { predictedWeight: 0, confidence: 0 };
  }

  const sorted = [...progressData].sort((a, b) => a.date.getTime() - b.date.getTime());
  const weights = sorted.map(p => p.weight);

  // Regressão linear simples
  const n = weights.length;
  const sumX = weights.reduce((acc, _, i) => acc + i, 0);
  const sumY = weights.reduce((acc, w) => acc + w, 0);
  const sumXY = weights.reduce((acc, w, i) => acc + i * w, 0);
  const sumX2 = weights.reduce((acc, _, i) => acc + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predictedWeight = slope * (n + weeksAhead) + intercept;
  const confidence = Math.min(95, n * 10); // Confiança aumenta com mais dados

  return {
    predictedWeight: Number(predictedWeight.toFixed(1)),
    confidence,
  };
}
