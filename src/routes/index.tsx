import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth.context';
import { AdminDashboard } from '../pages/admin/dashboard';
import { UsersPage } from '../pages/admin/users';
import { TeachersPage } from '../pages/admin/teachers';
import { AsignaturasPage } from '../pages/admin/asignaturas';
import { AsignaturaDetailsPage } from '../pages/admin/asignaturas/[id]';
import { SeccionesPage } from '../pages/admin/secciones';
import { AlumnoDashboard } from '../pages/alumno/dashboard';
import { DisabledAccountPage } from '../pages/disabled-account';
import { LoginPage } from '../pages/login';

export function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!user.activo) {
    return (
      <Routes>
        <Route path="/disabled" element={<DisabledAccountPage />} />
        <Route path="*" element={<Navigate to="/disabled" replace />} />
      </Routes>
    );
  }

  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/teachers" element={<TeachersPage />} />
        <Route path="/admin/asignaturas" element={<AsignaturasPage />} />
        <Route path="/admin/asignaturas/:id" element={<AsignaturaDetailsPage />} />
        <Route path="/admin/secciones" element={<SeccionesPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  if (user.role === 'alumno') {
    return (
      <Routes>
        <Route path="/alumno" element={<AlumnoDashboard />} />
        <Route path="/alumno/secciones/:id" element={<div>Detalles de Sección</div>} />
        <Route path="*" element={<Navigate to="/alumno" replace />} />
      </Routes>
    );
  }

  // Profesor routes
  return (
    <Routes>
      <Route path="/profesor" element={<div>Profesor Dashboard</div>} />
      <Route path="*" element={<Navigate to="/profesor" replace />} />
    </Routes>
  );
}