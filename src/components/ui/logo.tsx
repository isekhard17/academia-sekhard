import { motion } from 'framer-motion';
import { Code2, Blocks, Binary } from 'lucide-react';

export function Logo() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="relative w-16 h-16"
    >
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 opacity-50"
      >
        <Blocks className="w-full h-full text-indigo-500" />
      </motion.div>
      
      <motion.div
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 opacity-50"
      >
        <Binary className="w-full h-full text-purple-500" />
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Code2 className="w-8 h-8 text-white" />
      </motion.div>
    </motion.div>
  );
}