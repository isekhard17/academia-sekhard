export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          apellido: string
          role: 'admin' | 'profesor' | 'alumno'
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nombre: string
          apellido: string
          role?: 'admin' | 'profesor' | 'alumno'
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          apellido?: string
          role?: 'admin' | 'profesor' | 'alumno'
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      asignaturas: {
        Row: {
          id: string
          codigo: string
          nombre: string
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nombre: string
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          nombre?: string
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      secciones: {
        Row: {
          id: string
          asignatura_id: string
          profesor_id: string
          periodo: string
          ano: number
          cupo_maximo: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          asignatura_id: string
          profesor_id: string
          periodo: string
          ano: number
          cupo_maximo?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          asignatura_id?: string
          profesor_id?: string
          periodo?: string
          ano?: number
          cupo_maximo?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      inscripciones: {
        Row: {
          id: string
          seccion_id: string
          alumno_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seccion_id: string
          alumno_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seccion_id?: string
          alumno_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      unidades: {
        Row: {
          id: string
          asignatura_id: string
          nombre: string
          descripcion: string | null
          orden: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          asignatura_id: string
          nombre: string
          descripcion?: string | null
          orden: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          asignatura_id?: string
          nombre?: string
          descripcion?: string | null
          orden?: number
          created_at?: string
          updated_at?: string
        }
      }
      materiales: {
        Row: {
          id: string
          unidad_id: string
          nombre: string
          descripcion: string | null
          tipo: 'documento' | 'video' | 'enlace' | 'otro'
          url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unidad_id: string
          nombre: string
          descripcion?: string | null
          tipo: 'documento' | 'video' | 'enlace' | 'otro'
          url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unidad_id?: string
          nombre?: string
          descripcion?: string | null
          tipo?: 'documento' | 'video' | 'enlace' | 'otro'
          url?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}