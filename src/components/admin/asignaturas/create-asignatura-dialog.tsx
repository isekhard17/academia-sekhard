import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, BookOpen, Info, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { ModalContainer } from '../../ui/modal-container';
import { asignaturasApi } from '../../../services/api';
import { validationsApi } from '../../../services/api/validations';

interface CreateAsignaturaDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Definir tipos para el formulario
interface FormData {
  codigo: string;
  nombre: string;
  descripcion: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type ValidFields = 'codigo' | 'nombre';

// Separamos los schemas para validación local
const schemas = {
  codigo: z
    .string()
    .min(5, 'El código debe tener al menos 5 caracteres')
    .max(10, 'El código no puede tener más de 10 caracteres')
    .regex(
      /^[A-Z]{2,3}\d{2,4}$/i,
      'El código debe tener 2-3 letras seguidas de 2-4 números (Ej: TI2024)'
    ),
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(
      /^[A-ZÁÉÍÓÚÑa-záéíóúñ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    )
};

export function CreateAsignaturaDialog({ open, onClose, onSuccess }: CreateAsignaturaDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    nombre: '',
    descripcion: ''
  });
  const [isValidating, setIsValidating] = useState(false);

  const validateField = async (name: ValidFields, value: string) => {
    try {
      setIsValidating(true);
      
      // Validación local primero
      if (!value.trim()) {
        setErrors(prev => ({
          ...prev,
          [name]: `El ${name === 'codigo' ? 'código' : 'nombre'} es requerido`
        }));
        return false;
      }

      // Validación con la API
      const validation = await validationsApi.checkAsignatura(name, value.trim());
      
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          [name]: validation.message
        }));
        return false;
      }

      // Si todo está bien, limpiamos el error
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;

    } catch (error) {
      console.error('Error en validación:', error);
      setErrors(prev => ({
        ...prev,
        [name]: 'Error al validar el campo'
      }));
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'codigo' || name === 'nombre') {
      await validateField(name as ValidFields, value);
    }
  };

  const handleNextStep = async () => {
    const isCodigoValid = await validateField('codigo', formData.codigo);
    const isNombreValid = await validateField('nombre', formData.nombre);

    if (isCodigoValid && isNombreValid) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validación final de todos los campos
      await schemas.codigo.parseAsync(formData.codigo);
      await schemas.nombre.parseAsync(formData.nombre);
      
      // Verificar duplicados una última vez
      const [codigoValidation, nombreValidation] = await Promise.all([
        validationsApi.checkAsignatura('codigo', formData.codigo),
        validationsApi.checkAsignatura('nombre', formData.nombre)
      ]);

      if (!codigoValidation.isValid) {
        throw new Error(codigoValidation.message);
      }
      if (!nombreValidation.isValid) {
        throw new Error(nombreValidation.message);
      }

      await asignaturasApi.create(formData);
      toast.success('Asignatura creada exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.errors.reduce<FormErrors>((acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message
          }), {})
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al crear la asignatura');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Componente de mensaje de error
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 mt-1 animate-fadeIn">
      <AlertCircle className="h-4 w-4 text-red-500" />
      <p className="text-sm text-red-600 dark:text-red-400">
        {message}
      </p>
    </div>
  );

  if (!open) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Crear Nueva Asignatura
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                    ${step >= item
                      ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                >
                  <span className={`text-sm font-medium
                    ${step >= item
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {item}
                  </span>
                </div>
                {item === 1 && (
                  <div className={`w-24 h-0.5 mx-2
                    ${step > 1
                      ? 'bg-indigo-500 dark:bg-indigo-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              Información Básica
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
              Detalles Adicionales
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor="codigo" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Código de Asignatura
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="codigo"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`
                        block w-full rounded-md shadow-sm sm:text-sm transition-colors duration-200
                        ${errors.codigo 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }
                        dark:bg-gray-700 dark:border-gray-600
                      `}
                      placeholder="Ej: TI2024"
                    />
                    {isValidating && (
                      <div className="absolute right-2 top-2">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  {errors.codigo && <ErrorMessage message={errors.codigo} />}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    El código debe tener 2-3 letras seguidas de 2-4 números
                  </p>
                </div>

                <div>
                  <label 
                    htmlFor="nombre" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nombre de la Asignatura
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`
                        block w-full rounded-md shadow-sm sm:text-sm transition-colors duration-200
                        ${errors.nombre 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }
                        dark:bg-gray-700 dark:border-gray-600
                      `}
                      placeholder="Ej: Programación Orientada a Objetos"
                    />
                    {isValidating && (
                      <div className="absolute right-2 top-2">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  {errors.nombre && <ErrorMessage message={errors.nombre} />}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Tips para crear una asignatura
                    </h4>
                    <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1">
                      <li>Use códigos claros y consistentes</li>
                      <li>El nombre debe ser descriptivo y conciso</li>
                      <li>Evite abreviaturas innecesarias</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div>
                <label 
                  htmlFor="descripcion" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Descripción
                </label>
                <div className="mt-1">
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="block w-full rounded-md shadow-sm sm:text-sm 
                             border-gray-300 focus:border-indigo-500 focus:ring-indigo-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Describe los objetivos y contenidos principales de la asignatura..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  La descripción es opcional pero ayuda a entender mejor el propósito de la asignatura
                </p>
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                Anterior
              </button>
            ) : (
              <div />
            )}
            
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isValidating || Object.keys(errors).length > 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 
                         hover:bg-indigo-600 rounded-md disabled:opacity-50 
                         disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 
                         hover:bg-indigo-600 rounded-md disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Asignatura'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </ModalContainer>
  );
}