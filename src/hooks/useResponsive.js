// src/hooks/useResponsive.js
import { useState, useEffect } from 'react';

/**
 * Custom Hook untuk mendeteksi apakah ukuran layar perangkat berada dalam mode mobile/tablet (<= breakpoint px)
 * @param {number} breakpoint - Ambang batas piksel lebar layar (default: 768)
 * @returns {boolean} Status boolean true jika mobile/tablet
 */
export default function useResponsive(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
