'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { getCurrentUser, markQuizCompleted, type QuizAnswers } from '@/lib/auth';
import { QUIZ_QUESTIONS } from '@/lib/quiz-questions';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
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
    } else if (currentQuestion.type === 'multiple') {
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

  const handleInputChange = (value: string) => {
    if (currentQuestion.type === 'input') {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    } else if (currentQuestion.type === 'number') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 0) {
        setAnswers({ ...answers, [currentQuestion.id]: numValue });
      } else if (value === '') {
        const newAnswers = { ...answers };
        delete newAnswers[currentQuestion.id];
        setAnswers(newAnswers);
      }
    }
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion.id];
    
    if (currentQuestion.type === 'single') {
      return !!answer;
    } else if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    } else if (currentQuestion.type === 'input') {
      return typeof answer === 'string' && answer.trim().length > 0;
    } else if (currentQuestion.type === 'number') {
      return typeof answer === 'number' && answer > 0;
    }
    
    return false;
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
    } else if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.includes(value);
    }
    return false;
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
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Passo {currentStep + 1} de {QUIZ_QUESTIONS.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="sticky top-16 z-40 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          {/* Question */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black dark:bg-white text-white dark:text-black text-2xl font-bold">
              {currentStep + 1}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {currentQuestion.title}
            </h1>
            
            {currentQuestion.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Input Fields */}
          {(currentQuestion.type === 'input' || currentQuestion.type === 'number') && (
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  type={currentQuestion.type === 'number' ? 'number' : 'text'}
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg h-14 pr-16 border-gray-300 dark:border-gray-700"
                  min={currentQuestion.type === 'number' ? 1 : undefined}
                />
                {currentQuestion.unit && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    {currentQuestion.unit}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Options */}
          {currentQuestion.options && (
            <div className="grid gap-4 md:grid-cols-2">
              {currentQuestion.options.map((option) => (
                <Card
                  key={option.value}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    isSelected(option.value)
                      ? 'border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900'
                      : 'border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox/Radio */}
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected(option.value)
                        ? 'border-black dark:border-white bg-black dark:bg-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected(option.value) && (
                        <Check className="w-4 h-4 text-white dark:text-black" />
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className="border-gray-300 dark:border-gray-700"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              onClick={handleNext}
              disabled={!isAnswered() || loading}
            >
              {loading ? 'Finalizando...' : isLastStep ? 'Finalizar' : 'Continuar'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Help Text */}
          {currentQuestion.type === 'multiple' && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              💡 Você pode selecionar múltiplas opções
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
