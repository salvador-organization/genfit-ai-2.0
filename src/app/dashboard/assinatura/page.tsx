'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Check,
  Calendar,
  Receipt,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { logout } from '@/lib/auth';
import { PLANS } from '@/lib/constants/fitai';

export default function AssinaturaPage() {
  const router = useRouter();
  const { user, subscription } = useApp();

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

  const handleChangePlan = (planType: 'monthly' | 'quarterly' | 'annual') => {
    alert(`Funcionalidade de mudança de plano para ${planType} será implementada em breve!`);
  };

  if (!user || !subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const currentPlan = PLANS[subscription.plan_type];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
              <CreditCard className="h-6 w-6 text-white" />
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Assinatura</h1>
          <p className="text-lg text-muted-foreground">
            Gerencie seu plano e pagamentos
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Current Plan */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge className="mb-2 bg-green-100 text-green-700 hover:bg-green-100">
                    {subscription.status === 'active' ? 'Ativo' : 
                     subscription.status === 'trial' ? 'Trial' : 
                     subscription.status === 'cancelled' ? 'Cancelado' : 'Expirado'}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">{currentPlan.name}</h2>
                  <p className="text-3xl font-bold text-orange-600">
                    R$ {currentPlan.price_monthly.toFixed(2)}
                    <span className="text-base text-muted-foreground font-normal">/mês</span>
                  </p>
                  {currentPlan.savings_percentage && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Economize {currentPlan.savings_percentage}% • R$ {currentPlan.savings_amount?.toFixed(2)} por ano
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Próxima cobrança</p>
                  <p className="font-semibold">
                    {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {subscription.cancel_at_period_end && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    ⚠️ Sua assinatura será cancelada em {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </Card>

            {/* Change Plan */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Trocar de Plano</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(PLANS).map(([key, plan]) => {
                  const isCurrentPlan = key === subscription.plan_type;
                  return (
                    <Card 
                      key={key}
                      className={`p-4 ${isCurrentPlan ? 'border-2 border-orange-500' : ''} ${plan.popular ? 'border-2 border-blue-500' : ''}`}
                    >
                      {plan.badge && (
                        <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                          {plan.badge}
                        </Badge>
                      )}
                      <h3 className="font-bold mb-2">{plan.name}</h3>
                      <p className="text-2xl font-bold text-orange-600 mb-1">
                        R$ {plan.price_monthly.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">{plan.billing_period}</p>
                      {plan.savings_percentage && (
                        <p className="text-xs text-green-600 dark:text-green-400 mb-3">
                          Economize {plan.savings_percentage}%
                        </p>
                      )}
                      <Button 
                        className="w-full" 
                        variant={isCurrentPlan ? 'secondary' : 'default'}
                        disabled={isCurrentPlan}
                        onClick={() => handleChangePlan(key as any)}
                      >
                        {isCurrentPlan ? 'Plano Atual' : 'Selecionar'}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* Payment History */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-600" />
                Histórico de Pagamentos
              </h2>
              <div className="space-y-3">
                {[
                  { date: new Date(), amount: currentPlan.price_total, status: 'paid' },
                  { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), amount: currentPlan.price_total, status: 'paid' },
                  { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), amount: currentPlan.price_total, status: 'paid' },
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="font-semibold">R$ {payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.date.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Ações</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Atualizar método de pagamento
                </Button>
                <Button variant="outline" className="w-full">
                  Baixar nota fiscal
                </Button>
                <Button variant="destructive" className="w-full">
                  Cancelar assinatura
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-orange-200 dark:border-orange-800">
              <h3 className="font-bold mb-2">💡 Dica</h3>
              <p className="text-sm text-muted-foreground">
                Ao trocar para um plano anual, você economiza até 38% e garante acesso a recursos exclusivos!
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Suporte</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Precisa de ajuda com sua assinatura?
              </p>
              <Button variant="outline" className="w-full">
                Falar com suporte
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
