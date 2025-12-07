'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Settings as SettingsIcon,
  LogOut,
  Moon,
  Sun,
  Globe,
  Shield,
  Download,
  Trash2,
  Bell,
  Lock,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout } from '@/lib/auth';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { user } = useApp();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('pt-BR');

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Implement theme change logic
    document.documentElement.classList.toggle('dark');
  };

  const handleExportData = () => {
    alert('Seus dados serão exportados em formato JSON. Funcionalidade em desenvolvimento.');
  };

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      alert('Funcionalidade de exclusão de conta será implementada em breve.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-700">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">FitAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Início
            </Link>
            <Link href="/dashboard/treinos" className="text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Treinos
            </Link>
            <Link href="/dashboard/dieta" className="text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Dieta
            </Link>
            <Link href="/dashboard/progresso" className="text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Progresso
            </Link>
            <Link href="/dashboard/perfil" className="text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Perfil
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Configurações</h1>
          <p className="text-lg text-muted-foreground">
            Personalize sua experiência no FitAI
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {theme === 'light' ? <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
              Aparência
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <p className="font-semibold">Tema</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' ? 'Modo claro' : 'Modo escuro'}
                  </p>
                </div>
                <Button onClick={toggleTheme} variant="outline">
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </Card>

          {/* Language */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              Idioma
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <p className="font-semibold">Idioma do aplicativo</p>
                  <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                </div>
                <Badge>Ativo</Badge>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              Notificações
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <p className="font-semibold">Push notifications</p>
                  <p className="text-sm text-muted-foreground">Receba notificações no dispositivo</p>
                </div>
                <Badge className="bg-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <p className="font-semibold">Email notifications</p>
                  <p className="text-sm text-muted-foreground">Receba atualizações por email</p>
                </div>
                <Badge className="bg-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <p className="font-semibold">Frequência</p>
                  <p className="text-sm text-muted-foreground">Notificações diárias</p>
                </div>
                <Button variant="outline" size="sm">Alterar</Button>
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              Privacidade e Segurança
            </h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="mr-2 h-4 w-4" />
                Política de Privacidade
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Termos de Uso
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Exportar meus dados (LGPD)
              </Button>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Download className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              Gerenciamento de Dados
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                  <strong>LGPD:</strong> Você tem direito a acessar, corrigir e excluir seus dados pessoais.
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Seus dados são criptografados e armazenados com segurança. Nunca compartilhamos suas informações com terceiros sem seu consentimento.
                </p>
              </div>
              <Button variant="outline" className="w-full" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Baixar todos os meus dados
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-gray-400 dark:border-gray-600">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Trash2 className="h-5 w-5" />
              Zona de Perigo
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                  <strong>Atenção:</strong> Esta ação é irreversível.
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Ao excluir sua conta, todos os seus dados, incluindo treinos, dieta, progresso e histórico serão permanentemente removidos.
                </p>
              </div>
              <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir minha conta permanentemente
              </Button>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-6 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-lg font-bold mb-4">Sobre o FitAI</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Versão: 1.0.0</p>
              <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              <p className="pt-2 border-t">
                © 2024 FitAI. Todos os direitos reservados.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
