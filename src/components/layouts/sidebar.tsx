import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/auth.context';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  LayoutGrid,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '../ui/logo';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', exact: true },
  { name: 'Usuarios', icon: Users, path: '/admin/users' },
  { name: 'Profesores', icon: GraduationCap, path: '/admin/teachers' },
  { name: 'Asignaturas', icon: BookOpen, path: '/admin/asignaturas' },
  { name: 'Secciones', icon: LayoutGrid, path: '/admin/secciones' },
  { name: 'Configuración', icon: Settings, path: '/admin/settings' },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isCurrentPath = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3">
        <Logo />
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Intranet Academia
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Panel de Administración
          </p>
        </div>
        <button
          type="button"
          className="lg:hidden ml-auto text-gray-600 dark:text-gray-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
              isCurrentPath(item.path, item.exact)
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {user?.nombre[0]}
                {user?.apellido[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-200" />
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className="fixed top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}