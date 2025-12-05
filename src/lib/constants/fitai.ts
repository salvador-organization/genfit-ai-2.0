// 🏋️ FitAI - Constants and Configuration

import type { PlanDetails } from '@/lib/types/fitai';

// ============================================
// PRODUCT INFO
// ============================================

export const PRODUCT_NAME = 'FitAI';

export const PRODUCT_TAGLINE = 'Seu treino e sua dieta — prontos, personalizados e fáceis.';

export const PRODUCT_DESCRIPTION = 
  'Plano de treino e dieta 100% personalizado em minutos — criado por IA com base no seu corpo, objetivo, rotina e preferências — acompanhe progresso e ajuste em tempo real.';

// ============================================
// PRICING PLANS
// ============================================

export const PLANS: Record<'monthly' | 'quarterly' | 'annual', PlanDetails> = {
  monthly: {
    type: 'monthly',
    name: 'Plano Mensal',
    price_monthly: 31.90,
    price_total: 31.90,
    billing_period: 'Cobrança mensal',
    features: [
      'Plano de treino personalizado',
      'Plano alimentar completo',
      'Substituições ilimitadas de exercícios',
      'Substituições ilimitadas de refeições',
      'Acompanhamento de progresso',
      'Gráficos e relatórios',
      'Suporte via chat',
      'Atualizações automáticas do plano',
      'Acesso mobile e web',
    ],
  },
  quarterly: {
    type: 'quarterly',
    name: 'Plano Trimestral',
    price_monthly: 25.90,
    price_total: 77.70,
    billing_period: 'Cobrança trimestral',
    savings_percentage: 19,
    savings_amount: 17.70,
    badge: 'MAIS POPULAR',
    popular: true,
    features: [
      'Tudo do plano mensal',
      '3 meses de compromisso = resultados garantidos',
      'Relatórios mensais detalhados',
      'Check-ins semanais personalizados',
      'Acesso prioritário a novos recursos',
      'Conteúdo exclusivo semanal',
    ],
  },
  annual: {
    type: 'annual',
    name: 'Plano Anual',
    price_monthly: 19.90,
    price_total: 238.80,
    billing_period: 'Cobrança anual',
    savings_percentage: 38,
    savings_amount: 144.00,
    badge: 'MELHOR CUSTO-BENEFÍCIO',
    features: [
      'Tudo do plano trimestral',
      '12 meses para transformação completa',
      'Consultoria mensal com especialista (30 min)',
      'Plano de suplementação personalizado',
      'Acesso vitalício a biblioteca de conteúdos',
      'Prioridade máxima no suporte',
      'Acesso antecipado a novos recursos',
      'Garantia de 30 dias ou seu dinheiro de volta',
    ],
  },
};

// ============================================
// QUIZ OPTIONS
// ============================================

