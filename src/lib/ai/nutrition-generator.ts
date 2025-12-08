/**
 * 🍎 GERADOR DE DIETA PERSONALIZADA
 * Sistema de IA para criar planos alimentares baseados no perfil do usuário
 */

import { QuizData } from '../types/quiz';

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: FoodItem[];
  alternatives?: Meal[];
}

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

export interface DailyMealPlan {
  id: string;
  day: string;
  date: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: Meal[];
  waterIntake: number;
  notes?: string;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  weekNumber: number;
  dailyPlans: DailyMealPlan[];
  goal: string;
  restrictions: string[];
  createdAt: Date;
  shoppingList?: ShoppingItem[];
}

export interface ShoppingItem {
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

/**
 * Calcula necessidades calóricas baseado no perfil
 */
export function calculateMacros(quizData: QuizData): MacroTargets {
  const weight = quizData.weight || 70;
  const height = quizData.height || 170;
  const age = quizData.age || 25;
  const gender = quizData.gender || 'male';
  const goal = quizData.goal || 'maintenance';
  const activityLevel = quizData.activityLevel || 'moderate';

  // Fórmula de Harris-Benedict
  let bmr: number;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Fator de atividade
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  // Ajuste baseado no objetivo
  let targetCalories = tdee;
  if (goal === 'weight_loss' || goal === 'fat_loss') {
    targetCalories = tdee - 500; // Déficit de 500 calorias
  } else if (goal === 'muscle_gain' || goal === 'hypertrophy') {
    targetCalories = tdee + 300; // Superávit de 300 calorias
  }

  // Distribuição de macros
  const protein = weight * 2.2; // 2.2g por kg
  const fats = (targetCalories * 0.25) / 9; // 25% das calorias
  const carbs = (targetCalories - (protein * 4) - (fats * 9)) / 4;

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
  };
}

/**
 * Gera plano alimentar semanal
 */
export function generateNutritionPlan(quizData: QuizData, weekNumber: number = 1): NutritionPlan {
  const macros = calculateMacros(quizData);
  const restrictions = quizData.dietaryRestrictions || [];
  const preferences = quizData.foodPreferences || [];

  const dailyPlans: DailyMealPlan[] = [];
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  days.forEach((day, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    dailyPlans.push(generateDailyMealPlan(day, date, macros, restrictions, preferences));
  });

  const shoppingList = generateShoppingList(dailyPlans);

  return {
    id: `nutrition-${Date.now()}`,
    userId: quizData.userId || 'temp',
    weekNumber,
    dailyPlans,
    goal: quizData.goal || 'maintenance',
    restrictions,
    createdAt: new Date(),
    shoppingList,
  };
}

/**
 * Gera plano alimentar diário
 */
function generateDailyMealPlan(
  day: string,
  date: Date,
  macros: MacroTargets,
  restrictions: string[],
  preferences: string[]
): DailyMealPlan {
  const isVegetarian = restrictions.includes('vegetarian');
  const isVegan = restrictions.includes('vegan');
  const isLactoseIntolerant = restrictions.includes('lactose');

  // Distribui calorias entre refeições
  const calorieDistribution = {
    breakfast: 0.25,
    snack1: 0.10,
    lunch: 0.35,
    snack2: 0.10,
    dinner: 0.20,
  };

  const meals: Meal[] = [
    generateBreakfast(macros, calorieDistribution.breakfast, isVegetarian, isVegan, isLactoseIntolerant),
    generateSnack(macros, calorieDistribution.snack1, 'Lanche da Manhã', '10:00'),
    generateLunch(macros, calorieDistribution.lunch, isVegetarian, isVegan),
    generateSnack(macros, calorieDistribution.snack2, 'Lanche da Tarde', '16:00'),
    generateDinner(macros, calorieDistribution.dinner, isVegetarian, isVegan),
  ];

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return {
    id: `daily-${day.toLowerCase()}`,
    day,
    date,
    totalCalories: totals.calories,
    totalProtein: totals.protein,
    totalCarbs: totals.carbs,
    totalFats: totals.fats,
    meals,
    waterIntake: 2500, // 2.5L
    notes: 'Beba água ao longo do dia',
  };
}

/**
 * Gera café da manhã
 */
