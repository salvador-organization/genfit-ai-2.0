'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dumbbell,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  Play,
  Info,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout } from '@/lib/auth';
import type { Exercise } from '@/lib/types/fitai';

export default function ExerciseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, workoutPlan } = useApp();
  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.quizCompleted) {
      router.push('/quiz');
      return;
    }

    // Find exercise in workout plan
    if (workoutPlan && params.id) {
      const allExercises: Exercise[] = [];
      Object.values(workoutPlan.weekly_schedule).forEach((workout) => {
        if (workout !== 'rest' && typeof workout === 'object') {
          allExercises.push(...workout.exercises);
        }
      });
      const found = allExercises.find((ex) => ex.id === params.id);
      setExercise(found || null);
    }
  }, [user, workoutPlan, params.id, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user || !exercise) {
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
              <Dumbbell className="h-6 w-6 text-white" />
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
          <Link href="/dashboard/treinos">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para treinos
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Exercise Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{exercise.name}</h1>
                <p className="text-lg text-muted-foreground">{exercise.muscle_group}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {exercise.equipment.join(', ')}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Séries</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{exercise.sets}</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Repetições</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{exercise.reps}</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Descanso</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{exercise.rest_seconds}s</p>
              </div>
            </div>
          </Card>

          {/* Video */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Play className="h-5 w-5 text-orange-600" />
              Vídeo Demonstrativo
            </h2>
            <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Vídeo será carregado aqui</p>
                <p className="text-sm text-muted-foreground mt-2">{exercise.video_url}</p>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Como Executar
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Posição Inicial:</h3>
                <p className="text-muted-foreground">
                  Posicione-se corretamente com os pés na largura dos ombros. Mantenha a coluna neutra e o core ativado.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Execução:</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Inspire profundamente antes de iniciar o movimento</li>
                  <li>Execute o movimento de forma controlada</li>
                  <li>Expire durante a fase concêntrica (esforço)</li>
                  <li>Retorne à posição inicial de forma controlada</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dicas Importantes:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Mantenha o controle do movimento em todas as fases</li>
                  <li>Não use impulso ou balanço</li>
                  <li>Foque na contração muscular</li>
                  <li>Ajuste o peso se necessário para manter a forma correta</li>
                </ul>
              </div>
            </div>

            {exercise.notes && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-sm">
                  <strong>💡 Nota:</strong> {exercise.notes}
                </p>
              </div>
            )}
          </Card>

          {/* Alternatives */}
          {exercise.alternatives.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-600" />
                Exercícios Alternativos
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Caso não consiga executar este exercício, você pode substituí-lo por:
              </p>
              <div className="space-y-2">
                {exercise.alternatives.map((altId) => (
                  <div key={altId} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex items-center justify-between">
                    <span className="font-medium">Exercício alternativo #{altId}</span>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Marcar como concluído
            </Button>
            <Button variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-5 w-5" />
              Substituir exercício
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
