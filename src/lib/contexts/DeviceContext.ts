import { createContext } from 'react';

export type DeviceContextType = {
  isMobile: boolean;
  isClient: boolean; // Add this to track if we're on client side
};

export const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  isClient: false
});