import { useEffect, useState } from 'react';

const FONT_SIZES = ['normal', 'large', 'xl'] as const;
type FontSize = typeof FONT_SIZES[number];

const FONT_SIZE_CLASSES = {
  normal: 'text-base',
  large: 'text-lg',
  xl: 'text-xl'
} as const;

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const stored = localStorage.getItem('fontSize');
    return (stored as FontSize) || 'normal';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Remover todas las clases de tamaño
    Object.values(FONT_SIZE_CLASSES).forEach(className => {
      root.classList.remove(className);
    });
    // Agregar la clase correspondiente
    root.classList.add(FONT_SIZE_CLASSES[fontSize]);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  return {
    fontSize,
    FONT_SIZES,
    setFontSize,
  };
}