import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ArrowLeft,
  Plus,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Unidad } from '../../../types/units';
import { CreateUnitDialog } from './create-unit-dialog';
import { EditUnitDialog } from './edit-unit-dialog';

interface UnitsManagementProps {
  unidades: Unidad[];
  isLoading: boolean;
  onUnitCreated: () => void;
  onUnitUpdated: () => void;
}

export function UnitsManagement({
  unidades,
  isLoading,
  onUnitCreated,
  onUnitUpdated
}: UnitsManagementProps) {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unidad | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <button
        onClick={() => navigate('/admin/asignaturas')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Asignaturas
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Gestión de Unidades
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Administra las unidades de la asignatura
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Unidad
            </button>
          </div>

          <div className="mt-6">
            {unidades.length > 0 ? (
              <div className="space-y-4">
                {unidades.map((unidad) => (
                  <div
                    key={unidad.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 cursor-pointer transition-colors"
                    onClick={() => setEditingUnit(unidad)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {unidad.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {unidad.descripcion || 'Sin descripción'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {unidad.materiales.length} materiales
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No hay unidades
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Comienza creando una nueva unidad para esta asignatura usando el botón superior
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateUnitDialog
      open={showCreateDialog}
      asignaturaId={unidades[0]?.asignatura_id}
      onClose={() => setShowCreateDialog(false)}
      onSuccess={() => {
        setShowCreateDialog(false);
        onUnitCreated();
      }}
    />
      <EditUnitDialog
        unit={editingUnit}
        onClose={() => setEditingUnit(null)}
        onSuccess={() => {
          setEditingUnit(null);
          onUnitUpdated();
        }}
      />
    </motion.div>
  );
}