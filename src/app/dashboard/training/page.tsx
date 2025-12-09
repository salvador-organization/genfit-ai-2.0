"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Dumbbell, TrendingUp, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Workout {
  id: string
  name: string
  day: string
  exercises: Array<{
    name: string
    sets: number
    reps: string
    rest: string
  }>
  completed: boolean
  duration: number
}

export default function TrainingPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(1)
  const supabase = createClient()

  useEffect(() => {
    loadWorkouts()
  }, [])

  async function loadWorkouts() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('week', currentWeek)
        .order('day_order')

      if (error) throw error
      setWorkouts(data || [])
    } catch (error) {
      console.error('Erro ao carregar treinos:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedCount = workouts.filter(w => w.completed).length
  const totalWorkouts = workouts.length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 animate-pulse mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando treinos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Treinos</h1>
            <p className="text-gray-600 mt-1">Semana {currentWeek}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Semana Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Próxima Semana
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Progresso Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-900" />
                <span className="text-2xl font-bold text-gray-900">
                  {completedCount}/{totalWorkouts}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">treinos concluídos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Tempo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-900" />
                <span className="text-2xl font-bold text-gray-900">
                  {workouts.reduce((acc, w) => acc + (w.completed ? w.duration : 0), 0)}min
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Próximo Treino</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-900" />
                <span className="text-2xl font-bold text-gray-900">
                  {workouts.find(w => !w.completed)?.day || "Completo"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">dia da semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Workout List */}
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum treino disponível
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete o quiz para gerar seu plano personalizado
                </p>
                <Link href="/quiz">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Fazer Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id} className={workout.completed ? "bg-gray-50 border-gray-300" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900">{workout.name}</CardTitle>
                      <CardDescription className="text-gray-600">{workout.day}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {workout.completed && (
                        <Badge className="bg-black text-white">Concluído</Badge>
                      )}
                      <Link href={`/dashboard/training/${workout.id}`}>
                        <Button className="bg-black text-white hover:bg-gray-800">
                          {workout.completed ? "Ver Detalhes" : "Iniciar"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {workout.exercises.length} exercícios • {workout.duration}min
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {workout.exercises.slice(0, 3).map((ex, idx) => (
                        <Badge key={idx} variant="outline" className="border-gray-300 text-gray-700">
                          {ex.name}
                        </Badge>
                      ))}
                      {workout.exercises.length > 3 && (
                        <Badge variant="outline" className="border-gray-300 text-gray-700">
                          +{workout.exercises.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
