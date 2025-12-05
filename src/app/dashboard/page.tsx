'use client';

import { useEffect, useState } from 'react';
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
import { getCurrentUser, logout, getQuizAnswers } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (!currentUser.quizCompleted) {
      router.push('/quiz');
      return;
    }

    setUser(currentUser);
    setQuizAnswers(getQuizAnswers());
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Mapear objetivo para texto amigável
  const goalMap: Record<string, string> = {
    weight_loss: 'Emagrecer',
    muscle_gain: 'Ganhar massa',
    toning: 'Tonificar',
    maintenance: 'Manutenção',
    cardio: 'Condicionamento',
  };

  const goal = quizAnswers?.goal ? goalMap[quizAnswers.goal] : 'Seu objetivo';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">FitAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-orange-600">
              Início
            </Link>
            <Link href="/dashboard/treinos" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Treinos
            </Link>
            <Link href="/dashboard/dieta" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Dieta
            </Link>
            <Link href="/dashboard/progresso" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Progresso
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Olá, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Pronto para treinar hoje? Seu plano personalizado está esperando.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sequência</p>
                <p className="text-2xl font-bold">7 dias</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Treinos</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calorias</p>
                <p className="text-2xl font-bold">2.4k</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conquistas</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Treino do Dia */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Treino do Dia</h2>
                  <p className="text-sm text-muted-foreground">Segunda-feira • {goal}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                Disponível
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <h3 className="font-semibold mb-2">Treino A - Peito e Tríceps</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>45 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>8 exercícios</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    <span>~350 kcal</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Exercícios principais:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    Supino reto - 4x12
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    Supino inclinado - 3x12
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    Tríceps testa - 3x15
                  </li>
                  <li className="text-orange-600 dark:text-orange-400">+ 5 exercícios</li>
                </ul>
              </div>

              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700" size="lg">
                Iniciar treino
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Refeições do Dia */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-bold">Refeições do Dia</h2>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Café da Manhã</p>
                    <Badge variant="secondary" className="text-xs">07:00</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Omelete + Aveia • 450 kcal</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Almoço</p>
                    <Badge variant="secondary" className="text-xs">12:00</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Frango + Arroz • 650 kcal</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Jantar</p>
                    <Badge variant="secondary" className="text-xs">19:00</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Salmão + Legumes • 550 kcal</p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Ver plano completo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            {/* Progresso */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-lg font-bold">Progresso Semanal</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Treinos</p>
                    <p className="text-sm font-semibold">3/4</p>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-pink-600" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Dieta</p>
                    <p className="text-sm font-semibold">5/7</p>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600" style={{ width: '71%' }}></div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Meta da semana</p>
                  <p className="text-sm">
                    Continue assim! Você está no caminho certo para atingir seu objetivo de <strong>{goal.toLowerCase()}</strong>.
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Ver relatório completo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="font-semibold">Calendário</p>
                  <p className="text-xs text-muted-foreground">Ver semana</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-semibold">Metas</p>
                  <p className="text-xs text-muted-foreground">Definir objetivos</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold">Medidas</p>
                  <p className="text-xs text-muted-foreground">Registrar progresso</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="font-semibold">Conquistas</p>
                  <p className="text-xs text-muted-foreground">Ver badges</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