export const QUIZ_OPTIONS = {
  goals: [
    { value: 'weight_loss', label: 'Emagrecer / Perder gordura' },
    { value: 'muscle_gain', label: 'Ganhar massa muscular' },
    { value: 'toning', label: 'Tonificar / Definir' },
    { value: 'maintenance', label: 'Manutenção de peso' },
    { value: 'cardio', label: 'Melhorar condicionamento / Cardiovascular' },
    { value: 'rehabilitation', label: 'Reabilitação / Saúde' },
  ],
  
  experience_levels: [
    { value: 'beginner', label: 'Iniciante (0-3 meses de treino)' },
    { value: 'intermediate', label: 'Intermediário (3-18 meses de treino)' },
    { value: 'advanced', label: 'Avançado (mais de 18 meses de treino)' },
  ],
  
  session_durations: [
    { value: '15-25', label: '15 a 25 minutos' },
    { value: '25-40', label: '25 a 40 minutos' },
    { value: '40-60', label: '40 a 60 minutos' },
    { value: '60+', label: 'Mais de 60 minutos' },
  ],
  
  weekly_frequencies: [
    { value: '2', label: '2x por semana' },
    { value: '3', label: '3x por semana' },
    { value: '4-5', label: '4 a 5x por semana' },
    { value: '6-7', label: '6 a 7x por semana' },
  ],
  
  training_locations: [
    { value: 'home_no_equipment', label: 'Em casa (sem equipamentos)' },
    { value: 'home_with_equipment', label: 'Em casa (com halteres/banda)' },
    { value: 'gym', label: 'Academia completa' },
    { value: 'outdoor', label: 'Externo (corrida/bike)' },
  ],
  
  sex_options: [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Feminino' },
    { value: 'other', label: 'Prefiro não informar' },
  ],
  
  dietary_restrictions: [
    { value: 'vegetarian', label: 'Vegetariano' },
    { value: 'vegan', label: 'Vegano' },
    { value: 'lactose_intolerant', label: 'Intolerante à lactose' },
    { value: 'gluten_free', label: 'Sem glúten' },
    { value: 'other_allergies', label: 'Outras alergias' },
  ],
  
  health_conditions: [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hipertensão' },
    { value: 'heart_problems', label: 'Problemas cardíacos' },
    { value: 'knee_injury', label: 'Lesões no joelho' },
    { value: 'shoulder_injury', label: 'Lesões no ombro' },
    { value: 'pregnant', label: 'Gestante' },
    { value: 'other', label: 'Outros' },
    { value: 'none', label: 'Nenhuma' },
  ],
  
  meals_per_day: [
    { value: '2', label: '2 refeições' },
    { value: '3', label: '3 refeições' },
    { value: '4', label: '4 refeições' },
    { value: '5+', label: '5 ou mais refeições' },
  ],
  
  training_preferences: [
    { value: 'strength', label: 'Treino de força' },
    { value: 'hiit', label: 'HIIT (alta intensidade)' },
    { value: 'cardio_light', label: 'Cardio leve' },
    { value: 'flexibility', label: 'Flexibilidade / Alongamento' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'core', label: 'Core / Abdômen' },
    { value: 'rehabilitation', label: 'Reabilitação' },
  ],
  
  available_equipment: [
    { value: 'none', label: 'Nenhum (peso corporal)' },
    { value: 'dumbbells', label: 'Halteres' },
    { value: 'barbell', label: 'Barra' },
    { value: 'kettlebell', label: 'Kettlebell' },
    { value: 'resistance_bands', label: 'Faixas elásticas' },
    { value: 'pull_up_bar', label: 'Barra fixa' },
    { value: 'bench', label: 'Banco' },
    { value: 'step', label: 'Step' },
    { value: 'bike', label: 'Bicicleta ergométrica' },
    { value: 'treadmill', label: 'Esteira' },
    { value: 'trx', label: 'TRX' },
    { value: 'full_gym', label: 'Academia completa' },
  ],
  
  motivators: [
    { value: 'quick_results', label: 'Quero ver progresso rápido' },
    { value: 'health', label: 'Melhorar minha saúde' },
    { value: 'fit_clothes', label: 'Caber em roupas' },
    { value: 'confidence', label: 'Aumentar autoconfiança' },
    { value: 'energy', label: 'Ter mais energia' },
    { value: 'longevity', label: 'Viver mais e melhor' },
  ],
  
  obstacles: [
    { value: 'time', label: 'Falta de tempo' },
    { value: 'motivation', label: 'Falta de motivação' },
    { value: 'injuries', label: 'Lesões ou dores' },
    { value: 'limited_kitchen', label: 'Cozinha limitada' },
    { value: 'budget', label: 'Orçamento apertado' },
    { value: 'knowledge', label: 'Não sei por onde começar' },
  ],
  
  notification_frequencies: [
    { value: 'daily', label: 'Notificações diárias' },
    { value: 'weekly', label: 'Notificações semanais' },
    { value: 'minimal', label: 'Apenas quando necessário' },
  ],
  
  coaching_tones: [
    { value: 'tough', label: 'Coach duro e direto' },
    { value: 'motivational', label: 'Coach motivador e enérgico' },
    { value: 'technical', label: 'Técnico e objetivo' },
    { value: 'friendly', label: 'Amigável e suave' },
  ],
};

// ============================================
// BENEFITS
// ============================================

export const BENEFITS = [
  {
    icon: 'Sparkles',
    title: 'Personalização Real',
    description: 'Planos adaptados ao seu corpo, objetivos e rotina. IA analisa 16+ pontos de dados para criar seu plano único.',
  },
  {
    icon: 'Clock',
    title: 'Economia de Tempo',
    description: 'Plano completo em menos de 5 minutos. Sem necessidade de nutricionista ou personal trainer.',
  },
  {
    icon: 'Repeat',
    title: 'Flexibilidade Total',
    description: 'Treinos para casa, academia ou ar livre. Substituição de exercícios e refeições ilimitadas.',
  },
  {
    icon: 'TrendingUp',
    title: 'Acompanhamento Automático',
    description: 'Registro de progresso simplificado. Gráficos e relatórios visuais. Ajustes inteligentes baseados em resultados.',
  },
  {
    icon: 'Users',
    title: 'Comunidade e Suporte',
    description: 'Acesso a comunidade de membros. Suporte via chat. Conteúdo educativo semanal.',
  },
];

