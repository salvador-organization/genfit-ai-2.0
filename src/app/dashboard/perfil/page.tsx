'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Mail,
  Lock,
  Trash2,
  RefreshCw,
  Save,
  Bell,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout, getQuizAnswers } from '@/lib/auth';

export default function PerfilPage() {
  const router = useRouter();
  const { user, updateUser } = useApp();
  const [quizAnswers, setQuizAnswers] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
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

    setFormData({
      name: user.name || '',
      email: user.email || '',
      height: '',
      weight: '',
      age: '',
    });

    const answers = getQuizAnswers();
    setQuizAnswers(answers);
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({
        name: formData.name,
        email: formData.email,
      });
      setIsEditing(false);
    }
  };

  const handleRedoQuiz = () => {
    if (confirm('Tem certeza que deseja refazer o quiz? Isso irá gerar um novo plano personalizado.')) {
      router.push('/quiz');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const goalMap: Record<string, string> = {
    weight_loss: 'Emagrecer',
    muscle_gain: 'Ganhar massa',
    toning: 'Tonificar',
    maintenance: 'Manutenção',
    cardio: 'Condicionamento',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
              <UserIcon className="h-6 w-6 text-white" />
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
            <Link href="/dashboard/dieta" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Dieta
            </Link>
            <Link href="/dashboard/progresso" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Progresso
            </Link>
            <Link href="/dashboard/perfil" className="text-sm font-medium text-orange-600">
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Perfil</h1>
          <p className="text-lg text-muted-foreground">
            Gerencie suas informações pessoais
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Informações Pessoais</h2>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Editar</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    disabled={!isEditing}
                    placeholder={quizAnswers?.height || '170'}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    disabled={!isEditing}
                    placeholder={quizAnswers?.weight || '70'}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    disabled={!isEditing}
                    placeholder={quizAnswers?.age || '30'}
                  />
                </div>
              </div>
            </form>
          </Card>

          {/* Quiz Preferences */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Preferências do Quiz</h2>
              <Button onClick={handleRedoQuiz} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refazer Quiz
              </Button>
            </div>

            {quizAnswers ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Objetivo</p>
                  <p className="font-semibold">{goalMap[quizAnswers.goal] || quizAnswers.goal}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Nível</p>
                  <p className="font-semibold">
                    {quizAnswers.experience_level === 'beginner' ? 'Iniciante' : 
                     quizAnswers.experience_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Frequência</p>
                  <p className="font-semibold">{quizAnswers.weekly_frequency}x por semana</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Local</p>
                  <p className="font-semibold">
                    {quizAnswers.training_location === 'gym' ? 'Academia' :
                     quizAnswers.training_location === 'home_no_equipment' ? 'Casa (sem equipamentos)' :
                     quizAnswers.training_location === 'home_with_equipment' ? 'Casa (com equipamentos)' : 'Externo'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma preferência salva</p>
            )}
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Notificações
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div>
                  <p className="font-semibold">Lembretes de treino</p>
                  <p className="text-sm text-muted-foreground">Receba notificações para não perder seus treinos</p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div>
                  <p className="font-semibold">Lembretes de refeição</p>
                  <p className="text-sm text-muted-foreground">Notificações nos horários das refeições</p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div>
                  <p className="font-semibold">Atualizações do plano</p>
                  <p className="text-sm text-muted-foreground">Quando seu plano for ajustado</p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Segurança</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Alterar email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lock className="mr-2 h-4 w-4" />
                Alterar senha
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir conta
              </Button>
            </div>
          </Card>

          {/* Subscription Link */}
          <Card className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Gerenciar Assinatura</h3>
                <p className="text-sm text-muted-foreground">
                  Veja seu plano atual, histórico de pagamentos e muito mais
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/assinatura">
                  Ver assinatura
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
