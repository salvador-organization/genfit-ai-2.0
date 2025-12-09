import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateMealSubstitution } from '@/lib/ai/nutrition-generator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { mealId, dayId } = await request.json()

    // Get current meal and day details
    const { data: dayPlan, error: dayError } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('id', dayId)
      .single()

    if (dayError) throw dayError

    const currentMeal = dayPlan.meals.find((m: any) => m.id === mealId)
    if (!currentMeal) {
      return NextResponse.json({ error: 'Refeição não encontrada' }, { status: 404 })
    }

    // Get user profile for better substitution
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Generate substitution using AI
    const substitution = await generateMealSubstitution(
      currentMeal,
      profile?.dietary_restrictions || [],
      profile?.food_preferences || []
    )

    // Update diet plan with new meal
    const updatedMeals = dayPlan.meals.map((m: any) =>
      m.id === mealId ? { ...m, ...substitution } : m
    )

    const { error: updateError } = await supabase
      .from('diet_plans')
      .update({ meals: updatedMeals })
      .eq('id', dayId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, substitution })
  } catch (error) {
    console.error('Erro ao substituir refeição:', error)
    return NextResponse.json(
      { error: 'Erro ao substituir refeição' },
      { status: 500 }
    )
  }
}