function generateBreakfast(
  macros: MacroTargets,
  percentage: number,
  isVegetarian: boolean,
  isVegan: boolean,
  isLactoseIntolerant: boolean
): Meal {
  const targetCalories = macros.calories * percentage;
  const targetProtein = macros.protein * percentage;

  const foods: FoodItem[] = [];

  if (isVegan) {
    foods.push(
      { id: 'f1', name: 'Aveia', quantity: '60g', calories: 230, protein: 8, carbs: 40, fats: 4, alternatives: ['Granola', 'Quinoa'] },
      { id: 'f2', name: 'Leite de Amêndoas', quantity: '200ml', calories: 50, protein: 2, carbs: 8, fats: 2, alternatives: ['Leite de Soja', 'Leite de Coco'] },
      { id: 'f3', name: 'Banana', quantity: '1 unidade', calories: 105, protein: 1, carbs: 27, fats: 0, alternatives: ['Maçã', 'Mamão'] },
      { id: 'f4', name: 'Pasta de Amendoim', quantity: '20g', calories: 120, protein: 5, carbs: 4, fats: 10, alternatives: ['Pasta de Castanha', 'Tahine'] }
    );
  } else if (isVegetarian) {
    foods.push(
      { id: 'f1', name: 'Pão Integral', quantity: '2 fatias', calories: 140, protein: 6, carbs: 26, fats: 2, alternatives: ['Tapioca', 'Panqueca de Aveia'] },
      { id: 'f2', name: 'Ovos Mexidos', quantity: '2 unidades', calories: 140, protein: 12, carbs: 2, fats: 10, alternatives: ['Omelete', 'Ovos Cozidos'] },
      { id: 'f3', name: 'Queijo Branco', quantity: '30g', calories: 70, protein: 8, carbs: 2, fats: 4, alternatives: ['Cottage', 'Ricota'] },
      { id: 'f4', name: 'Suco de Laranja', quantity: '200ml', calories: 90, protein: 1, carbs: 21, fats: 0, alternatives: ['Suco Verde', 'Vitamina'] }
    );
  } else {
    foods.push(
      { id: 'f1', name: 'Pão Integral', quantity: '2 fatias', calories: 140, protein: 6, carbs: 26, fats: 2, alternatives: ['Tapioca', 'Panqueca de Aveia'] },
      { id: 'f2', name: 'Ovos Mexidos', quantity: '3 unidades', calories: 210, protein: 18, carbs: 3, fats: 15, alternatives: ['Omelete', 'Ovos Cozidos'] },
      { id: 'f3', name: 'Peito de Peru', quantity: '50g', calories: 60, protein: 12, carbs: 1, fats: 1, alternatives: ['Frango Desfiado', 'Atum'] },
      { id: 'f4', name: 'Café com Leite', quantity: '200ml', calories: 80, protein: 4, carbs: 10, fats: 3, alternatives: ['Chá', 'Café Preto'] }
    );
  }

  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fats: acc.fats + food.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return {
    id: 'breakfast',
    name: 'Café da Manhã',
    time: '07:00',
    calories: totals.calories,
    protein: totals.protein,
    carbs: totals.carbs,
    fats: totals.fats,
    foods,
  };
}

/**
 * Gera lanche
 */
function generateSnack(macros: MacroTargets, percentage: number, name: string, time: string): Meal {
  const foods: FoodItem[] = [
    { id: 's1', name: 'Whey Protein', quantity: '30g', calories: 120, protein: 24, carbs: 3, fats: 2, alternatives: ['Iogurte Grego', 'Queijo Cottage'] },
    { id: 's2', name: 'Castanhas', quantity: '20g', calories: 130, protein: 3, carbs: 4, fats: 12, alternatives: ['Amêndoas', 'Nozes'] },
  ];

  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fats: acc.fats + food.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return {
    id: name.toLowerCase().replace(/\s/g, '-'),
    name,
    time,
    calories: totals.calories,
    protein: totals.protein,
    carbs: totals.carbs,
    fats: totals.fats,
    foods,
  };
}

/**
 * Gera almoço
 */
