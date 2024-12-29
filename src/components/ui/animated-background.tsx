import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height } = container.getBoundingClientRect();
      const x = clientX / width;
      const y = clientY / height;

      container.style.setProperty('--mouse-x', `${x}`);
      container.style.setProperty('--mouse-y', `${y}`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden bg-gray-50 dark:bg-[#0B0F1A]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,0.5)_var(--mouse-y,0.5),rgba(79,70,229,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_var(--mouse-x,0.5)_var(--mouse-y,0.5),rgba(79,70,229,0.15),transparent_50%)]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_25%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.3),transparent_25%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(79,70,229,0.1),transparent_25%)] dark:bg-[radial-gradient(circle_at_20%_80%,rgba(79,70,229,0.2),transparent_25%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <div className="absolute h-[200px] w-[200px] rounded-full bg-indigo-500/20 dark:bg-indigo-500/30 blur-[120px] -top-10 -right-10" />
        <div className="absolute h-[200px] w-[200px] rounded-full bg-purple-500/20 dark:bg-purple-500/30 blur-[120px] -bottom-10 -left-10" />
      </motion.div>
    </div>
  );
}