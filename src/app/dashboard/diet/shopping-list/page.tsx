"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ShoppingCart, Printer } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ShoppingItem {
  id: string
  name: string
  quantity: string
  category: string
  checked: boolean
}

export default function ShoppingListPage() {
  const router = useRouter()
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadShoppingList()
  }, [])

  async function loadShoppingList() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get all meals from diet plan
      const { data: dietData, error } = await supabase
        .from('diet_plans')
        .select('meals')
        .eq('user_id', user.id)

      if (error) throw error

      // Extract and organize items by category
      const allFoods: ShoppingItem[] = []
      dietData?.forEach((day: any) => {
        day.meals?.forEach((meal: any) => {
          meal.foods?.forEach((food: string) => {
            allFoods.push({
              id: Math.random().toString(),
              name: food,
              quantity: "1 porção",
              category: categorizeFood(food),
              checked: false
            })
          })
        })
      })

      // Remove duplicates and group
      const uniqueItems = Array.from(
        new Map(allFoods.map(item => [item.name, item])).values()
      )

      setItems(uniqueItems)
    } catch (error) {
      console.error('Erro ao carregar lista:', error)
    } finally {
      setLoading(false)
    }
  }

  function categorizeFood(food: string): string {
    const categories: Record<string, string[]> = {
      "Proteínas": ["frango", "carne", "peixe", "ovo", "whey"],
      "Carboidratos": ["arroz", "batata", "pão", "macarrão", "aveia"],
      "Vegetais": ["brócolis", "alface", "tomate", "cenoura", "couve"],
      "Frutas": ["banana", "maçã", "laranja", "morango", "abacate"],
      "Laticínios": ["leite", "queijo", "iogurte"],
      "Outros": []
    }

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => food.toLowerCase().includes(keyword))) {
        return category
      }
    }

    return "Outros"
  }

  function toggleItem(id: string) {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  function printList() {
    window.print()
  }

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  const checkedCount = items.filter(i => i.checked).length
  const totalCount = items.length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 animate-pulse mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando lista...</p>
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
            onClick={() => router.push('/dashboard/diet')}
            className="border-gray-300 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            variant="outline"
            onClick={printList}
            className="border-gray-300 text-gray-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Lista de Compras</CardTitle>
            <p className="text-gray-600">
              {checkedCount} de {totalCount} itens marcados
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all"
                style={{ width: `${(checkedCount / totalCount) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Items by Category */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="border-gray-300"
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
