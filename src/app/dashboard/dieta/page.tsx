'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dumbbell,
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const totalConsumed = nutritionPlan.meal_schedule.reduce((sum, meal) => sum + meal.calories, 0);
  const caloriesProgress = (totalConsumed / nutritionPlan.daily_targets.calories) * 100;

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

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Início
            </Link>
            <Link href="/dashboard/treinos" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Treinos
            </Link>
            <Link href="/dashboard/dieta" className="text-sm font-medium text-orange-600">
              Dieta
            </Link>
            <Link href="/dashboard/progresso" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Progresso
            </Link>
            <Link href="/dashboard/perfil" className="text-sm font-medium hover:text-orange-600 transition-colors">
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Dieta</h1>
          <p className="text-lg text-muted-foreground">
            Seu plano alimentar personalizado
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Daily Targets */}
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Metas Diárias</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Calorias</span>
                  <span className="text-sm font-semibold">
                    {totalConsumed} / {nutritionPlan.daily_targets.calories} kcal
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                    style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Proteína</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {nutritionPlan.daily_targets.protein}g
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Carbos</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {nutritionPlan.daily_targets.carbs}g
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Gordura</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
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
              <h2 className="text-2xl font-bold">Refeições do Dia</h2>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                {nutritionPlan.meals_per_day} refeições
              </Badge>
            </div>

            {nutritionPlan.meal_schedule.map((meal) => (
              <Card key={meal.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{meal.name}</h3>
                      <Badge variant="secondary">{meal.time}</Badge>
                    </div>
                    <p className="text-muted-foreground">{meal.recipe.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Calorias</p>
                    <p className="text-lg font-bold">{meal.calories}</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Proteína</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{meal.macros.protein}g</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Carbos</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{meal.macros.carbs}g</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Gordura</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{meal.macros.fats}g</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{meal.recipe.prep_time} min</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {meal.recipe.difficulty === 'easy' ? 'Fácil' : meal.recipe.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </Badge>
                  {meal.recipe.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" asChild>
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
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-600" />
                Dica do Dia
              </h3>
              <p className="text-sm text-muted-foreground">
                Beba pelo menos 2 litros de água ao longo do dia. A hidratação adequada é essencial para o metabolismo e recuperação muscular.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
