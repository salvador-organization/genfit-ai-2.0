// 📋 Perguntas do Quiz FitAI

export interface QuizQuestion {
  id: string;
  title: string;
  description?: string;
  type: 'single' | 'multiple';
  options: {
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'goal',
    title: 'Qual é o seu objetivo principal?',
    description: 'Escolha o objetivo que mais se alinha com o que você quer alcançar',
    type: 'single',
    options: [
      {
        value: 'weight_loss',
        label: 'Emagrecer / Perder gordura',
        description: 'Reduzir percentual de gordura corporal',
        icon: '🔥',
      },
      {
        value: 'muscle_gain',
        label: 'Ganhar massa muscular',
        description: 'Aumentar volume e força muscular',
        icon: '💪',
      },
      {
        value: 'toning',
        label: 'Tonificar / Definir',
        description: 'Manter peso e melhorar definição',
        icon: '✨',
      },
      {
        value: 'maintenance',
        label: 'Manutenção de peso',
        description: 'Manter forma física atual',
        icon: '⚖️',
      },
      {
        value: 'cardio',
        label: 'Melhorar condicionamento',
        description: 'Aumentar resistência cardiovascular',
        icon: '❤️',
      },
    ],
  },
  {
    id: 'frequency',
    title: 'Quantas vezes por semana você pode treinar?',
    description: 'Seja realista com sua disponibilidade',
    type: 'single',
    options: [
      {
        value: '2',
        label: '2x por semana',
        description: 'Ideal para iniciantes',
        icon: '📅',
      },
      {
        value: '3',
        label: '3x por semana',
        description: 'Equilíbrio perfeito',
        icon: '📅',
      },
      {
        value: '4-5',
        label: '4-5x por semana',
        description: 'Para resultados acelerados',
        icon: '📅',
      },
      {
        value: '6-7',
        label: '6-7x por semana',
        description: 'Treino intensivo',
        icon: '📅',
      },
    ],
  },
  {
    id: 'location',
    title: 'Onde você vai treinar?',
    description: 'Vamos adaptar os exercícios ao seu ambiente',
    type: 'single',
    options: [
      {
        value: 'home_no_equipment',
        label: 'Em casa (sem equipamentos)',
        description: 'Treinos com peso corporal',
        icon: '🏠',
      },
      {
        value: 'home_with_equipment',
        label: 'Em casa (com halteres/banda)',
        description: 'Equipamentos básicos',
        icon: '🏠',
      },
      {
        value: 'gym',
        label: 'Academia completa',
        description: 'Acesso a todos os equipamentos',
        icon: '🏋️',
      },
      {
        value: 'outdoor',
        label: 'Externo (corrida/bike)',
        description: 'Treinos ao ar livre',
        icon: '🌳',
      },
    ],
  },
  {
    id: 'duration',
    title: 'Quanto tempo você tem por treino?',
    description: 'Vamos otimizar seus treinos para o tempo disponível',
    type: 'single',
    options: [
      {
        value: '15-25',
        label: '15-25 minutos',
        description: 'Treinos rápidos e intensos',
        icon: '⚡',
      },
      {
        value: '25-40',
        label: '25-40 minutos',
        description: 'Duração ideal',
        icon: '⏱️',
      },
      {
        value: '40-60',
        label: '40-60 minutos',
        description: 'Treinos completos',
        icon: '⏱️',
      },
      {
        value: '60+',
        label: 'Mais de 60 minutos',
        description: 'Tempo livre para treinar',
        icon: '⏱️',
      },
    ],
  },
  {
    id: 'experience',
    title: 'Qual é o seu nível de experiência?',
    description: 'Vamos ajustar a intensidade dos treinos',
    type: 'single',
    options: [
      {
        value: 'beginner',
        label: 'Iniciante',
        description: '0-3 meses de treino',
        icon: '🌱',
      },
      {
        value: 'intermediate',
        label: 'Intermediário',
        description: '3-18 meses de treino',
        icon: '🌿',
      },
      {
        value: 'advanced',
        label: 'Avançado',
        description: 'Mais de 18 meses',
        icon: '🌳',
      },
    ],
  },
  {
    id: 'restrictions',
    title: 'Você tem alguma restrição alimentar?',
    description: 'Selecione todas que se aplicam (opcional)',
    type: 'multiple',
    options: [
      {
        value: 'vegetarian',
        label: 'Vegetariano',
        icon: '🥗',
      },
      {
        value: 'vegan',
        label: 'Vegano',
        icon: '🌱',
      },
      {
        value: 'lactose',
        label: 'Intolerância à lactose',
        icon: '🥛',
      },
      {
        value: 'gluten',
        label: 'Intolerância ao glúten',
        icon: '🌾',
      },
      {
        value: 'none',
        label: 'Nenhuma restrição',
        icon: '✅',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Quais tipos de treino você prefere?',
    description: 'Selecione suas preferências (opcional)',
    type: 'multiple',
    options: [
      {
        value: 'strength',
        label: 'Treino de força',
        icon: '💪',
      },
      {
        value: 'hiit',
        label: 'HIIT (alta intensidade)',
        icon: '🔥',
      },
      {
        value: 'cardio',
        label: 'Cardio leve',
        icon: '🏃',
      },
      {
        value: 'flexibility',
        label: 'Flexibilidade',
        icon: '🧘',
      },
      {
        value: 'core',
        label: 'Core/Abdômen',
        icon: '⭐',
      },
    ],
  },
];
