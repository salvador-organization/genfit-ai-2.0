/**
 * 📊 SISTEMA DE KPIs E ANALYTICS
 * Tracking de métricas de negócio e engajamento
 */

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
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  ltv: number; // Lifetime Value
  avgRevenuePerUser: number;
  churnMRR: number;

  // Crescimento
  newSubscriptions: number;
  canceledSubscriptions: number;
  netGrowth: number;
  growthRate: number;
}

export interface AnalyticsEvent {
  eventName: string;
  eventCategory: string;
  userId?: string;
  timestamp: Date;
  properties?: Record<string, any>;
}

/**
 * Eventos de tracking definidos
 */
export const ANALYTICS_EVENTS = {
  // Quiz
  QUIZ_STARTED: 'quiz_started',
  QUIZ_STEP_COMPLETED: 'quiz_step_completed',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_ABANDONED: 'quiz_abandoned',

  // Autenticação
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',

  // Planos
  PLANS_PAGE_VIEWED: 'plans_page_viewed',
  PLAN_SELECTED: 'plan_selected',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_ABANDONED: 'checkout_abandoned',

  // Ativação
  FIRST_WORKOUT_VIEWED: 'first_workout_viewed',
  FIRST_WORKOUT_COMPLETED: 'first_workout_completed',
  FIRST_MEAL_LOGGED: 'first_meal_logged',
  PROFILE_COMPLETED: 'profile_completed',

  // Engajamento - Treinos
  WORKOUT_STARTED: 'workout_started',
  WORKOUT_COMPLETED: 'workout_completed',
  WORKOUT_ABANDONED: 'workout_abandoned',
  EXERCISE_COMPLETED: 'exercise_completed',
  EXERCISE_SUBSTITUTED: 'exercise_substituted',
  WORKOUT_FEEDBACK_SUBMITTED: 'workout_feedback_submitted',

  // Engajamento - Dieta
  MEAL_LOGGED: 'meal_logged',
  MEAL_SUBSTITUTED: 'meal_substituted',
  WATER_LOGGED: 'water_logged',
  SHOPPING_LIST_GENERATED: 'shopping_list_generated',
  NUTRITION_FEEDBACK_SUBMITTED: 'nutrition_feedback_submitted',

  // Progresso
  PROGRESS_PHOTO_UPLOADED: 'progress_photo_uploaded',
  WEIGHT_LOGGED: 'weight_logged',
  MEASUREMENTS_LOGGED: 'measurements_logged',
  PROGRESS_REPORT_VIEWED: 'progress_report_viewed',

  // Assinatura
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  SUBSCRIPTION_REACTIVATED: 'subscription_reactivated',
  CANCELLATION_REASON_SUBMITTED: 'cancellation_reason_submitted',

  // Notificações
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_CLICKED: 'notification_clicked',
  NOTIFICATION_DISMISSED: 'notification_dismissed',

  // Outros
  HELP_ARTICLE_VIEWED: 'help_article_viewed',
  SUPPORT_CONTACTED: 'support_contacted',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  SHARE_CLICKED: 'share_clicked',
} as const;

/**
 * Categorias de eventos
 */
export const EVENT_CATEGORIES = {
  ACQUISITION: 'acquisition',
  ACTIVATION: 'activation',
  ENGAGEMENT: 'engagement',
  RETENTION: 'retention',
  REVENUE: 'revenue',
  REFERRAL: 'referral',
} as const;

/**
 * Calcula KPIs do período
 */