function generateLunch(macros: MacroTargets, percentage: number, isVegetarian: boolean, isVegan: boolean): Meal {
  const foods: FoodItem[] = [];

  if (isVegan) {
    foods.push(
      { id: 'l1', name: 'Arroz Integral', quantity: '150g', calories: 180, protein: 4, carbs: 38, fats: 1, alternatives: ['Quinoa', 'Batata Doce'] },
      { id: 'l2', name: 'Feijão', quantity: '100g', calories: 130, protein: 8, carbs: 23, fats: 0, alternatives: ['Lentilha', 'Grão de Bico'] },
      { id: 'l3', name: 'Tofu Grelhado', quantity: '150g', calories: 140, protein: 15, carbs: 4, fats: 8, alternatives: ['Tempeh', 'Seitan'] },
      { id: 'l4', name: 'Salada Verde', quantity: '100g', calories: 30, protein: 2, carbs: 6, fats: 0, alternatives: ['Legumes Cozidos', 'Salada de Grãos'] },
      { id: 'l5', name: 'Azeite', quantity: '10ml', calories: 90, protein: 0, carbs: 0, fats: 10, alternatives: ['Óleo de Coco', 'Tahine'] }
    );
  } else if (isVegetarian) {
    foods.push(
      { id: 'l1', name: 'Arroz Integral', quantity: '150g', calories: 180, protein: 4, carbs: 38, fats: 1, alternatives: ['Arroz Branco', 'Macarrão Integral'] },
      { id: 'l2', name: 'Feijão', quantity: '100g', calories: 130, protein: 8, carbs: 23, fats: 0, alternatives: ['Lentilha', 'Grão de Bico'] },
      { id: 'l3', name: 'Ovos Cozidos', quantity: '2 unidades', calories: 140, protein: 12, carbs: 2, fats: 10, alternatives: ['Queijo', 'Tofu'] },
      { id: 'l4', name: 'Brócolis', quantity: '100g', calories: 35, protein: 3, carbs: 7, fats: 0, alternatives: ['Couve-flor', 'Espinafre'] },
      { id: 'l5', name: 'Salada', quantity: '100g', calories: 30, protein: 2, carbs: 6, fats: 0, alternatives: ['Legumes', 'Verduras'] }
    );
  } else {
    foods.push(
      { id: 'l1', name: 'Arroz Integral', quantity: '150g', calories: 180, protein: 4, carbs: 38, fats: 1, alternatives: ['Arroz Branco', 'Batata Doce'] },
      { id: 'l2', name: 'Feijão', quantity: '100g', calories: 130, protein: 8, carbs: 23, fats: 0, alternatives: ['Lentilha', 'Grão de Bico'] },
      { id: 'l3', name: 'Frango Grelhado', quantity: '150g', calories: 240, protein: 36, carbs: 0, fats: 10, alternatives: ['Peixe', 'Carne Vermelha Magra'] },
      { id: 'l4', name: 'Brócolis', quantity: '100g', calories: 35, protein: 3, carbs: 7, fats: 0, alternatives: ['Couve-flor', 'Espinafre'] },
      { id: 'l5', name: 'Salada', quantity: '100g', calories: 30, protein: 2, carbs: 6, fats: 0, alternatives: ['Legumes', 'Verduras'] }
    );
  }

  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fats: acc.fats + food.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return {
    id: 'lunch',
    name: 'Almoço',
    time: '12:30',
    calories: totals.calories,
    protein: totals.protein,
    carbs: totals.carbs,
    fats: totals.fats,
    foods,
  };
}

/**
 * Gera jantar
 */
