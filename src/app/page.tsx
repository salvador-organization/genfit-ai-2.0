import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Clock, 
  Repeat, 
  TrendingUp, 
  Users, 
  Star,
  ClipboardList,
  LineChart,
  Check,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import {
  PRODUCT_TAGLINE,
  PRODUCT_DESCRIPTION,
  BENEFITS,
  SOCIAL_PROOF,
  HOW_IT_WORKS,
  TESTIMONIALS,
  PLANS,
  FAQ,
} from '@/lib/constants/fitai';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const iconMap: Record<string, any> = {
  Sparkles,
  Clock,
  Repeat,
  TrendingUp,
  Users,
  Star,
  ClipboardList,
  LineChart,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">FitAI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#como-funciona" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Como funciona
            </Link>
            <Link href="#planos" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Planos
            </Link>
            <Link href="#depoimentos" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Depoimentos
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-orange-600 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700" asChild>
              <Link href="/signup">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
                ✨ Personalizado por IA
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {PRODUCT_TAGLINE}
              </h1>
              
              <p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
                {PRODUCT_DESCRIPTION}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-lg h-14 px-8"
                asChild
              >
                <Link href="/signup">
                  Quero meu plano personalizado
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg h-14 px-8"
                asChild
              >
                <Link href="#planos">Ver planos e preços</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              ✓ 7 dias grátis • ✓ Sem cartão de crédito • ✓ Cancele quando quiser
            </p>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 p-8 backdrop-blur-sm border border-orange-200 dark:border-orange-900">
              <div className="h-full w-full rounded-xl bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">Seu plano em 3 minutos</h3>
                  <p className="text-muted-foreground">
                    Responda perguntas rápidas e receba um plano 100% personalizado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {SOCIAL_PROOF.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={index} className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    {item.value}
                  </div>
                  <div className="font-semibold">{item.label}</div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Por que escolher o FitAI?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para transformar seu corpo, em um só lugar
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = iconMap[benefit.icon];
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="bg-slate-50 dark:bg-slate-900/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Como funciona? Simples assim:
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {HOW_IT_WORKS.map((step, index) => {
              const Icon = iconMap[step.icon];
              return (
                <div key={index} className="relative">
                  <Card className="p-8 h-full hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white text-xl font-bold">
                          {step.step}
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </Card>
                  
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-8 w-8 text-orange-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
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

      {/* Testimonials */}
      <section id="depoimentos" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            O que nossos usuários dizem
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 overflow-hidden">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.age} anos</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="bg-slate-50 dark:bg-slate-900/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Escolha seu plano e comece hoje
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todos os planos incluem acesso completo ao app, treinos ilimitados, plano alimentar e suporte.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {Object.values(PLANS).map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 relative ${plan.popular ? 'border-2 border-orange-500 shadow-xl' : ''}`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-600 text-white">
                    {plan.badge}
                  </Badge>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-bold">R$ {plan.price_monthly.toFixed(2)}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    {plan.price_total !== plan.price_monthly && (
                      <p className="text-sm text-muted-foreground mt-2">
                        R$ {plan.price_total.toFixed(2)} {plan.billing_period.toLowerCase()}
                      </p>
                    )}
                    {plan.savings_percentage && (
                      <Badge variant="secondary" className="mt-2">
                        💰 Economize {plan.savings_percentage}%
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    asChild
                  >
                    <Link href="/signup">Começar agora</Link>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {plan.billing_period} • Cancele quando quiser
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-900">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Garantia de Satisfação</div>
                  <p className="text-sm text-muted-foreground">
                    7 dias de garantia. Não gostou? Devolvemos 100% do seu dinheiro.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Perguntas Frequentes
          </h2>
        </div>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {FAQ.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
              Pronto para transformar seu corpo?
            </h2>
            <p className="text-lg text-white/90">
              Comece hoje mesmo. Seu plano personalizado está a 3 minutos de distância.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-slate-50 text-lg h-14 px-8"
                asChild
              >
                <Link href="/signup">
                  Criar meu plano grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-white/80">
              ✓ 7 dias grátis • ✓ Sem cartão de crédito • ✓ Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">FitAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Planos de treino e dieta personalizados por IA
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</Link></li>
                <li><Link href="#planos" className="hover:text-foreground transition-colors">Planos e preços</Link></li>
                <li><Link href="#depoimentos" className="hover:text-foreground transition-colors">Depoimentos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/contato" className="hover:text-foreground transition-colors">Contato</Link></li>
                <li><Link href="/ajuda" className="hover:text-foreground transition-colors">Central de ajuda</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/termos" className="hover:text-foreground transition-colors">Termos de uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-foreground transition-colors">Política de privacidade</Link></li>
                <li><Link href="/lgpd" className="hover:text-foreground transition-colors">LGPD</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 FitAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
