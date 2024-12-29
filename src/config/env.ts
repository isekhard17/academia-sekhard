const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const env = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    key: getEnvVar('VITE_SUPABASE_KEY'),
  },
  api: {
    baseUrl: getEnvVar('VITE_API_URL'),
    endpoints: {
      validations: {
        asignaturas: {
          checkDuplicate: '/api/validations/asignaturas/check-duplicate'
        }
      },
      auth: '/api/auth',
      alumnos: '/api/alumnos',
      profesores: '/api/profesores',
      admin: '/api/admin',
      asignaturas: '/api/asignaturas',
      secciones: '/api/secciones',
      evaluaciones: '/api/evaluaciones',
      notas: '/api/notas',
      asistencias: '/api/asistencias',
    }
  }
} as const;