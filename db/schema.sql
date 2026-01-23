
-- 1. Tabela de Perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE, 
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  has_vital_access BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Desabilitar RLS para simplificar
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Trigger atualizada para incluir o acesso vitalício por padrão
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, has_vital_access)
  VALUES (new.id, new.email, split_part(new.email, '@', 1), true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Content e Tracking
ALTER TABLE content_library DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracking DISABLE ROW LEVEL SECURITY;
