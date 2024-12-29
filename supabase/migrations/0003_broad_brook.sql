/*
  # Add inscripciones table

  1. New Tables
    - `inscripciones`
      - `id` (uuid, primary key)
      - `seccion_id` (uuid, references secciones)
      - `alumno_id` (uuid, references usuarios)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `inscripciones` table
    - Add policies for authenticated users
*/

-- Create inscripciones table
CREATE TABLE IF NOT EXISTS inscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_id UUID NOT NULL REFERENCES secciones(id) ON DELETE CASCADE,
  alumno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(seccion_id, alumno_id)
);

-- Enable RLS
ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Inscripciones are viewable by authenticated users"
  ON inscripciones
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Inscripciones are editable by admin and profesor"
  ON inscripciones
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM usuarios WHERE role IN ('admin', 'profesor')
    )
  );

-- Create indexes
CREATE INDEX idx_inscripciones_seccion ON inscripciones(seccion_id);
CREATE INDEX idx_inscripciones_alumno ON inscripciones(alumno_id);