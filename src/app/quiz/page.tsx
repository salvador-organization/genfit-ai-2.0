'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { getCurrentUser, markQuizCompleted, type QuizAnswers } from '@/lib/auth';
import { QUIZ_QUESTIONS } from '@/lib/quiz-questions';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;
  const isLastStep = currentStep === QUIZ_QUESTIONS.length - 1;

  const handleAnswer = (value: string) => {
    if (currentQuestion.type === 'single') {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    } else {
      // Multiple choice
      const current = (answers[currentQuestion.id] as string[]) || [];
      
      // Se selecionar "none", limpar outras seleções
      if (value === 'none') {
        setAnswers({ ...answers, [currentQuestion.id]: ['none'] });
      } else {
        // Remover "none" se existir e adicionar/remover o valor
        const filtered = current.filter(v => v !== 'none');
        const newAnswers = filtered.includes(value)
          ? filtered.filter(v => v !== value)
          : [...filtered, value];
        setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
      }
    }
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'single') {
      return !!answer;
    } else {
      return Array.isArray(answer) && answer.length > 0;
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    
    try {
      // Salvar respostas e marcar quiz como completo
      const quizAnswers: QuizAnswers = {
        goal: answers.goal as string,
        frequency: answers.frequency as string,
        location: answers.location as string,
        duration: answers.duration as string,
        restrictions: answers.restrictions as string[] || [],
        preferences: answers.preferences as string[] || [],
        experience: answers.experience as string,
      };

      markQuizCompleted(quizAnswers);

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao finalizar quiz:', error);
      setLoading(false);
    }
  };

  const isSelected = (value: string) => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'single') {
      return answer === value;
    } else {
      return Array.isArray(answer) && answer.includes(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">FitAI</span>
          </Link>
          
          <div className="text-sm text-muted-foreground">
            Passo {currentStep + 1} de {QUIZ_QUESTIONS.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="sticky top-16 z-40 bg-white dark:bg-slate-950 border-b">
        <div className="container mx-auto px-4 py-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          {/* Question */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white text-2xl font-bold">
              {currentStep + 1}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {currentQuestion.title}
            </h1>
            
            {currentQuestion.description && (
              <p className="text-lg text-muted-foreground">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="grid gap-4 md:grid-cols-2">
            {currentQuestion.options.map((option) => (
              <Card
                key={option.value}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected(option.value)
                    ? 'border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                    : 'hover:border-orange-200 dark:hover:border-orange-900'
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox/Radio */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected(option.value)
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected(option.value) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {option.icon && (
                        <span className="text-2xl">{option.icon}</span>
                      )}
                      <h3 className="font-semibold text-lg">{option.label}</h3>
                    </div>
                    
                    {option.description && (
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
              onClick={handleNext}
              disabled={!isAnswered() || loading}
            >
              {loading ? 'Finalizando...' : isLastStep ? 'Finalizar' : 'Continuar'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Help Text */}
          {currentQuestion.type === 'multiple' && (
            <p className="text-center text-sm text-muted-foreground">
              💡 Você pode selecionar múltiplas opções
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
