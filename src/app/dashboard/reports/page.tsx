'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calendar,
  Dumbbell,
  UtensilsCrossed,
  Activity,
  Target,
  ChevronLeft,
  Download,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getWeeklyStats } from '@/lib/supabase/queries';

export default function ReportsPage() {
  const router = useRouter();
  const { user, progress } = useApp();
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadStats();
  }, [user, router]);

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const stats = await getWeeklyStats(user.id);
      setWeeklyStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  // Calculate weight change
  const latestProgress = progress[0];
  const previousProgress = progress[1];
  const weightChange = latestProgress && previousProgress 
    ? (latestProgress.weight || 0) - (previousProgress.weight || 0)
    : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-sm dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white">
                <TrendingUp className="h-6 w-6 text-white dark:text-black" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Relatórios</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Period Selector */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Seu Progresso</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Acompanhe sua evolução semanal e mensal
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-700">
              Semanal
            </Button>
            <Button variant="ghost" size="sm">
              Mensal
            </Button>
            <Button variant="ghost" size="sm">
              Anual
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                </div>
                <Badge className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                  Semana
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {weeklyStats?.workouts_completed || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Treinos completos
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-gray-900 dark:text-gray-100" />
                <span className="text-gray-600 dark:text-gray-400">
                  {weeklyStats?.workouts_completed || 0}/{weeklyStats?.workouts_planned || 0} planejados
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                </div>
                <Badge className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                  Semana
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {weeklyStats?.total_calories_burned || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calorias queimadas
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-gray-900 dark:text-gray-100" />
                <span className="text-gray-600 dark:text-gray-400">
                  Média: {Math.round((weeklyStats?.total_calories_burned || 0) / (weeklyStats?.workouts_completed || 1))} por treino
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                </div>
                <Badge className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                  Semana
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {weeklyStats?.meals_logged || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Refeições registradas
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-gray-900 dark:text-gray-100" />
                <span className="text-gray-600 dark:text-gray-400">
                  Média: {Math.round(weeklyStats?.average_calories || 0)} kcal
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <Target className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                </div>
                <Badge className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                  Semana
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mudança de peso
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {weightChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-gray-900 dark:text-gray-100" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-gray-900 dark:text-gray-100" />
                )}
                <span className="text-gray-600 dark:text-gray-400">
                  Peso atual: {latestProgress?.weight || 0} kg
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Weight Progress Chart */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Evolução de Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Gráfico de evolução de peso</p>
                  <p className="text-sm mt-1">Registre seu peso regularmente para ver o progresso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workout Consistency Chart */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Consistência de Treinos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
                <div className="text-center">
                  <Dumbbell className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Gráfico de consistência</p>
                  <p className="text-sm mt-1">Complete treinos para ver sua consistência</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Progress Entries */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Registros Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {progress.length > 0 ? (
              <div className="space-y-4">
                {progress.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Peso: {entry.weight} kg
                      </p>
                    </div>
                    {entry.measurements && (
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        <p>Cintura: {entry.measurements.waist} cm</p>
                        <p>Peito: {entry.measurements.chest} cm</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <Target className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Nenhum registro ainda</p>
                <p className="text-sm mt-1">Comece a registrar seu progresso</p>
                <Button className="mt-4 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black" asChild>
                  <Link href="/dashboard/progresso">
                    Adicionar registro
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
