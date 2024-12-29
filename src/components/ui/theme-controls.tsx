import { motion } from 'framer-motion';
import { Sun, Moon, Type } from 'lucide-react';
import { useTheme } from '../../hooks/use-theme';
import { useFontSize } from '../../hooks/use-font-size';

export function ThemeControls() {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, FONT_SIZES, setFontSize } = useFontSize();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
        {FONT_SIZES.map((size, index) => (
          <button
            key={size}
            onClick={() => setFontSize(size)}
            className={`p-2 rounded-md ${
              fontSize === size
                ? 'bg-indigo-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={`Tamaño de fuente ${index + 1}`}
          >
            <Type className={`w-4 h-4 ${
              size === 'normal' ? 'scale-75' :
              size === 'large' ? 'scale-90' :
              'scale-100'
            }`} />
          </button>
        ))}
      </div>

      <button
        onClick={toggleTheme}
        className="p-3 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg"
      >
        {theme === 'light' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}