function generateDinner(macros: MacroTargets, percentage: number, isVegetarian: boolean, isVegan: boolean): Meal {
  const foods: FoodItem[] = [];

  if (isVegan) {
    foods.push(
      { id: 'd1', name: 'Batata Doce', quantity: '200g', calories: 180, protein: 4, carbs: 41, fats: 0, alternatives: ['Mandioca', 'Inhame'] },
      { id: 'd2', name: 'Grão de Bico', quantity: '100g', calories: 160, protein: 9, carbs: 27, fats: 3, alternatives: ['Lentilha', 'Feijão'] },
      { id: 'd3', name: 'Legumes Assados', quantity: '150g', calories: 80, protein: 3, carbs: 15, fats: 1, alternatives: ['Salada', 'Verduras'] }
    );
  } else if (isVegetarian) {
    foods.push(
      { id: 'd1', name: 'Batata Doce', quantity: '200g', calories: 180, protein: 4, carbs: 41, fats: 0, alternatives: ['Mandioca', 'Arroz'] },
      { id: 'd2', name: 'Omelete', quantity: '3 ovos', calories: 210, protein: 18, carbs: 3, fats: 15, alternatives: ['Ovos Cozidos', 'Queijo'] },
      { id: 'd3', name: 'Salada Verde', quantity: '100g', calories: 30, protein: 2, carbs: 6, fats: 0, alternatives: ['Legumes', 'Verduras'] }
    );
  } else {
    foods.push(
      { id: 'd1', name: 'Batata Doce', quantity: '150g', calories: 135, protein: 3, carbs: 31, fats: 0, alternatives: ['Mandioca', 'Arroz'] },
      { id: 'd2', name: 'Salmão Grelhado', quantity: '150g', calories: 280, protein: 30, carbs: 0, fats: 18, alternatives: ['Tilápia', 'Frango'] },
      { id: 'd3', name: 'Aspargos', quantity: '100g', calories: 20, protein: 2, carbs: 4, fats: 0, alternatives: ['Brócolis', 'Vagem'] }
    );
  }

  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fats: acc.fats + food.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return {
    id: 'dinner',
    name: 'Jantar',
    time: '19:00',
    calories: totals.calories,
    protein: totals.protein,
    carbs: totals.carbs,
    fats: totals.fats,
    foods,
  };
}

/**
 * Gera lista de compras baseada no plano semanal
 */
function generateShoppingList(dailyPlans: DailyMealPlan[]): ShoppingItem[] {
  const items = new Map<string, { quantity: number; category: string }>();

  dailyPlans.forEach(plan => {
    plan.meals.forEach(meal => {
      meal.foods.forEach(food => {
        const existing = items.get(food.name);
        if (existing) {
          existing.quantity += 1;
        } else {
          items.set(food.name, {
            quantity: 1,
            category: categorizeFood(food.name),
          });
        }
      });
    });
  });

  return Array.from(items.entries()).map(([name, data]) => ({
    name,
    quantity: `${data.quantity}x porções`,
    category: data.category,
    checked: false,
  }));
}

/**
 * Categoriza alimento
 */
function categorizeFood(foodName: string): string {
  const categories: Record<string, string[]> = {
    'Proteínas': ['Frango', 'Peixe', 'Carne', 'Ovos', 'Whey', 'Tofu', 'Tempeh'],
    'Carboidratos': ['Arroz', 'Batata', 'Pão', 'Aveia', 'Macarrão', 'Quinoa'],
    'Vegetais': ['Brócolis', 'Salada', 'Legumes', 'Aspargos', 'Couve'],
    'Frutas': ['Banana', 'Maçã', 'Laranja', 'Mamão'],
    'Laticínios': ['Leite', 'Queijo', 'Iogurte', 'Cottage'],
    'Gorduras': ['Azeite', 'Castanhas', 'Amendoim', 'Abacate'],
    'Outros': ['Feijão', 'Lentilha', 'Grão de Bico'],
  };

  for (const [category, foods] of Object.entries(categories)) {
    if (foods.some(f => foodName.includes(f))) {
      return category;
    }
  }

  return 'Outros';
}

/**
 * Ajusta plano nutricional baseado em feedback
 */
export function adjustNutritionPlan(
  currentPlan: NutritionPlan,
  feedback: {
    tooMuchFood?: boolean;
    stillHungry?: boolean;
    dislikedMeals?: string[];
  }
): NutritionPlan {
  const adjustedPlan = { ...currentPlan };

  if (feedback.tooMuchFood) {
    // Reduz porções em 10%
    adjustedPlan.dailyPlans = adjustedPlan.dailyPlans.map(day => ({
      ...day,
      meals: day.meals.map(meal => ({
        ...meal,
        calories: Math.round(meal.calories * 0.9),
        foods: meal.foods.map(food => ({
          ...food,
          calories: Math.round(food.calories * 0.9),
        })),
      })),
    }));
  }

  if (feedback.stillHungry) {
    // Aumenta porções em 10%
    adjustedPlan.dailyPlans = adjustedPlan.dailyPlans.map(day => ({
      ...day,
      meals: day.meals.map(meal => ({
        ...meal,
        calories: Math.round(meal.calories * 1.1),
        foods: meal.foods.map(food => ({
          ...food,
          calories: Math.round(food.calories * 1.1),
        })),
      })),
    }));
  }

  return adjustedPlan;
}
