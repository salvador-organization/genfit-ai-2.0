// 📋 Perguntas do Quiz FitAI - 16 Perguntas Completas

export interface QuizQuestion {
  id: string;
  title: string;
  description?: string;
  type: 'single' | 'multiple' | 'input' | 'number';
  options?: {
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
  placeholder?: string;
  unit?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. Objetivo Principal
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

  // 2. Dados Físicos - Peso
  {
    id: 'weight',
    title: 'Qual é o seu peso atual?',
    description: 'Informe seu peso em quilogramas',
    type: 'number',
    placeholder: 'Ex: 75',
    unit: 'kg',
  },

  // 3. Dados Físicos - Altura
  {
    id: 'height',
    title: 'Qual é a sua altura?',
    description: 'Informe sua altura em centímetros',
    type: 'number',
    placeholder: 'Ex: 175',
    unit: 'cm',
  },

  // 4. Dados Físicos - Idade
  {
    id: 'age',
    title: 'Qual é a sua idade?',
    description: 'Vamos ajustar o plano para sua faixa etária',
    type: 'number',
    placeholder: 'Ex: 28',
    unit: 'anos',
  },

  // 5. Dados Físicos - Sexo
  {
    id: 'gender',
    title: 'Qual é o seu sexo biológico?',
    description: 'Isso ajuda a calcular suas necessidades calóricas',
    type: 'single',
    options: [
      {
        value: 'male',
        label: 'Masculino',
        icon: '👨',
      },
      {
        value: 'female',
        label: 'Feminino',
        icon: '👩',
      },
    ],
  },

  // 6. Frequência de Treino
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

  // 7. Local de Treino
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

  // 8. Duração do Treino
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

  // 9. Nível de Experiência
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

  // 10. Nível de Atividade Diária
  {
    id: 'activity_level',
    title: 'Qual é o seu nível de atividade no dia a dia?',
    description: 'Fora dos treinos, como é sua rotina?',
    type: 'single',
    options: [
      {
        value: 'sedentary',
        label: 'Sedentário',
        description: 'Trabalho sentado, pouca movimentação',
        icon: '🪑',
      },
      {
        value: 'light',
        label: 'Levemente ativo',
        description: 'Caminho um pouco durante o dia',
        icon: '🚶',
      },
      {
        value: 'moderate',
        label: 'Moderadamente ativo',
        description: 'Trabalho em pé, movimento constante',
        icon: '🏃',
      },
      {
        value: 'very_active',
        label: 'Muito ativo',
        description: 'Trabalho físico intenso',
        icon: '💪',
      },
    ],
  },

  // 11. Restrições Alimentares
  {
    id: 'restrictions',
    title: 'Você tem alguma restrição alimentar?',
    description: 'Selecione todas que se aplicam',
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

  // 12. Preferências de Treino
  {
    id: 'preferences',
    title: 'Quais tipos de treino você prefere?',
    description: 'Selecione suas preferências',
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

  // 13. Horário Preferido
  {
    id: 'preferred_time',
    title: 'Qual horário você prefere treinar?',
    description: 'Vamos otimizar seu plano para o melhor momento',
    type: 'single',
    options: [
      {
        value: 'morning',
        label: 'Manhã (6h - 10h)',
        description: 'Começar o dia com energia',
        icon: '🌅',
      },
      {
        value: 'afternoon',
        label: 'Tarde (12h - 17h)',
        description: 'Meio do dia',
        icon: '☀️',
      },
      {
        value: 'evening',
        label: 'Noite (18h - 22h)',
        description: 'Após o trabalho',
        icon: '🌙',
      },
      {
        value: 'flexible',
        label: 'Flexível',
        description: 'Varia conforme o dia',
        icon: '🔄',
      },
    ],
  },

  // 14. Lesões ou Limitações
  {
    id: 'injuries',
    title: 'Você tem alguma lesão ou limitação física?',
    description: 'Vamos adaptar os exercícios para sua segurança',
    type: 'multiple',
    options: [
      {
        value: 'knee',
        label: 'Joelho',
        icon: '🦵',
      },
      {
        value: 'back',
        label: 'Coluna/Costas',
        icon: '🔙',
      },
      {
        value: 'shoulder',
        label: 'Ombro',
        icon: '💪',
      },
      {
        value: 'wrist',
        label: 'Pulso',
        icon: '✋',
      },
      {
        value: 'none',
        label: 'Nenhuma limitação',
        icon: '✅',
      },
    ],
  },

  // 15. Motivação Principal
  {
    id: 'motivation',
    title: 'O que mais te motiva a treinar?',
    description: 'Vamos personalizar sua experiência',
    type: 'single',
    options: [
      {
        value: 'health',
        label: 'Saúde e bem-estar',
        description: 'Viver melhor e mais saudável',
        icon: '❤️',
      },
      {
        value: 'aesthetics',
        label: 'Estética corporal',
        description: 'Melhorar aparência física',
        icon: '✨',
      },
      {
        value: 'performance',
        label: 'Performance esportiva',
        description: 'Melhorar desempenho',
        icon: '🏆',
      },
      {
        value: 'energy',
        label: 'Mais energia no dia a dia',
        description: 'Disposição e vitalidade',
        icon: '⚡',
      },
    ],
  },

  // 16. Email para Contato
  {
    id: 'email',
    title: 'Qual é o seu melhor email?',
    description: 'Vamos enviar seu plano personalizado e acompanhar sua evolução',
    type: 'input',
    placeholder: 'seu@email.com',
  },
];
