import { motion } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { ModalContainer } from '../../ui/modal-container';

interface DisableUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isDisabling: boolean;
}

export function DisableUserDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isDisabling
}: DisableUserDialogProps) {
  if (!isOpen) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {isDisabling ? 'Deshabilitar' : 'Habilitar'} Usuario
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              ¿Estás seguro que deseas {isDisabling ? 'deshabilitar' : 'habilitar'} al usuario{' '}
              <span className="font-medium">{userName}</span>?
              {isDisabling && (
                ' El usuario no podrá acceder al sistema hasta que sea habilitado nuevamente.'
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isDisabling
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isDisabling ? 'Deshabilitar' : 'Habilitar'} Usuario
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}