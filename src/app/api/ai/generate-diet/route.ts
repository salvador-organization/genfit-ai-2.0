import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateNutritionPlan } from '@/lib/ai/nutrition-generator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Get user profile and quiz answers
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const { data: quizAnswers } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!profile || !quizAnswers) {
      return NextResponse.json(
        { error: 'Complete seu perfil e quiz primeiro' },
        { status: 400 }
      )
    }

    // Generate nutrition plan using AI
    const nutritionPlan = await generateNutritionPlan({
      goal: quizAnswers.goal,
      weight: profile.weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender,
      activityLevel: quizAnswers.activity_level,
      dietaryRestrictions: quizAnswers.dietary_restrictions,
      foodPreferences: quizAnswers.food_preferences,
      mealsPerDay: quizAnswers.meals_per_day
    })

    // Save diet plan to database
    const dietPromises = nutritionPlan.weekPlan.map((day, index) =>
      supabase.from('diet_plans').insert({
        user_id: user.id,
        day: day.day,
        day_order: index,
        date: day.date,
        meals: day.meals,
        total_calories: day.totalCalories,
        total_protein: day.totalProtein,
        total_carbs: day.totalCarbs,
        total_fats: day.totalFats,
        completed: false
      })
    )

    await Promise.all(dietPromises)

    return NextResponse.json({ success: true, plan: nutritionPlan })
  } catch (error) {
    console.error('Erro ao gerar dieta:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar dieta' },
      { status: 500 }
    )
  }
}
