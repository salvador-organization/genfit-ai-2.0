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
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-sm dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white">
              <Sparkles className="h-6 w-6 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold">FitAI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#como-funciona" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              Como funciona
            </Link>
            <Link href="#planos" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              Planos
            </Link>
            <Link href="#depoimentos" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              Depoimentos
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" asChild>
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
              <Badge className="bg-gray-100 text-gray-900 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
                ✨ Personalizado por IA
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {PRODUCT_TAGLINE}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 md:text-xl max-w-2xl">
                {PRODUCT_DESCRIPTION}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-lg h-14 px-8"
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
                className="text-lg h-14 px-8 border-gray-300 dark:border-gray-700"
                asChild
              >
                <Link href="#planos">Ver planos e preços</Link>
              </Button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✓ 7 dias grátis • ✓ Sem cartão de crédito • ✓ Cancele quando quiser
            </p>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-900 p-8 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
              <div className="h-full w-full rounded-xl bg-white dark:bg-black shadow-2xl flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <div className="text-center space-y-4 p-8">
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-black dark:bg-white flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-white dark:text-black" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">Seu plano em 3 minutos</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Responda perguntas rápidas e receba um plano 100% personalizado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {SOCIAL_PROOF.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={index} className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white dark:text-black" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-black dark:text-white">
                    {item.value}
                  </div>
                  <div className="font-semibold">{item.label}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
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
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tudo que você precisa para transformar seu corpo, em um só lugar
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = iconMap[benefit.icon];
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-800">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white dark:text-black" />
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="bg-gray-50 dark:bg-gray-950 py-16 md:py-24">
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
                  <Card className="p-8 h-full hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-800">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-xl font-bold">
                          {step.step}
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  </Card>
                  
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
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
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-black dark:fill-white text-black dark:text-white" />
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 italic">"{testimonial.text}"</p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.age} anos</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="bg-gray-50 dark:bg-gray-950 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Escolha seu plano e comece hoje
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Todos os planos incluem acesso completo ao app, treinos ilimitados, plano alimentar e suporte.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {Object.values(PLANS).map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 relative border-gray-200 dark:border-gray-800 ${plan.popular ? 'border-2 border-black dark:border-white shadow-xl' : ''}`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white dark:bg-white dark:text-black">
                    {plan.badge}
                  </Badge>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-bold">R$ {plan.price_monthly.toFixed(2)}</span>
                      <span className="text-gray-600 dark:text-gray-400">/mês</span>
                    </div>
                    {plan.price_total !== plan.price_monthly && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        R$ {plan.price_total.toFixed(2)} {plan.billing_period.toLowerCase()}
                      </p>
                    )}
                    {plan.savings_percentage && (
                      <Badge variant="secondary" className="mt-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                        💰 Economize {plan.savings_percentage}%
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${plan.popular ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200' : 'border-gray-300 dark:border-gray-700'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    asChild
                  >
                    <Link href="/signup">Começar agora</Link>
                  </Button>

                  <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                    {plan.billing_period} • Cancele quando quiser
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block p-6 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <Check className="h-6 w-6 text-white dark:text-black" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Garantia de Satisfação</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
            <AccordionItem key={index} value={`item-${index}`} className="border-gray-200 dark:border-gray-800">
              <AccordionTrigger className="text-left hover:text-gray-600 dark:hover:text-gray-400">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="bg-black dark:bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white dark:text-black">
              Pronto para transformar seu corpo?
            </h2>
            <p className="text-lg text-gray-300 dark:text-gray-700">
              Comece hoje mesmo. Seu plano personalizado está a 3 minutos de distância.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800 text-lg h-14 px-8"
                asChild
              >
                <Link href="/signup">
                  Criar meu plano grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-300 dark:text-gray-700">
              ✓ 7 dias grátis • ✓ Sem cartão de crédito • ✓ Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white">
                  <Sparkles className="h-6 w-6 text-white dark:text-black" />
                </div>
                <span className="text-xl font-bold">FitAI</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Planos de treino e dieta personalizados por IA
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#como-funciona" className="hover:text-black dark:hover:text-white transition-colors">Como funciona</Link></li>
                <li><Link href="#planos" className="hover:text-black dark:hover:text-white transition-colors">Planos e preços</Link></li>
                <li><Link href="#depoimentos" className="hover:text-black dark:hover:text-white transition-colors">Depoimentos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#faq" className="hover:text-black dark:hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contato" className="hover:text-black dark:hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="/ajuda" className="hover:text-black dark:hover:text-white transition-colors">Central de ajuda</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/termos" className="hover:text-black dark:hover:text-white transition-colors">Termos de uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-black dark:hover:text-white transition-colors">Política de privacidade</Link></li>
                <li><Link href="/lgpd" className="hover:text-black dark:hover:text-white transition-colors">LGPD</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2024 FitAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
