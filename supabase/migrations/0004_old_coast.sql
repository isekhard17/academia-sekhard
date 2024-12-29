/*
  # Add sections schema

  1. New Tables
    - `secciones`
      - `id` (uuid, primary key)
      - `asignatura_id` (uuid, references asignaturas)
      - `profesor_id` (uuid, references usuarios)
      - `periodo` (text)
      - `ano` (integer)
      - `cupo_maximo` (integer)
      - `activo` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `secciones` table
    - Add policies for authenticated users
*/

-- Create secciones table
CREATE TABLE IF NOT EXISTS secciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asignatura_id UUID NOT NULL REFERENCES asignaturas(id) ON DELETE CASCADE,
  profesor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  periodo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  cupo_maximo INTEGER NOT NULL DEFAULT 30,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE secciones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Secciones are viewable by authenticated users"
  ON secciones
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Secciones are editable by admin and profesor"
  ON secciones
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM usuarios WHERE role IN ('admin', 'profesor')
    )
  );

-- Create indexes
CREATE INDEX idx_secciones_asignatura ON secciones(asignatura_id);
CREATE INDEX idx_secciones_profesor ON secciones(profesor_id);
CREATE INDEX idx_secciones_activo ON secciones(activo);