import { useContext } from 'react';
import { DeviceContext } from '../contexts/DeviceContext';

export function useDeviceContext() {
  return useContext(DeviceContext);
}