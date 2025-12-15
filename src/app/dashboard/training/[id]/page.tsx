"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dumbbell, 
  Clock, 
  Target, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  RefreshCw,
  Play,
  Pause
} from "lucide-react"
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
  duration: number
  completed: boolean
}

export default function WorkoutDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    loadWorkout()
  }, [params.id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  async function loadWorkout() {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setWorkout(data)
    } catch (error) {
      console.error('Erro ao carregar treino:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExercise = (exerciseId: string) => {
    if (!workout) return
    
    setWorkout({
      ...workout,
      exercises: workout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      ),
    })
  }

  const updateExerciseWeight = (exerciseId: string, weight: number) => {
    if (!workout) return
    
    setWorkout({
      ...workout,
      exercises: workout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, weight } : ex
      ),
    })
  }

  const substituteExercise = async (exerciseId: string) => {
    try {
      const response = await fetch('/api/training/substitution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_id: workout?.id,
          exercise_id: exerciseId,
        }),
      })

      if (!response.ok) throw new Error('Erro ao substituir exercício')
      
      const { substitution } = await response.json()
      
      if (!workout) return
      
      setWorkout({
        ...workout,
        exercises: workout.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, ...substitution } : ex
        ),
      })
    } catch (error) {
      console.error('Erro ao substituir exercício:', error)
    }
  }

  const completeWorkout = async () => {
    if (!workout) return
    
    try {
      const response = await fetch('/api/training/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_id: workout.id,
          duration: timer,
          exercises: workout.exercises,
        }),
      })

      if (!response.ok) throw new Error('Erro ao completar treino')
      
      router.push('/dashboard/training')
    } catch (error) {
      console.error('Erro ao completar treino:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
          <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Treino não encontrado</h3>
          <Button onClick={() => router.push('/dashboard/training')} className="bg-black text-white hover:bg-gray-800">
            Voltar para Treinos
          </Button>
        </div>
      </div>
    )
  }

  const completedExercises = workout.exercises.filter((ex) => ex.completed).length
  const totalExercises = workout.exercises.length
  const progress = (completedExercises / totalExercises) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/dashboard/training')}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{workout.name}</h1>
              <p className="text-gray-600 mt-1">{workout.day}</p>
            </div>
          </div>
          <Badge className={workout.completed ? "bg-black text-white" : "bg-gray-200 text-gray-900"}>
            {workout.completed ? "Concluído" : "Em andamento"}
          </Badge>
        </div>

        {/* Timer & Progress */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{formatTime(timer)}</p>
                  <p className="text-sm text-gray-600">Tempo decorrido</p>
                </div>
                <Button
                  size="icon"
                  onClick={() => setIsActive(!isActive)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {completedExercises}/{totalExercises}
                </p>
                <p className="text-sm text-gray-600">Exercícios</p>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <Card key={exercise.id} className={exercise.completed ? "bg-gray-50 border-gray-300" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        exercise.completed ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {exercise.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">{exercise.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {exercise.sets} séries × {exercise.reps} repetições
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => substituteExercise(exercise.id)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Substituir
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Descanso: {exercise.rest}</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`weight-${exercise.id}`} className="text-sm text-gray-600">
                      Peso (kg)
                    </Label>
                    <Input
                      id={`weight-${exercise.id}`}
                      type="number"
                      value={exercise.weight || ""}
                      onChange={(e) => updateExerciseWeight(exercise.id, Number(e.target.value))}
                      placeholder="0"
                      className="border-gray-300"
                    />
                  </div>
                </div>
                {exercise.notes && (
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-700">{exercise.notes}</p>
                  </div>
                )}
                <Button
                  onClick={() => toggleExercise(exercise.id)}
                  className={
                    exercise.completed
                      ? "w-full bg-gray-300 text-gray-700 hover:bg-gray-400"
                      : "w-full bg-black text-white hover:bg-gray-800"
                  }
                >
                  {exercise.completed ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Marcar como não concluído
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Marcar como concluído
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Complete Workout */}
        <Card>
          <CardContent className="py-6">
            <Button
              onClick={completeWorkout}
              disabled={completedExercises !== totalExercises}
              className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
              size="lg"
            >
              <Target className="w-5 h-5 mr-2" />
              Finalizar Treino
            </Button>
            {completedExercises !== totalExercises && (
              <p className="text-center text-sm text-gray-600 mt-2">
                Complete todos os exercícios para finalizar
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
