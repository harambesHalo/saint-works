'use client';

import { useEffect, useState } from 'react';
import { DeviceContext } from '@/lib/contexts/DeviceContext';

export function DeviceProvider({ children }) {
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isClient: false
  });

  useEffect(() => {
    // Mark that we're now on the client side
    setDeviceType(prev => ({ ...prev, isClient: true }));

    const checkDeviceType = () => {
      const isMobile = window.innerWidth < 768;
      setDeviceType(prev => ({ ...prev, isMobile }));
    };

    // Initial check
    checkDeviceType();

    // Listen for window resize events
    window.addEventListener('resize', checkDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return (
    <DeviceContext.Provider value={deviceType}>
      {children}
    </DeviceContext.Provider>
  );
}

export default DeviceProvider;