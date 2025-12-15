"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Camera, Save, TrendingUp, Target, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useApp } from "@/contexts/AppContext"

export default function ProfilePage() {
  const { user, updateUser } = useApp()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    height: 0,
    current_weight: 0,
    goal_weight: 0,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        height: user.height || 0,
        current_weight: user.current_weight || 0,
        goal_weight: user.goal_weight || 0,
      })
    }
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateUser(formData)
      setEditing(false)
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="w-12 h-12 animate-pulse mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações e progresso</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-600" />
                  </div>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-gray-900">{user.name}</CardTitle>
                  <CardDescription className="text-gray-600">{user.email}</CardDescription>
                </div>
              </div>
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="border-gray-300 bg-gray-50"
                />
              </div>
            </div>

            {/* Body Measurements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Medidas Corporais</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-gray-900">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    disabled={!editing}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_weight" className="text-gray-900">Peso Atual (kg)</Label>
                  <Input
                    id="current_weight"
                    type="number"
                    value={formData.current_weight}
                    onChange={(e) => setFormData({ ...formData, current_weight: Number(e.target.value) })}
                    disabled={!editing}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal_weight" className="text-gray-900">Peso Meta (kg)</Label>
                  <Input
                    id="goal_weight"
                    type="number"
                    value={formData.goal_weight}
                    onChange={(e) => setFormData({ ...formData, goal_weight: Number(e.target.value) })}
                    disabled={!editing}
                    className="border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Quiz Info */}
            {user.quiz_completed && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informações do Quiz</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Objetivo</p>
                    <p className="font-semibold text-gray-900">
                      {user.quiz_data?.goal || "Não definido"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Nível</p>
                    <p className="font-semibold text-gray-900">
                      {user.quiz_data?.fitness_level || "Não definido"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Frequência</p>
                    <p className="font-semibold text-gray-900">
                      {user.quiz_data?.workout_frequency || "Não definido"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Local</p>
                    <p className="font-semibold text-gray-900">
                      {user.quiz_data?.workout_location || "Não definido"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Peso perdido</span>
                  <span className="font-bold text-gray-900">
                    {user.current_weight && user.goal_weight
                      ? `${(user.current_weight - user.goal_weight).toFixed(1)} kg`
                      : "0 kg"}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black"
                    style={{
                      width: user.current_weight && user.goal_weight
                        ? `${Math.min(100, ((user.current_weight - user.goal_weight) / user.current_weight) * 100)}%`
                        : "0%"
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Meta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {user.goal_weight || 0}
                  <span className="text-lg text-gray-600 ml-1">kg</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">Peso objetivo</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-black text-white">7 dias</Badge>
                <Badge className="bg-gray-200 text-gray-900">30 dias</Badge>
                <Badge className="bg-gray-200 text-gray-900">100 treinos</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