export function calculateKPIs(
  startDate: Date,
  endDate: Date,
  events: AnalyticsEvent[],
  users: any[],
  subscriptions: any[],
  payments: any[]
): KPIMetrics {
  // Filtra eventos do período
  const periodEvents = events.filter(
    e => e.timestamp >= startDate && e.timestamp <= endDate
  );

  // Conversão
  const quizStarted = countEvents(periodEvents, ANALYTICS_EVENTS.QUIZ_STARTED);
  const quizCompleted = countEvents(periodEvents, ANALYTICS_EVENTS.QUIZ_COMPLETED);
  const checkoutCompleted = countEvents(periodEvents, ANALYTICS_EVENTS.CHECKOUT_COMPLETED);

  // Ativação
  const newUsers = users.filter(
    u => u.created_at >= startDate && u.created_at <= endDate
  ).length;

  const activatedUsers = users.filter(u => {
    const userEvents = periodEvents.filter(e => e.userId === u.id);
    return (
      hasEvent(userEvents, ANALYTICS_EVENTS.FIRST_WORKOUT_COMPLETED) &&
      hasEvent(userEvents, ANALYTICS_EVENTS.FIRST_MEAL_LOGGED)
    );
  }).length;

  // Retenção
  const activeUsers = calculateActiveUsers(users, periodEvents);
  const retentionDay7 = calculateRetention(users, events, 7);
  const retentionDay30 = calculateRetention(users, events, 30);
  const retentionDay90 = calculateRetention(users, events, 90);

  // Churn
  const canceledSubs = subscriptions.filter(
    s => s.canceled_at >= startDate && s.canceled_at <= endDate
  ).length;
  const totalActiveSubs = subscriptions.filter(s => s.status === 'active').length;
  const churnRate = totalActiveSubs > 0 ? (canceledSubs / totalActiveSubs) * 100 : 0;

  // Engajamento
  const workoutEvents = periodEvents.filter(
    e => e.eventName === ANALYTICS_EVENTS.WORKOUT_COMPLETED
  );
  const avgWorkoutsPerWeek = workoutEvents.length / Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

  const mealEvents = periodEvents.filter(
    e => e.eventName === ANALYTICS_EVENTS.MEAL_LOGGED
  );
  const avgMealsPerDay = mealEvents.length / Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

  // Financeiro
  const periodPayments = payments.filter(
    p => p.paid_at >= startDate && p.paid_at <= endDate && p.status === 'paid'
  );
  const totalRevenue = periodPayments.reduce((sum, p) => sum + p.amount, 0);
  const mrr = calculateMRR(subscriptions);
  const arr = mrr * 12;
  const ltv = calculateLTV(users, payments);

  // Crescimento
  const newSubs = subscriptions.filter(
    s => s.created_at >= startDate && s.created_at <= endDate
  ).length;
  const netGrowth = newSubs - canceledSubs;
  const growthRate = totalActiveSubs > 0 ? (netGrowth / totalActiveSubs) * 100 : 0;

  return {
    // Conversão
    quizStarted,
    quizCompleted,
    quizCompletionRate: quizStarted > 0 ? (quizCompleted / quizStarted) * 100 : 0,
    quizToSubscription: checkoutCompleted,
    quizToSubscriptionRate: quizCompleted > 0 ? (checkoutCompleted / quizCompleted) * 100 : 0,

    // Ativação
    newUsers,
    activatedUsers,
    activationRate: newUsers > 0 ? (activatedUsers / newUsers) * 100 : 0,
    avgTimeToActivation: 0, // TODO: calcular tempo médio

    // Retenção
    activeUsers,
    retentionDay7,
    retentionDay30,
    retentionDay90,
    churnRate,

    // Engajamento
    avgWorkoutsPerWeek,
    avgMealsLoggedPerDay: avgMealsPerDay,
    avgSessionDuration: 0, // TODO: calcular duração média
    dailyActiveUsers: calculateDAU(users, periodEvents),
    weeklyActiveUsers: calculateWAU(users, periodEvents),
    monthlyActiveUsers: calculateMAU(users, periodEvents),

    // Financeiro
    mrr,
    arr,
    ltv,
    avgRevenuePerUser: users.length > 0 ? totalRevenue / users.length : 0,
    churnMRR: calculateChurnMRR(subscriptions, canceledSubs),

    // Crescimento
    newSubscriptions: newSubs,
    canceledSubscriptions: canceledSubs,
    netGrowth,
    growthRate,
  };
}

/**
 * Conta eventos de um tipo específico
 */
function countEvents(events: AnalyticsEvent[], eventName: string): number {
  return events.filter(e => e.eventName === eventName).length;
}

/**
 * Verifica se usuário tem evento específico
 */
function hasEvent(events: AnalyticsEvent[], eventName: string): boolean {
  return events.some(e => e.eventName === eventName);
}

/**
 * Calcula usuários ativos
 */
function calculateActiveUsers(users: any[], events: AnalyticsEvent[]): number {
  const activeUserIds = new Set(events.map(e => e.userId).filter(Boolean));
  return activeUserIds.size;
}

