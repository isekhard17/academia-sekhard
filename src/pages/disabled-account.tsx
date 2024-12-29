import { motion } from 'framer-motion';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/auth.context';
import { AnimatedBackground } from '../components/ui/animated-background';
import { ThemeControls } from '../components/ui/theme-controls';
import { Logo } from '../components/ui/logo';

export function DisabledAccountPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <AnimatedBackground />
      <ThemeControls />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/10 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-black/5 dark:border-white/20">
          <div className="flex flex-col items-center gap-4 text-center">
            <Logo />
            
            <div className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-full">
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Cuenta Deshabilitada
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Estimado {user?.nombre} {user?.apellido}, tu cuenta se encuentra temporalmente deshabilitada.
                Por favor, contacta al administrador del sistema para más información.
              </p>
            </div>

            <div className="w-full max-w-xs mt-4">
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}