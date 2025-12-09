import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWorkoutSubstitution } from '@/lib/ai/workout-generator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { exerciseId, workoutId } = await request.json()

    // Get current exercise and workout details
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single()

    if (workoutError) throw workoutError

    const currentExercise = workout.exercises.find((ex: any) => ex.id === exerciseId)
    if (!currentExercise) {
      return NextResponse.json({ error: 'Exercício não encontrado' }, { status: 404 })
    }

    // Get user profile for better substitution
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Generate substitution using AI
    const substitution = await generateWorkoutSubstitution(
      currentExercise,
      profile?.fitness_level || 'intermediate',
      profile?.equipment || []
    )

    // Update workout with new exercise
    const updatedExercises = workout.exercises.map((ex: any) =>
      ex.id === exerciseId ? { ...ex, ...substitution } : ex
    )

    const { error: updateError } = await supabase
      .from('workouts')
      .update({ exercises: updatedExercises })
      .eq('id', workoutId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, substitution })
  } catch (error) {
    console.error('Erro ao substituir exercício:', error)
    return NextResponse.json(
      { error: 'Erro ao substituir exercício' },
      { status: 500 }
    )
  }
}
