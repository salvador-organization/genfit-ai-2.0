/**
 * 🗄️ SCHEMAS DO BANCO DE DADOS
 * Estrutura completa de tabelas e relacionamentos
 */

export const DATABASE_SCHEMA = `
-- ============================================
-- TABELA: users
-- Usuários da plataforma
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  
  -- Dados físicos
  gender VARCHAR(20),
  birth_date DATE,
  height DECIMAL(5,2),
  current_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(5,2),
  muscle_mass DECIMAL(5,2),
  
  -- Objetivos e preferências
  goal VARCHAR(50),
  experience_level VARCHAR(20),
  training_days_per_week INTEGER,
  preferred_training_time VARCHAR(20),
  dietary_restrictions TEXT[],
  food_preferences TEXT[],
  
  -- Assinatura
  subscription_status VARCHAR(20) DEFAULT 'inactive',
  subscription_plan VARCHAR(20),
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  
  -- Soft delete
  deleted_at TIMESTAMP
);

-- ============================================
-- TABELA: quiz_responses
-- Respostas do quiz de onboarding
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Respostas completas (JSON)
  responses JSONB NOT NULL,
  
  -- Dados extraídos
  goal VARCHAR(50),
  experience_level VARCHAR(20),
  training_frequency INTEGER,
  dietary_restrictions TEXT[],
  
  -- Photos
  front_photo_url TEXT,
  side_photo_url TEXT,
  back_photo_url TEXT,
  
  -- Metadata
  completed_at TIMESTAMP DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

-- ============================================
-- TABELA: workout_plans
-- Planos de treino gerados pela IA
-- ============================================
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  week_number INTEGER NOT NULL,
  goal VARCHAR(50),
  difficulty VARCHAR(20),
  days_per_week INTEGER,
  
  -- Plano completo (JSON)
  plan_data JSONB NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, week_number)
);

-- ============================================
-- TABELA: workout_logs
-- Registro de treinos realizados
-- ============================================
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  
  workout_date DATE NOT NULL,
  workout_day_id VARCHAR(50),
  
  -- Dados do treino
  exercises_completed INTEGER,
  total_exercises INTEGER,
  duration_minutes INTEGER,
  
  -- Exercícios com cargas (JSON)
  exercises_data JSONB,
  
  -- Feedback
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA: exercise_progress
-- Progressão de carga por exercício
-- ============================================
CREATE TABLE IF NOT EXISTS exercise_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  exercise_name VARCHAR(255) NOT NULL,
  workout_date DATE NOT NULL,
  
  -- Dados de performance
  sets INTEGER,
  reps INTEGER,
  weight DECIMAL(6,2),
  rest_seconds INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, exercise_name, workout_date)
);

-- ============================================
-- TABELA: nutrition_plans
-- Planos alimentares gerados pela IA
-- ============================================
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  week_number INTEGER NOT NULL,
  goal VARCHAR(50),
  
  -- Targets diários
  daily_calories INTEGER,
  daily_protein INTEGER,
  daily_carbs INTEGER,
  daily_fats INTEGER,
  
  -- Plano completo (JSON)
  plan_data JSONB NOT NULL,
  
  -- Restrições
  dietary_restrictions TEXT[],
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, week_number)
);

-- ============================================
-- TABELA: nutrition_logs
-- Registro de alimentação diária
-- ============================================
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nutrition_plan_id UUID REFERENCES nutrition_plans(id) ON DELETE SET NULL,
  
  log_date DATE NOT NULL,
  
  -- Totais do dia
  calories_consumed INTEGER,
  protein_consumed INTEGER,
  carbs_consumed INTEGER,
  fats_consumed INTEGER,
  water_intake_ml INTEGER,
  
  -- Refeições (JSON)
  meals_data JSONB,
  
  -- Contadores
  meals_logged INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, log_date)
);

-- ============================================
-- TABELA: progress_tracking
-- Acompanhamento de evolução física
-- ============================================
CREATE TABLE IF NOT EXISTS progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  tracking_date DATE NOT NULL,
  
  -- Medidas corporais
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(5,2),
  muscle_mass DECIMAL(5,2),
  
  -- Medidas específicas (cm)
  chest_cm DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  hips_cm DECIMAL(5,2),
  left_arm_cm DECIMAL(5,2),
  right_arm_cm DECIMAL(5,2),
  left_leg_cm DECIMAL(5,2),
  right_leg_cm DECIMAL(5,2),
  
  -- Fotos de progresso
  front_photo_url TEXT,
  side_photo_url TEXT,
  back_photo_url TEXT,
  
  -- Notas
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, tracking_date)
);

-- ============================================
-- TABELA: notifications
-- Sistema de notificações
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Dados adicionais (JSON)
  data JSONB,
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Ação
  action_url TEXT,
  action_label VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- ============================================
-- TABELA: subscriptions
-- Histórico de assinaturas
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  plan VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  
  -- Valores
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Período
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  
  -- Pagamento
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50),
  payment_id VARCHAR(255),
  
  -- Cancelamento
  canceled_at TIMESTAMP,
  cancellation_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA: payments
-- Histórico de pagamentos
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  status VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50),
  
  -- IDs externos
  provider_payment_id VARCHAR(255),
  provider_customer_id VARCHAR(255),
  
  -- Metadata
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA: analytics_events
-- Eventos de analytics e tracking
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(50),
  
  -- Dados do evento (JSON)
  event_data JSONB,
  
  -- Contexto
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Workout logs
CREATE INDEX idx_workout_logs_user_date ON workout_logs(user_id, workout_date DESC);
CREATE INDEX idx_workout_logs_plan ON workout_logs(workout_plan_id);

-- Exercise progress
CREATE INDEX idx_exercise_progress_user_exercise ON exercise_progress(user_id, exercise_name);
CREATE INDEX idx_exercise_progress_date ON exercise_progress(workout_date DESC);

-- Nutrition logs
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs(user_id, log_date DESC);
CREATE INDEX idx_nutrition_logs_plan ON nutrition_logs(nutrition_plan_id);

-- Progress tracking
CREATE INDEX idx_progress_tracking_user_date ON progress_tracking(user_id, tracking_date DESC);

-- Notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

-- Payments
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Analytics
CREATE INDEX idx_analytics_user_event ON analytics_events(user_id, event_name);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON workout_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_logs_updated_at BEFORE UPDATE ON workout_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_plans_updated_at BEFORE UPDATE ON nutrition_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_logs_updated_at BEFORE UPDATE ON nutrition_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

/**
 * Schema para Row Level Security (RLS)
 */
export const RLS_POLICIES = `
-- Habilita RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para workout_plans
CREATE POLICY "Users can view own workout plans" ON workout_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout plans" ON workout_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout plans" ON workout_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para workout_logs
CREATE POLICY "Users can view own workout logs" ON workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs" ON workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout logs" ON workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para nutrition_plans
CREATE POLICY "Users can view own nutrition plans" ON nutrition_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition plans" ON nutrition_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para nutrition_logs
CREATE POLICY "Users can view own nutrition logs" ON nutrition_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs" ON nutrition_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs" ON nutrition_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para progress_tracking
CREATE POLICY "Users can view own progress" ON progress_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON progress_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);
`;
