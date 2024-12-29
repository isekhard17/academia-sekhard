import { ReactNode } from 'react';
import { Sidebar } from './student-sidebar';
import { ThemeControls } from '../ui/theme-controls';
import { Breadcrumb } from '../ui/breadcrumb';
import { AnimatedBackground } from '../ui/animated-background';

interface StudentLayoutProps {
  children: ReactNode;
  title?: string;
}

export function StudentLayout({ children, title = 'Panel de Alumno' }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AnimatedBackground />
      <Sidebar />
      <div className="lg:pl-72">
        <div className="sticky top-0 z-30 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Breadcrumb
                items={[
                  { label: 'Alumno' },
                  { label: title },
                ]}
              />
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </h1>
            </div>
            <ThemeControls />
          </div>
        </div>
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}