"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, Calendar, ShoppingCart, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Meal {
  id: string
  name: string
  time: string
  calories: number
  protein: number
  carbs: number
  fats: number
  foods: string[]
}

interface DayPlan {
  day: string
  date: string
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  completed: boolean
}

export default function DietPage() {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const supabase = createClient()

  useEffect(() => {
    loadDietPlan()
  }, [])

  async function loadDietPlan() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('day_order')

      if (error) throw error
      setWeekPlan(data || [])
      
      // Set today as selected day
      const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' })
      setSelectedDay(today)
    } catch (error) {
      console.error('Erro ao carregar dieta:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentDayPlan = weekPlan.find(d => d.day === selectedDay)
  const weeklyCalories = weekPlan.reduce((acc, day) => acc + day.totalCalories, 0)
  const avgDailyCalories = weekPlan.length > 0 ? Math.round(weeklyCalories / weekPlan.length) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Utensils className="w-12 h-12 animate-pulse mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando plano alimentar...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Minha Dieta</h1>
            <p className="text-gray-600 mt-1">Plano alimentar personalizado</p>
          </div>
          <Link href="/dashboard/diet/shopping-list">
            <Button className="bg-black text-white hover:bg-gray-800">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Lista de Compras
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Calorias Diárias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-900" />
                <span className="text-2xl font-bold text-gray-900">{avgDailyCalories}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">kcal/dia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Proteínas</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-gray-900">
                {currentDayPlan?.totalProtein || 0}g
              </span>
              <p className="text-sm text-gray-600 mt-1">hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Carboidratos</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-gray-900">
                {currentDayPlan?.totalCarbs || 0}g
              </span>
              <p className="text-sm text-gray-600 mt-1">hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Gorduras</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-gray-900">
                {currentDayPlan?.totalFats || 0}g
              </span>
              <p className="text-sm text-gray-600 mt-1">hoje</p>
            </CardContent>
          </Card>
        </div>

        {/* Day Selector */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-2 overflow-x-auto">
              {weekPlan.map((day) => (
                <Button
                  key={day.day}
                  variant={selectedDay === day.day ? "default" : "outline"}
                  onClick={() => setSelectedDay(day.day)}
                  className={
                    selectedDay === day.day
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {day.day}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        {weekPlan.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum plano alimentar disponível
              </h3>
              <p className="text-gray-600 mb-4">
                Complete o quiz para gerar sua dieta personalizada
              </p>
              <Link href="/quiz">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Fazer Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : currentDayPlan ? (
          <div className="space-y-4">
            {currentDayPlan.meals.map((meal) => (
              <Card key={meal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900">{meal.name}</CardTitle>
                      <CardDescription className="text-gray-600">{meal.time}</CardDescription>
                    </div>
                    <Badge className="bg-black text-white">{meal.calories} kcal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Proteínas</p>
                        <p className="text-lg font-semibold text-gray-900">{meal.protein}g</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Carboidratos</p>
                        <p className="text-lg font-semibold text-gray-900">{meal.carbs}g</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gorduras</p>
                        <p className="text-lg font-semibold text-gray-900">{meal.fats}g</p>
                      </div>
                    </div>

                    {/* Foods */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Alimentos:</p>
                      <ul className="space-y-1">
                        {meal.foods.map((food, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Substituir Refeição
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Selecione um dia para ver as refeições</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
