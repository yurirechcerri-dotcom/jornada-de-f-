
-- 1. Tabela de Perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE, 
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  has_vital_access BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Desabilitar RLS para simplificar ao máximo como solicitado
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Trigger para criar perfil automaticamente ao cadastrar no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (new.id, new.email, split_part(new.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger se já existir para não dar erro ao rodar de novo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Content Library (Acesso Público)
CREATE TABLE IF NOT EXISTS content_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id TEXT NOT NULL,
  type TEXT NOT NULL,
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
ALTER TABLE content_library DISABLE ROW LEVEL SECURITY;

-- 4. User Tracking (Acesso Público)
CREATE TABLE IF NOT EXISTS user_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  user_email TEXT,
  content_id UUID REFERENCES content_library NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  notes TEXT,
  intention TEXT
);
ALTER TABLE user_tracking DISABLE ROW LEVEL SECURITY;
