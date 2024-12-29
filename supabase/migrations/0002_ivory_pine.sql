/*
  # Create units and materials tables

  1. New Tables
    - `unidades`
      - `id` (uuid, primary key)
      - `asignatura_id` (uuid, foreign key)
      - `nombre` (text)
      - `descripcion` (text, nullable)
      - `orden` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `materiales`
      - `id` (uuid, primary key)
      - `unidad_id` (uuid, foreign key)
      - `nombre` (text)
      - `descripcion` (text, nullable)
      - `tipo` (text)
      - `url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create unidades table
CREATE TABLE IF NOT EXISTS unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asignatura_id UUID NOT NULL REFERENCES asignaturas(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  orden INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create materiales table
CREATE TABLE IF NOT EXISTS materiales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_id UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('documento', 'video', 'enlace', 'otro')),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;

-- Create policies for unidades
CREATE POLICY "Unidades are viewable by authenticated users"
  ON unidades
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Unidades are editable by admin and profesor"
  ON unidades
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM usuarios WHERE role IN ('admin', 'profesor')
    )
  );

-- Create policies for materiales
CREATE POLICY "Materiales are viewable by authenticated users"
  ON materiales
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Materiales are editable by admin and profesor"
  ON materiales
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM usuarios WHERE role IN ('admin', 'profesor')
    )
  );

-- Create indexes
CREATE INDEX idx_unidades_asignatura ON unidades(asignatura_id);
CREATE INDEX idx_materiales_unidad ON materiales(unidad_id);