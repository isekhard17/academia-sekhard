import { api } from '../../lib/axios';
import { env } from '../../config/env';

interface ValidationResponse {
    isValid: boolean;
    message: string;
  }
  
  export const validationsApi = {
    checkAsignatura: async (field: string, value: string): Promise<ValidationResponse> => {
      try {
        const response = await api.get<ValidationResponse>(
          env.api.endpoints.validations.asignaturas.checkDuplicate,
          {
            params: { field, value }
          }
        );
  
        const result = response.data || response;
        
        if (typeof result === 'object' && 'isValid' in result) {
          return result as ValidationResponse;
        }
  
        throw new Error('Formato de respuesta inválido');
  
      } catch (error) {
        return {
          isValid: false,
          message: error instanceof Error 
            ? error.message 
            : 'Error de conexión con el servidor'
        };
      }
    }
  };
  
  export type { ValidationResponse };