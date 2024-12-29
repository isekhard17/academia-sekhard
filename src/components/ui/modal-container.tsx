import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModalContainerProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function ModalContainer({ children, onClose, className = '' }: ModalContainerProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      />
      <div className="fixed inset-0 overflow-y-auto z-[101]">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl ${className}`}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
}