// ============================================
// SOCIAL PROOF
// ============================================

export const SOCIAL_PROOF = [
  {
    icon: 'Users',
    value: '+10.000',
    label: 'planos criados',
    description: 'Mais de 10 mil pessoas já receberam seus planos personalizados',
  },
  {
    icon: 'Star',
    value: '4.8/5',
    label: 'estrelas',
    description: 'Avaliação média dos nossos usuários ativos',
  },
  {
    icon: 'TrendingUp',
    value: '92%',
    label: 'de satisfação',
    description: 'Taxa de satisfação após 30 dias de uso',
  },
];

// ============================================
// HOW IT WORKS
// ============================================

export const HOW_IT_WORKS = [
  {
    step: 1,
    icon: 'ClipboardList',
    title: 'Conte sobre você',
    description: 'Responda perguntas rápidas sobre seu corpo, objetivos, rotina e preferências. Leva menos de 3 minutos.',
  },
  {
    step: 2,
    icon: 'Sparkles',
    title: 'IA cria seu plano único',
    description: 'Nossa inteligência artificial analisa suas respostas e cria um plano de treino e dieta 100% personalizado para você.',
  },
  {
    step: 3,
    icon: 'LineChart',
    title: 'Acompanhe seu progresso',
    description: 'Registre treinos, refeições e medidas. O plano se ajusta automaticamente conforme você evolui.',
  },
];

// ============================================
// TESTIMONIALS
// ============================================

