import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { dayId, meals } = await request.json()

    const { error } = await supabase
      .from('diet_plans')
      .update({ meals })
      .eq('id', dayId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar dieta:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar dieta' },
      { status: 500 }
    )
  }
}
