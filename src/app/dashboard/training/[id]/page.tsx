"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, RefreshCw, Clock, Dumbbell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
  completed: boolean
  weight?: number
}

interface Workout {
  id: string
  name: string
  day: string
  exercises: Exercise[]
  completed: boolean
  duration: number
  started_at?: string
  completed_at?: string
}

export default function WorkoutDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadWorkout()
  }, [params.id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (workout && !workout.completed) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [workout])

  async function loadWorkout() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setWorkout(data)
    } catch (error) {
      console.error('Erro ao carregar treino:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleExerciseComplete(exerciseId: string) {
    if (!workout) return

    const updatedExercises = workout.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    )

    setWorkout({ ...workout, exercises: updatedExercises })

    try {
      await supabase
        .from('workout_exercises')
        .update({ completed: !workout.exercises.find(e => e.id === exerciseId)?.completed })
        .eq('id', exerciseId)
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error)
    }
  }

  async function completeWorkout() {
    if (!workout) return

    try {
      const { error } = await supabase
        .from('workouts')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          duration: Math.floor(timer / 60)
        })
        .eq('id', workout.id)

      if (error) throw error

      router.push('/dashboard/training')
    } catch (error) {
      console.error('Erro ao completar treino:', error)
    }
  }

  async function substituteExercise(exerciseId: string) {
    try {
      const response = await fetch('/api/training/substitution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId, workoutId: workout?.id })
      })

      const data = await response.json()
      if (data.success) {
        loadWorkout()
      }
    } catch (error) {
      console.error('Erro ao substituir exercício:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const completedExercises = workout?.exercises.filter(e => e.completed).length || 0
  const totalExercises = workout?.exercises.length || 0
  const progress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 animate-pulse mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando treino...</p>
        </div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Treino não encontrado</p>
          <Button onClick={() => router.push('/dashboard/training')} className="mt-4 bg-black text-white">
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/training')}
            className="border-gray-300 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Tempo</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(timer)}</p>
            </div>
            {workout.completed && (
              <Badge className="bg-black text-white">Concluído</Badge>
            )}
          </div>
        </div>

        {/* Workout Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">{workout.name}</CardTitle>
            <p className="text-gray-600">{workout.day}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progresso</span>
                  <span className="text-sm font-medium text-gray-900">
                    {completedExercises}/{totalExercises} exercícios
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <Card
              key={exercise.id}
              className={exercise.completed ? "bg-gray-50 border-gray-300" : ""}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Exercício {index + 1}
                      </span>
                      {exercise.completed && (
                        <Badge className="bg-black text-white">
                          <Check className="w-3 h-3" />
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-gray-900">{exercise.name}</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => substituteExercise(exercise.id)}
                    className="border-gray-300 text-gray-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Séries</p>
                      <p className="text-lg font-semibold text-gray-900">{exercise.sets}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Repetições</p>
                      <p className="text-lg font-semibold text-gray-900">{exercise.reps}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Descanso</p>
                      <p className="text-lg font-semibold text-gray-900">{exercise.rest}</p>
                    </div>
                  </div>

                  {exercise.notes && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{exercise.notes}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => toggleExerciseComplete(exercise.id)}
                    className={
                      exercise.completed
                        ? "w-full bg-gray-800 text-white hover:bg-gray-700"
                        : "w-full bg-black text-white hover:bg-gray-800"
                    }
                  >
                    {exercise.completed ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Marcar como Não Concluído
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Marcar como Concluído
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Complete Workout Button */}
        {!workout.completed && completedExercises === totalExercises && totalExercises > 0 && (
          <Card className="bg-black text-white">
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Parabéns! 🎉</h3>
                <p>Você completou todos os exercícios deste treino</p>
                <Button
                  onClick={completeWorkout}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Finalizar Treino
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