export const TESTIMONIALS = [
  {
    name: 'Maria Silva',
    age: 32,
    rating: 5,
    text: 'Perdi 8kg em 2 meses seguindo o plano. O melhor é que posso treinar em casa e as receitas são deliciosas!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    name: 'João Santos',
    age: 28,
    rating: 5,
    text: 'Finalmente consegui ganhar massa muscular. O app ajusta os treinos conforme eu evoluo. Sensacional!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Ana Costa',
    age: 35,
    rating: 5,
    text: 'Como mãe, não tenho muito tempo. Os treinos de 20 minutos são perfeitos e estou vendo resultados reais.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

// ============================================
// FAQ
// ============================================

export const FAQ = [
  {
    question: 'Como funciona a personalização?',
    answer: 'Nossa IA analisa mais de 16 pontos de dados sobre você (corpo, objetivos, rotina, preferências, restrições) e cria um plano único. Não é um plano genérico — é feito especificamente para você.',
  },
  {
    question: 'Posso treinar em casa?',
    answer: 'Sim! Você escolhe onde quer treinar: em casa sem equipamentos, em casa com halteres, na academia ou ao ar livre. O plano se adapta ao que você tem disponível.',
  },
  {
    question: 'E se eu tiver restrições alimentares?',
    answer: 'O plano respeita todas as suas restrições: vegetariano, vegano, intolerâncias, alergias. Você também pode substituir qualquer refeição que não gostar.',
  },
  {
    question: 'Preciso de experiência prévia?',
    answer: 'Não! Atendemos desde iniciantes completos até avançados. O plano se ajusta ao seu nível e evolui com você.',
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer: 'Sim, você pode cancelar a qualquer momento. Sem taxas ocultas ou multas. Simples assim.',
  },
  {
    question: 'Como funciona o acompanhamento?',
    answer: 'Você registra seus treinos, refeições e medidas no app. A IA analisa seu progresso e ajusta o plano automaticamente para otimizar seus resultados.',
  },
  {
    question: 'Tem garantia?',
    answer: 'Sim! Oferecemos 7 dias de garantia. Se não gostar, devolvemos 100% do seu dinheiro, sem perguntas.',
  },
  {
    question: 'Funciona no celular?',
    answer: 'Sim! O FitAI funciona perfeitamente em celular, tablet e computador. Você acessa de qualquer lugar.',
  },
];

// ============================================
// BADGES AND STREAKS
// ============================================

export const STREAK_BADGES = [
  { days: 7, name: 'Iniciante Comprometido', icon: '🔥' },
  { days: 14, name: 'Construindo Hábito', icon: '🔥' },
  { days: 30, name: 'Hábito Formado', icon: '🔥' },
  { days: 60, name: 'Transformação Visível', icon: '🔥' },
  { days: 90, name: 'Estilo de Vida', icon: '🔥' },
  { days: 180, name: 'Imparável', icon: '🔥' },
  { days: 365, name: 'Lenda do FitAI', icon: '🔥' },
];

// ============================================
// MISSIONS (FIRST WEEK)
// ============================================

export const FIRST_WEEK_MISSIONS = [
  {
    id: 'complete_profile',
    name: 'Complete seu perfil',
    description: 'Adicione todas as informações do seu perfil',
    tasks: [
      { id: 'add_photo', description: 'Adicione foto de perfil', completed: false },
      { id: 'add_physical_data', description: 'Preencha dados físicos', completed: false },
      { id: 'add_measurements', description: 'Adicione medidas', completed: false },
      { id: 'add_progress_photo', description: 'Tire foto de progresso', completed: false },
    ],
    reward_points: 50,
    reward_badge: 'Perfil Completo',
  },
  {
    id: 'first_workout',
    name: 'Primeiro treino',
    description: 'Complete seu primeiro treino',
    tasks: [
      { id: 'complete_workout', description: 'Complete seu primeiro treino', completed: false },
    ],
    reward_points: 100,
    reward_badge: 'Primeira Conquista',
  },
  {
    id: 'nutrition_on_point',
    name: 'Nutrição no ponto',
    description: 'Registre todas as refeições por 1 dia',
    tasks: [
      { id: 'log_all_meals', description: 'Registre todas as refeições por 1 dia', completed: false },
    ],
    reward_points: 75,
    reward_badge: 'Nutrição Consciente',
  },
  {
    id: 'consistency',
    name: 'Consistência',
    description: 'Treine 3x na primeira semana',
    tasks: [
      { id: 'train_3x', description: 'Treine 3x na primeira semana', completed: false },
    ],
    reward_points: 150,
    reward_badge: 'Consistente',
  },
  {
    id: 'progress_tracked',
    name: 'Progresso registrado',
    description: 'Registre seu peso e medidas',
    tasks: [
      { id: 'log_weight', description: 'Registre seu peso', completed: false },
      { id: 'log_measurements', description: 'Registre suas medidas', completed: false },
    ],
    reward_points: 50,
    reward_badge: 'Acompanhamento',
  },
  {
    id: 'explorer',
    name: 'Explorador',
    description: 'Explore todas as funcionalidades do app',
    tasks: [
      { id: 'explore_sections', description: 'Explore todas as seções do app', completed: false },
      { id: 'substitute_exercise', description: 'Substitua um exercício', completed: false },
      { id: 'substitute_meal', description: 'Substitua uma refeição', completed: false },
    ],
    reward_points: 100,
    reward_badge: 'Explorador',
  },
  {
    id: 'perfect_week',
    name: 'Semana Completa',
    description: 'Complete todas as missões acima',
    tasks: [
      { id: 'complete_all', description: 'Complete todas as missões acima', completed: false },
    ],
    reward_points: 500,
    reward_badge: 'Semana Perfeita',
  },
];

// ============================================
// ACTIVITY FACTORS (for calorie calculation)
// ============================================

export const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

// ============================================
// CALORIE ADJUSTMENTS BY GOAL
// ============================================

export const CALORIE_ADJUSTMENTS = {
  weight_loss: -0.15, // -15% deficit
  muscle_gain: 0.10, // +10% surplus
  toning: -0.10, // -10% deficit
  maintenance: 0, // maintenance
  cardio: 0, // maintenance
  rehabilitation: 0, // maintenance
};

// ============================================
// MACRO RATIOS BY GOAL
// ============================================

export const MACRO_RATIOS = {
  weight_loss: {
    protein: 0.35, // 35%
    carbs: 0.35, // 35%
    fats: 0.30, // 30%
  },
  muscle_gain: {
    protein: 0.30, // 30%
    carbs: 0.45, // 45%
    fats: 0.25, // 25%
  },
  toning: {
    protein: 0.35, // 35%
    carbs: 0.40, // 40%
    fats: 0.25, // 25%
  },
  maintenance: {
    protein: 0.30, // 30%
    carbs: 0.40, // 40%
    fats: 0.30, // 30%
  },
  cardio: {
    protein: 0.25, // 25%
    carbs: 0.50, // 50%
    fats: 0.25, // 25%
  },
  rehabilitation: {
    protein: 0.30, // 30%
    carbs: 0.40, // 40%
    fats: 0.30, // 30%
  },
};

// ============================================
// EXPORT ALL
// ============================================

export {
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
  PRODUCT_DESCRIPTION,
  PLANS,
  QUIZ_OPTIONS,
  BENEFITS,
  SOCIAL_PROOF,
  HOW_IT_WORKS,
  TESTIMONIALS,
  FAQ,
  STREAK_BADGES,
  FIRST_WEEK_MISSIONS,
  ACTIVITY_FACTORS,
  CALORIE_ADJUSTMENTS,
  MACRO_RATIOS,
};
