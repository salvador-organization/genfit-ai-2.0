'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dumbbell,
  Settings as SettingsIcon,
  LogOut,
  TrendingUp,
  TrendingDown,
  Calendar,
  Scale,
  Ruler,
  Activity,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout } from '@/lib/auth';

export default function ProgressoPage() {
  const router = useRouter();
  const { user, progress, updateProgress } = useApp();
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [showMeasurementsForm, setShowMeasurementsForm] = useState(false);
  const [measurements, setMeasurements] = useState({
    waist: '',
    hip: '',
    chest: '',
    thigh: '',
    arm: '',
  });

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

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight && user) {
      updateProgress({
        id: `progress-${Date.now()}`,
        user_id: user.id,
        date: new Date(),
        weight: parseFloat(newWeight),
      });
      setNewWeight('');
      setShowWeightForm(false);
    }
  };

  const handleMeasurementsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateProgress({
        id: `progress-${Date.now()}`,
        user_id: user.id,
        date: new Date(),
        measurements: {
          waist: measurements.waist ? parseFloat(measurements.waist) : undefined,
          hip: measurements.hip ? parseFloat(measurements.hip) : undefined,
          chest: measurements.chest ? parseFloat(measurements.chest) : undefined,
          thigh: measurements.thigh ? parseFloat(measurements.thigh) : undefined,
          arm: measurements.arm ? parseFloat(measurements.arm) : undefined,
        },
      });
      setMeasurements({ waist: '', hip: '', chest: '', thigh: '', arm: '' });
      setShowMeasurementsForm(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  const latestProgress = progress[progress.length - 1];
  const previousProgress = progress[progress.length - 2];
  const weightChange = latestProgress && previousProgress 
    ? (latestProgress.weight || 0) - (previousProgress.weight || 0)
    : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-sm dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white">
              <TrendingUp className="h-6 w-6 text-white dark:text-black" />
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
            <Link href="/dashboard/dieta" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Dieta
            </Link>
            <Link href="/dashboard/progresso" className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-gray-100">Progresso</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Acompanhe sua evolução
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weight Chart */}
            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Scale className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                  Peso
                </h2>
                <Button onClick={() => setShowWeightForm(!showWeightForm)} className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                  Registrar peso
                </Button>
              </div>

              {showWeightForm && (
                <form onSubmit={handleWeightSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Label htmlFor="weight">Peso atual (kg)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      placeholder="Ex: 75.5"
                      required
                    />
                    <Button type="submit" className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">Salvar</Button>
                  </div>
                </form>
              )}

              {latestProgress?.weight ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Peso Atual</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {latestProgress.weight} kg
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Variação</p>
                      <p className={`text-2xl font-bold flex items-center gap-1 text-gray-900 dark:text-gray-100`}>
                        {weightChange > 0 ? <TrendingUp className="h-5 w-5" /> : weightChange < 0 ? <TrendingDown className="h-5 w-5" /> : null}
                        {Math.abs(weightChange).toFixed(1)} kg
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registros</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{progress.length}</p>
                    </div>
                  </div>

                  {/* Simple Chart Visualization */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-end justify-between h-40 gap-2">
                      {progress.slice(-7).map((p, index) => {
                        const maxWeight = Math.max(...progress.map(pr => pr.weight || 0));
                        const height = ((p.weight || 0) / maxWeight) * 100;
                        return (
                          <div key={p.id} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className="w-full bg-gray-900 dark:bg-gray-100 rounded-t-lg transition-all hover:opacity-80"
                              style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(p.date).getDate()}/{new Date(p.date).getMonth() + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Scale className="h-12 w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Nenhum registro de peso ainda</p>
                  <Button className="mt-4 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black" onClick={() => setShowWeightForm(true)}>
                    Registrar primeiro peso
                  </Button>
                </div>
              )}
            </Card>

            {/* Measurements */}
            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Ruler className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                  Medidas Corporais
                </h2>
                <Button onClick={() => setShowMeasurementsForm(!showMeasurementsForm)} className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                  Registrar medidas
                </Button>
              </div>

              {showMeasurementsForm && (
                <form onSubmit={handleMeasurementsSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="waist">Cintura (cm)</Label>
                      <Input
                        id="waist"
                        type="number"
                        step="0.1"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                        placeholder="Ex: 85"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hip">Quadril (cm)</Label>
                      <Input
                        id="hip"
                        type="number"
                        step="0.1"
                        value={measurements.hip}
                        onChange={(e) => setMeasurements({ ...measurements, hip: e.target.value })}
                        placeholder="Ex: 98"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chest">Peito (cm)</Label>
                      <Input
                        id="chest"
                        type="number"
                        step="0.1"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                        placeholder="Ex: 100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="thigh">Coxa (cm)</Label>
                      <Input
                        id="thigh"
                        type="number"
                        step="0.1"
                        value={measurements.thigh}
                        onChange={(e) => setMeasurements({ ...measurements, thigh: e.target.value })}
                        placeholder="Ex: 58"
                      />
                    </div>
                    <div>
                      <Label htmlFor="arm">Braço (cm)</Label>
                      <Input
                        id="arm"
                        type="number"
                        step="0.1"
                        value={measurements.arm}
                        onChange={(e) => setMeasurements({ ...measurements, arm: e.target.value })}
                        placeholder="Ex: 35"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">Salvar medidas</Button>
                </form>
              )}

              {latestProgress?.measurements ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {latestProgress.measurements.waist && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cintura</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {latestProgress.measurements.waist} cm
                      </p>
                    </div>
                  )}
                  {latestProgress.measurements.hip && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quadril</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {latestProgress.measurements.hip} cm
                      </p>
                    </div>
                  )}
                  {latestProgress.measurements.chest && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Peito</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {latestProgress.measurements.chest} cm
                      </p>
                    </div>
                  )}
                  {latestProgress.measurements.thigh && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Coxa</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {latestProgress.measurements.thigh} cm
                      </p>
                    </div>
                  )}
                  {latestProgress.measurements.arm && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Braço</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {latestProgress.measurements.arm} cm
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Ruler className="h-12 w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Nenhuma medida registrada ainda</p>
                  <Button className="mt-4 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black" onClick={() => setShowMeasurementsForm(true)}>
                    Registrar primeiras medidas
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Stats */}
          <div className="space-y-6">
            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Activity className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                Estatísticas
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Treinos Completos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sequência Atual</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">7 dias</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calorias Queimadas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">4.2k</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Calendar className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                Histórico
              </h2>
              <div className="space-y-3">
                {progress.slice(-5).reverse().map((p) => (
                  <div key={p.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(p.date).toLocaleDateString('pt-BR')}
                    </p>
                    {p.weight && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">Peso: {p.weight} kg</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
