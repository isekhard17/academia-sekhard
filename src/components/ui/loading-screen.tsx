import { Loader2 } from 'lucide-react';
import { AnimatedBackground } from './animated-background';

export function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <AnimatedBackground />
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    </div>
  );
}