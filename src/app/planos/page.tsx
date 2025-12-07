'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, ArrowRight, Star, Users, Shield } from 'lucide-react';
import { PLANS } from '@/lib/constants/fitai';
import { getCurrentUser } from '@/lib/auth';

export default function PlanosPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const user = getCurrentUser();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    // Se não estiver autenticado, redirecionar para signup
    if (!user) {
      router.push('/signup');
      return;
    }

    // Se não completou o quiz, redirecionar para quiz
    if (!user.quizCompleted) {
      router.push('/quiz');
      return;
    }

    // Redirecionar para checkout (implementar depois)
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-sm dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white">
              <Sparkles className="h-6 w-6 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold">FitAI</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" asChild>
                  <Link href="/signup">Começar grátis</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge className="bg-gray-100 text-gray-900 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
            ✨ Planos Personalizados
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Escolha o plano ideal para você
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Todos os planos incluem acesso completo ao app, treinos ilimitados, plano alimentar personalizado e suporte dedicado.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Mensal */}
          <Card className="p-8 relative border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Mensal</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">R$ 31,90</span>
                  <span className="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Cobrado mensalmente
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Treinos personalizados ilimitados</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Plano alimentar completo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Acompanhamento de progresso</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Suporte por email</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Atualizações automáticas</span>
                </div>
              </div>

              <Button 
                className="w-full border-gray-300 dark:border-gray-700"
                variant="outline"
                size="lg"
                onClick={() => handleSelectPlan('monthly')}
              >
                Começar agora
              </Button>

              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                Mensal • Cancele quando quiser
              </p>
            </div>
          </Card>

          {/* Trimestral - Popular */}
          <Card className="p-8 relative border-2 border-black dark:border-white shadow-xl">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white dark:bg-white dark:text-black">
              ⭐ Mais Popular
            </Badge>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Trimestral</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">R$ 25,90</span>
                  <span className="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  R$ 77,70 a cada 3 meses
                </p>
                <Badge variant="secondary" className="mt-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                  💰 Economize 19%
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Treinos personalizados ilimitados</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Plano alimentar completo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Acompanhamento de progresso</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Suporte prioritário</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Atualizações automáticas</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Economize R$ 18 por trimestre</span>
                </div>
              </div>

              <Button 
                className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                size="lg"
                onClick={() => handleSelectPlan('quarterly')}
              >
                Começar agora
              </Button>

              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                Trimestral • Cancele quando quiser
              </p>
            </div>
          </Card>

          {/* Anual - Melhor Valor */}
          <Card className="p-8 relative border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
              🎯 Melhor Valor
            </Badge>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Anual</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">R$ 19,90</span>
                  <span className="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  R$ 238,80 por ano
                </p>
                <Badge variant="secondary" className="mt-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                  💰 Economize 38%
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Treinos personalizados ilimitados</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Plano alimentar completo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Acompanhamento de progresso</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Suporte VIP</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Atualizações automáticas</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Economize R$ 144 por ano</span>
                </div>
              </div>

              <Button 
                className="w-full border-gray-300 dark:border-gray-700"
                variant="outline"
                size="lg"
                onClick={() => handleSelectPlan('annual')}
              >
                Começar agora
              </Button>

              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                Anual • Cancele quando quiser
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-16 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <Users className="h-6 w-6 text-white dark:text-black" />
              </div>
            </div>
            <div className="text-3xl font-bold">10.000+</div>
            <div className="font-semibold">Usuários ativos</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transformando seus corpos com IA
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <Star className="h-6 w-6 text-white dark:text-black" />
              </div>
            </div>
            <div className="text-3xl font-bold">4.9/5</div>
            <div className="font-semibold">Avaliação média</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Baseado em 2.500+ avaliações
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <Shield className="h-6 w-6 text-white dark:text-black" />
              </div>
            </div>
            <div className="text-3xl font-bold">7 dias</div>
            <div className="font-semibold">Garantia total</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não gostou? Devolvemos 100%
            </p>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                <Shield className="h-10 w-10 text-white dark:text-black" />
              </div>
              <div className="text-center md:text-left space-y-2">
                <h3 className="text-2xl font-bold">Garantia de Satisfação de 7 Dias</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Experimente o FitAI sem riscos. Se não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do seu dinheiro. Sem perguntas, sem complicações.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <h3 className="font-bold mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas ou multas. Seu acesso continuará até o final do período pago.
              </p>
            </Card>

            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <h3 className="font-bold mb-2">Como funciona a garantia de 7 dias?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Se você não ficar satisfeito nos primeiros 7 dias, basta entrar em contato e faremos o reembolso completo, sem perguntas.
              </p>
            </Card>

            <Card className="p-6 border-gray-200 dark:border-gray-800">
              <h3 className="font-bold mb-2">Posso mudar de plano depois?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Ajustaremos o valor proporcionalmente.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-black dark:bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-black">
              Pronto para começar sua transformação?
            </h2>
            <p className="text-lg text-gray-300 dark:text-gray-700">
              Junte-se a milhares de pessoas que já estão transformando seus corpos com o FitAI.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800 text-lg h-14 px-8"
              asChild
            >
              <Link href="/signup">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 FitAI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
