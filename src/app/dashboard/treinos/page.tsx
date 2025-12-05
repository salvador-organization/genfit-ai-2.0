'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  User,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Clock,
  Flame,
  Target,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout } from '@/lib/auth';

export default function TreinosPage() {
  const router = useRouter();
  const { user, workoutPlan } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('monday');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.quizCompleted) {
      router.push('/quiz');
      return;
    }

    // Set current day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    setSelectedDay(today);
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user || !workoutPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const dayNames: Record<string, string> = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const currentWorkout = workoutPlan.weekly_schedule[selectedDay as keyof typeof workoutPlan.weekly_schedule];
  const isRestDay = currentWorkout === 'rest';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">FitAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Início
            </Link>
            <Link href="/dashboard/treinos" className="text-sm font-medium text-orange-600">
              Treinos
            </Link>
            <Link href="/dashboard/dieta" className="text-sm font-medium hover:text-orange-600 transition-colors">
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Treinos</h1>
          <p className="text-lg text-muted-foreground">
            Seu plano de treino personalizado
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Week Schedule */}
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Semana
            </h2>
            <div className="space-y-2">
              {Object.entries(dayNames).map(([day, name]) => {
                const workout = workoutPlan.weekly_schedule[day as keyof typeof workoutPlan.weekly_schedule];
                const isRest = workout === 'rest';
                const isSelected = day === selectedDay;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold ${isSelected ? 'text-white' : ''}`}>{name}</p>
                        <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {isRest ? 'Descanso' : typeof workout === 'object' ? workout.name : ''}
                        </p>
                      </div>
                      {!isRest && (
                        <CheckCircle2 className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-green-600'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button className="w-full mt-6" variant="outline" asChild>
              <Link href="/dashboard/treinos/historico">
                Ver histórico
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {isRestDay ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Dia de Descanso</h2>
                    <p className="text-muted-foreground">
                      Aproveite para recuperar. O descanso é essencial para o crescimento muscular.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3 w-full mt-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Hidratação</p>
                      <p className="text-lg font-semibold">2-3L água</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Sono</p>
                      <p className="text-lg font-semibold">7-9 horas</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Alongamento</p>
                      <p className="text-lg font-semibold">15-20 min</p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : typeof currentWorkout === 'object' ? (
              <>
                {/* Workout Header */}
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{currentWorkout.name}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{currentWorkout.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{currentWorkout.exercises.length} exercícios</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          <span>~{currentWorkout.estimated_calories} kcal</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                      {currentWorkout.difficulty === 'beginner' ? 'Iniciante' : currentWorkout.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </Badge>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700" size="lg">
                    Iniciar treino
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Card>

                {/* Exercises List */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Exercícios</h3>
                  {currentWorkout.exercises.map((exercise, index) => (
                    <Card key={exercise.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 flex-shrink-0">
                          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold">{exercise.name}</h4>
                              <p className="text-sm text-muted-foreground">{exercise.muscle_group}</p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/treinos/${exercise.id}`}>
                                Ver detalhes
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Séries</p>
                              <p className="text-lg font-bold">{exercise.sets}</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Repetições</p>
                              <p className="text-lg font-bold">{exercise.reps}</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Descanso</p>
                              <p className="text-lg font-bold">{exercise.rest_seconds}s</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {exercise.equipment.map((eq) => (
                              <Badge key={eq} variant="secondary" className="text-xs">
                                {eq}
                              </Badge>
                            ))}
                          </div>

                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground mt-3 italic">
                              💡 {exercise.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Ações</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button variant="outline" className="w-full">
                      Trocar treino
                    </Button>
                    <Button variant="outline" className="w-full">
                      Substituir exercício
                    </Button>
                  </div>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
