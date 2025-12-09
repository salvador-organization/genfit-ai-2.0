import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWorkoutPlan } from '@/lib/ai/workout-generator'

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

    // Generate workout plan using AI
    const workoutPlan = await generateWorkoutPlan({
      goal: quizAnswers.goal,
      fitnessLevel: quizAnswers.fitness_level,
      daysPerWeek: quizAnswers.days_per_week,
      equipment: quizAnswers.equipment,
      limitations: quizAnswers.limitations,
      preferences: quizAnswers.preferences
    })

    // Save workout plan to database
    const workoutPromises = workoutPlan.map((workout, index) =>
      supabase.from('workouts').insert({
        user_id: user.id,
        name: workout.name,
        day: workout.day,
        day_order: index,
        week: 1,
        exercises: workout.exercises,
        duration: workout.duration,
        completed: false
      })
    )

    await Promise.all(workoutPromises)

    return NextResponse.json({ success: true, plan: workoutPlan })
  } catch (error) {
    console.error('Erro ao gerar treino:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar treino' },
      { status: 500 }
    )
  }
}
