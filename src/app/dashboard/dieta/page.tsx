'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UtensilsCrossed,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Clock,
  Flame,
  ShoppingCart,
  Plus,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout } from '@/lib/auth';

export default function DietaPage() {
  const router = useRouter();
  const { user, nutritionPlan } = useApp();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.quizCompleted) {
      router.push('/quiz');
      return;
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user || !nutritionPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  const totalConsumed = nutritionPlan.meal_schedule.reduce((sum, meal) => sum + meal.calories, 0);
  const caloriesProgress = (totalConsumed / nutritionPlan.daily_targets.calories) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-sm dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white">
              <UtensilsCrossed className="h-6 w-6 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">FitAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Início
            </Link>
            <Link href="/dashboard/treinos" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Treinos
            </Link>
            <Link href="/dashboard/dieta" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Dieta
            </Link>
            <Link href="/dashboard/progresso" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Progresso
            </Link>
            <Link href="/dashboard/perfil" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Perfil
            </Link>
          </nav>

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

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-gray-100">Dieta</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Seu plano alimentar personalizado
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Daily Targets */}
          <Card className="p-6 h-fit border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Metas Diárias</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Calorias</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {totalConsumed} / {nutritionPlan.daily_targets.calories} kcal
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black dark:bg-white"
                    style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Proteína</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {nutritionPlan.daily_targets.protein}g
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Carbos</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {nutritionPlan.daily_targets.carbs}g
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Gordura</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {nutritionPlan.daily_targets.fats}g
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/dieta/lista-compras">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Lista de compras
                </Link>
              </Button>
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar alimento
              </Button>
            </div>
          </Card>

          {/* Main Content - Meals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Refeições do Dia</h2>
              <Badge className="bg-gray-100 text-gray-900 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
                {nutritionPlan.meals_per_day} refeições
              </Badge>
            </div>

            {nutritionPlan.meal_schedule.map((meal) => (
              <Card key={meal.id} className="p-6 hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{meal.name}</h3>
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-800">{meal.time}</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{meal.recipe.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Calorias</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{meal.calories}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Proteína</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{meal.macros.protein}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Carbos</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{meal.macros.carbs}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Gordura</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{meal.macros.fats}g</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{meal.recipe.prep_time} min</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-200 dark:bg-gray-800">
                    {meal.recipe.difficulty === 'easy' ? 'Fácil' : meal.recipe.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </Badge>
                  {meal.recipe.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black" asChild>
                    <Link href={`/dashboard/dieta/${meal.id}`}>
                      Ver receita completa
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline">
                    Trocar refeição
                  </Button>
                </div>
              </Card>
            ))}

            {/* Tips */}
            <Card className="p-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Flame className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                Dica do Dia
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Beba pelo menos 2 litros de água ao longo do dia. A hidratação adequada é essencial para o metabolismo e recuperação muscular.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
