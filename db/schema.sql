
-- Script SQL Atualizado para o Supabase

-- 1. Profiles (Perfil do Usuário)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- 2. Content Library (Expandida com journey_id)
CREATE TYPE content_type AS ENUM ('7_days', '21_days', 'morning');

CREATE TABLE content_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id TEXT NOT NULL, -- Slug identificador da jornada (ex: 'gratitude_7', 'pardon_7')
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

-- 3. User Tracking (Progresso e Histórico)
CREATE TABLE user_tracking (
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

-- 4. Exemplo de Inserção: Jornada de Gratidão (Dia 1)
INSERT INTO content_library (journey_id, type, day_number, title, verse, reference, reflection, prayer, task_json)
VALUES (
  'gratitude_7',
  '7_days', 
  1, 
  'O Despertar da Gratidão', 
  'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.', 
  '1 Tessalonicenses 5:18', 
  'A gratidão não é um sentimento que depende das circunstâncias, mas uma lente que escolhemos usar para enxergar a bondade de Deus em cada detalhe.',
  'Senhor, hoje eu Te agradeço pelo fôlego de vida e pela oportunidade de recomeçar com um coração grato.',
  '{"task": "Liste 5 coisas simples que você costuma ignorar, mas pelas quais é grato hoje."}'
);
