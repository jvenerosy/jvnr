'use client';

import { useEffect, useRef } from 'react';

export const useScrollLock = (isLocked: boolean) => {
  const originalOverflow = useRef<string>('');

  useEffect(() => {
    if (isLocked) {
      // Sauvegarder le style overflow original
      originalOverflow.current = document.body.style.overflow;
      
      // Bloquer le scroll en cachant la scrollbar
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurer le style overflow original
        document.body.style.overflow = originalOverflow.current;
      };
    }
  }, [isLocked]);
};