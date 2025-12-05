'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UtensilsCrossed,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  Clock,
  ChefHat,
  RefreshCw,
  CheckCircle2,
  ShoppingCart,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout } from '@/lib/auth';
import type { Meal } from '@/lib/types/fitai';

export default function MealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, nutritionPlan } = useApp();
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.quizCompleted) {
      router.push('/quiz');
      return;
    }

    // Find meal in nutrition plan
    if (nutritionPlan && params.id) {
      const found = nutritionPlan.meal_schedule.find((m) => m.id === params.id);
      setMeal(found || null);
    }
  }, [user, nutritionPlan, params.id, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user || !meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">FitAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/configuracoes">
                <SettingsIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/dashboard/dieta">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para dieta
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Meal Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-2" variant="secondary">{meal.time}</Badge>
                <h1 className="text-3xl font-bold mb-2">{meal.name}</h1>
                <h2 className="text-xl text-muted-foreground mb-4">{meal.recipe.name}</h2>
                <p className="text-muted-foreground">{meal.recipe.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Calorias</p>
                <p className="text-2xl font-bold">{meal.calories}</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Proteína</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{meal.macros.protein}g</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Carbos</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{meal.macros.carbs}g</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Gordura</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{meal.macros.fats}g</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{meal.recipe.prep_time} minutos</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                <span>
                  {meal.recipe.difficulty === 'easy' ? 'Fácil' : 
                   meal.recipe.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                </span>
              </div>
              <div className="flex gap-2">
                {meal.recipe.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Ingredients */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Ingredientes
            </h2>
            <div className="space-y-2">
              {meal.recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <span className="font-medium">{ingredient.name}</span>
                  <span className="text-muted-foreground">
                    {ingredient.quantity} {ingredient.unit}
                    {ingredient.notes && ` (${ingredient.notes})`}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-orange-600" />
              Modo de Preparo
            </h2>
            <ol className="space-y-4">
              {meal.recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{index + 1}</span>
                  </div>
                  <p className="pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </Card>

          {/* Nutrition Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Informação Nutricional Completa</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Calorias</p>
                <p className="text-xl font-bold">{meal.recipe.nutrition.calories} kcal</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Proteína</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {meal.recipe.nutrition.protein}g
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Carboidratos</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {meal.recipe.nutrition.carbs}g
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Gorduras</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {meal.recipe.nutrition.fats}g
                </p>
              </div>
              {meal.recipe.nutrition.fiber && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Fibras</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {meal.recipe.nutrition.fiber}g
                  </p>
                </div>
              )}
              {meal.recipe.nutrition.sodium && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Sódio</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    {meal.recipe.nutrition.sodium}mg
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Alternatives */}
          {meal.alternatives.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                Refeições Alternativas
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Não gostou desta refeição? Você pode substituí-la por:
              </p>
              <div className="space-y-2">
                {meal.alternatives.map((altId) => (
                  <div key={altId} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex items-center justify-between">
                    <span className="font-medium">Refeição alternativa #{altId}</span>
                    <Button variant="outline" size="sm">
                      Ver receita
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Marcar como consumida
            </Button>
            <Button variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-5 w-5" />
              Trocar refeição
            </Button>
          </div>

          {/* Tips */}
          <Card className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-orange-200 dark:border-orange-800">
            <h3 className="font-bold mb-2">💡 Dica de Preparo</h3>
            <p className="text-sm text-muted-foreground">
              Você pode preparar esta refeição com antecedência e armazenar na geladeira por até 3 dias. 
              Isso facilita sua rotina e garante que você mantenha sua dieta em dia!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