/**
 * Calcula retenção em X dias
 */
function calculateRetention(users: any[], events: AnalyticsEvent[], days: number): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const cohort = users.filter(u => u.created_at <= cutoffDate);
  if (cohort.length === 0) return 0;

  const retained = cohort.filter(u => {
    const userEvents = events.filter(e => e.userId === u.id && e.timestamp >= cutoffDate);
    return userEvents.length > 0;
  });

  return (retained.length / cohort.length) * 100;
}

/**
 * Calcula DAU (Daily Active Users)
 */
function calculateDAU(users: any[], events: AnalyticsEvent[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEvents = events.filter(e => {
    const eventDate = new Date(e.timestamp);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  const activeUserIds = new Set(todayEvents.map(e => e.userId).filter(Boolean));
  return activeUserIds.size;
}

/**
 * Calcula WAU (Weekly Active Users)
 */
function calculateWAU(users: any[], events: AnalyticsEvent[]): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekEvents = events.filter(e => e.timestamp >= weekAgo);
  const activeUserIds = new Set(weekEvents.map(e => e.userId).filter(Boolean));
  return activeUserIds.size;
}

/**
 * Calcula MAU (Monthly Active Users)
 */
function calculateMAU(users: any[], events: AnalyticsEvent[]): number {
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const monthEvents = events.filter(e => e.timestamp >= monthAgo);
  const activeUserIds = new Set(monthEvents.map(e => e.userId).filter(Boolean));
  return activeUserIds.size;
}

/**
 * Calcula MRR (Monthly Recurring Revenue)
 */
function calculateMRR(subscriptions: any[]): number {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

  return activeSubscriptions.reduce((sum, sub) => {
    if (sub.plan === 'monthly') {
      return sum + sub.amount;
    } else if (sub.plan === 'quarterly') {
      return sum + (sub.amount / 3);
    } else if (sub.plan === 'annual') {
      return sum + (sub.amount / 12);
    }
    return sum;
  }, 0);
}

/**
 * Calcula LTV (Lifetime Value)
 */
function calculateLTV(users: any[], payments: any[]): number {
  if (users.length === 0) return 0;

  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return totalRevenue / users.length;
}

/**
 * Calcula MRR perdido por churn
 */
function calculateChurnMRR(subscriptions: any[], canceledCount: number): number {
  const canceledSubs = subscriptions
    .filter(s => s.status === 'canceled')
    .slice(-canceledCount);

  return canceledSubs.reduce((sum, sub) => {
    if (sub.plan === 'monthly') {
      return sum + sub.amount;
    } else if (sub.plan === 'quarterly') {
      return sum + (sub.amount / 3);
    } else if (sub.plan === 'annual') {
      return sum + (sub.amount / 12);
    }
    return sum;
  }, 0);
}

/**
 * Registra evento de analytics
 */
export function trackEvent(
  eventName: string,
  category: string,
  userId?: string,
  properties?: Record<string, any>
): AnalyticsEvent {
  return {
    eventName,
    eventCategory: category,
    userId,
    timestamp: new Date(),
    properties,
  };
}

/**
 * Motivos de cancelamento
 */
export const CANCELLATION_REASONS = {
  TOO_EXPENSIVE: 'too_expensive',
  NOT_USING: 'not_using',
  TECHNICAL_ISSUES: 'technical_issues',
  FOUND_ALTERNATIVE: 'found_alternative',
  ACHIEVED_GOAL: 'achieved_goal',
  LACK_OF_RESULTS: 'lack_of_results',
  LACK_OF_TIME: 'lack_of_time',
  OTHER: 'other',
} as const;

/**
 * Analisa motivos de cancelamento
 */
export function analyzeCancellationReasons(
  events: AnalyticsEvent[]
): Record<string, number> {
  const cancellationEvents = events.filter(
    e => e.eventName === ANALYTICS_EVENTS.CANCELLATION_REASON_SUBMITTED
  );

  const reasons: Record<string, number> = {};

  cancellationEvents.forEach(event => {
    const reason = event.properties?.reason || 'other';
    reasons[reason] = (reasons[reason] || 0) + 1;
  });

  return reasons;
}
