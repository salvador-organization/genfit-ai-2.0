"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, ArrowLeft, RefreshCw, CheckCircle2, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Meal {
  id: string
  name: string
  time: string
  calories: number
  protein: number
  carbs: number
  fats: number
  foods: string[]
  recipe?: {
    instructions: string[]
    prep_time: number
  }
  completed: boolean
}

interface DayPlan {
  day: string
  date: string
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
}

export default function DietDayPage() {
  const params = useParams()
  const router = useRouter()
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadDayPlan()
  }, [params.day])

  async function loadDayPlan() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('day', params.day)
        .single()

      if (error) throw error
      setDayPlan(data)
    } catch (error) {
      console.error('Erro ao carregar plano do dia:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMeal = (mealId: string) => {
    if (!dayPlan) return
    
    setDayPlan({
      ...dayPlan,
      meals: dayPlan.meals.map((meal) =>
        meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
      ),
    })
  }

  const substituteMeal = async (mealId: string) => {
    try {
      const response = await fetch('/api/diet/substitute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_id: mealId,
          preferences: {},
        }),
      })

      if (!response.ok) throw new Error('Erro ao substituir refeição')
      
      const { substitution } = await response.json()
      
      if (!dayPlan) return
      
      setDayPlan({
        ...dayPlan,
        meals: dayPlan.meals.map((meal) =>
          meal.id === mealId ? { ...meal, ...substitution } : meal
        ),
      })
    } catch (error) {
      console.error('Erro ao substituir refeição:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Utensils className="w-12 h-12 animate-pulse mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando plano do dia...</p>
        </div>
      </div>
    )
  }

  if (!dayPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Plano não encontrado</h3>
          <Button onClick={() => router.push('/dashboard/diet')} className="bg-black text-white hover:bg-gray-800">
            Voltar para Dieta
          </Button>
        </div>
      </div>
    )
  }

  const completedMeals = dayPlan.meals.filter((m) => m.completed).length
  const totalMeals = dayPlan.meals.length
  const progress = (completedMeals / totalMeals) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/dashboard/diet')}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{dayPlan.day}</h1>
              <p className="text-gray-600 mt-1">{dayPlan.date}</p>
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{dayPlan.totalCalories}</p>
                <p className="text-sm text-gray-600">Calorias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{dayPlan.totalProtein}g</p>
                <p className="text-sm text-gray-600">Proteínas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{dayPlan.totalCarbs}g</p>
                <p className="text-sm text-gray-600">Carboidratos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{dayPlan.totalFats}g</p>
                <p className="text-sm text-gray-600">Gorduras</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Progresso do dia</p>
                <p className="text-sm font-semibold text-gray-900">
                  {completedMeals}/{totalMeals} refeições
                </p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        <div className="space-y-4">
          {dayPlan.meals.map((meal) => (
            <Card key={meal.id} className={meal.completed ? "bg-gray-50 border-gray-300" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        meal.completed ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {meal.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Utensils className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">{meal.name}</CardTitle>
                      <CardDescription className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {meal.time}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-black text-white">{meal.calories} kcal</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => substituteMeal(meal.id)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Macros */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{meal.protein}g</p>
                    <p className="text-xs text-gray-600">Proteínas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{meal.carbs}g</p>
                    <p className="text-xs text-gray-600">Carboidratos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{meal.fats}g</p>
                    <p className="text-xs text-gray-600">Gorduras</p>
                  </div>
                </div>

                {/* Foods */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Alimentos:</p>
                  <ul className="space-y-1">
                    {meal.foods.map((food, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recipe */}
                {meal.recipe && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">Modo de Preparo:</p>
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        {meal.recipe.prep_time} min
                      </Badge>
                    </div>
                    <ol className="space-y-2">
                      {meal.recipe.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex gap-2">
                          <span className="font-semibold text-gray-900">{idx + 1}.</span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <Button
                  onClick={() => toggleMeal(meal.id)}
                  className={
                    meal.completed
                      ? "w-full bg-gray-300 text-gray-700 hover:bg-gray-400"
                      : "w-full bg-black text-white hover:bg-gray-800"
                  }
                >
                  {meal.completed ? "Marcar como não consumido" : "Marcar como consumido"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
