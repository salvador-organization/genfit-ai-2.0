'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  Flame,
  Activity,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, workoutPlan, nutritionPlan } = useApp();

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  // Get today's workout
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()] as keyof typeof workoutPlan.weekly_schedule;
  const todayWorkout = workoutPlan?.weekly_schedule[today];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-sm dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white">
              <Sparkles className="h-6 w-6 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">FitAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Início
            </Link>
            <Link href="/dashboard/treinos" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Treinos
            </Link>
            <Link href="/dashboard/dieta" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
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
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Olá, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Pronto para treinar hoje? Seu plano personalizado está esperando.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6 border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Flame className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sequência</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">7 dias</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Treinos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Activity className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Calorias</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.4k</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Award className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conquistas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">5</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Treino do Dia */}
          <Card className="lg:col-span-2 p-6 border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-white dark:text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Treino do Dia</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
                  </p>
                </div>
              </div>
              <Badge className="bg-gray-100 text-gray-900 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
                {todayWorkout === 'rest' ? 'Descanso' : 'Disponível'}
              </Badge>
            </div>

            {todayWorkout === 'rest' ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-900 dark:text-gray-100" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Dia de Descanso</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Aproveite para recuperar. O descanso é essencial!
                </p>
                <Button variant="outline" asChild className="border-gray-300 dark:border-gray-700">
                  <Link href="/dashboard/treinos">
                    Ver semana completa
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : typeof todayWorkout === 'object' ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{todayWorkout.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{todayWorkout.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{todayWorkout.exercises.length} exercícios</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      <span>~{todayWorkout.estimated_calories} kcal</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Exercícios principais:</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {todayWorkout.exercises.slice(0, 3).map((exercise) => (
                      <li key={exercise.id} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-900 dark:bg-gray-100"></div>
                        {exercise.name} - {exercise.sets}x{exercise.reps}
                      </li>
                    ))}
                    {todayWorkout.exercises.length > 3 && (
                      <li className="text-gray-900 dark:text-gray-100">
                        + {todayWorkout.exercises.length - 3} exercícios
                      </li>
                    )}
                  </ul>
                </div>

                <Button className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black" size="lg" asChild>
                  <Link href="/dashboard/treinos">
                    Iniciar treino
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : null}
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Refeições do Dia */}
            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Refeições do Dia</h2>
              </div>

              <div className="space-y-3">
                {nutritionPlan?.meal_schedule.slice(0, 3).map((meal) => (
                  <div key={meal.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{meal.name}</p>
                      <Badge variant="secondary" className="text-xs bg-gray-200 dark:bg-gray-800">{meal.time}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {meal.recipe.name} • {meal.calories} kcal
                    </p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 border-gray-300 dark:border-gray-700" asChild>
                <Link href="/dashboard/dieta">
                  Ver plano completo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>

            {/* Progresso */}
            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Progresso Semanal</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Treinos</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">3/4</p>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-black dark:bg-white" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dieta</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">5/7</p>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-black dark:bg-white" style={{ width: '71%' }}></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Meta da semana</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Continue assim! Você está no caminho certo para atingir seus objetivos.
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 border-gray-300 dark:border-gray-700" asChild>
                <Link href="/dashboard/progresso">
                  Ver relatório completo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Ações Rápidas</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-gray-200 dark:border-gray-800" asChild>
              <Link href="/dashboard/treinos">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-gray-900 dark:text-gray-100" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Calendário</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Ver semana</p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-gray-200 dark:border-gray-800" asChild>
              <Link href="/dashboard/progresso">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-gray-900 dark:text-gray-100" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Metas</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Ver objetivos</p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-gray-200 dark:border-gray-800" asChild>
              <Link href="/dashboard/progresso">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-gray-900 dark:text-gray-100" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Medidas</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Registrar progresso</p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-gray-200 dark:border-gray-800" asChild>
              <Link href="/dashboard/perfil">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-gray-900 dark:text-gray-100" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Conquistas</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Ver badges</p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
