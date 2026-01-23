
-- Script SQL Atualizado para incluir controle de acesso da Cakto

-- 1. Profiles (Perfil do Usuário expandido)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users, 
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  has_vital_access BOOLEAN DEFAULT false,
  cakto_payload JSONB,
  last_purchase_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários comuns
CREATE POLICY "Users can view their own profile" ON profiles 
  FOR SELECT USING (auth.uid() = user_id OR (auth.jwt()->>'email') = email);

-- Política para o Yuri (Administrador) gerenciar via App
CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING ((auth.jwt()->>'email') = 'yurirechcerri@gmail.com' OR email = 'yurirechcerri@gmail.com');

-- 2. Content Library
CREATE TYPE content_type AS ENUM ('7_days', '21_days', 'morning');

CREATE TABLE IF NOT EXISTS content_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id TEXT NOT NULL,
  type content_type NOT NULL,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  verse TEXT NOT NULL,
  reference TEXT NOT NULL,
  reflection TEXT,
  prayer TEXT,
  task_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(journey_id, day_number)
);

ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for content" ON content_library FOR SELECT USING (true);

-- 3. User Tracking
CREATE TABLE IF NOT EXISTS user_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  content_id UUID REFERENCES content_library NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  notes TEXT,
  intention TEXT,
  UNIQUE(user_id, content_id)
);

ALTER TABLE user_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tracking" ON user_tracking 
  FOR ALL USING (auth.uid() = user_id);
