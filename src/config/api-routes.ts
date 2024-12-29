export const API_ROUTES = {
  validations: {
    asignaturas: {
      checkDuplicate: '/validations/asignaturas/check-duplicate'
    },
    // Fácil de escalar agregando más rutas
    usuarios: {
      checkDuplicate: '/validations/usuarios/check-duplicate'
    }
  },
  asignaturas: {
    create: '/asignaturas',
    update: (id: string) => `/asignaturas/${id}`,
    delete: (id: string) => `/asignaturas/${id}`,
    list: '/asignaturas'
  }
  // Fácil de agregar más módulos
} as const;

// Type helper para obtener las rutas
export type ApiRoute = typeof API_ROUTES;
