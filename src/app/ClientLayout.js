"use client";
import { useDeviceContext } from '../lib/hooks/useDeviceContext';
import { useDevice } from '../lib/hooks/useDevice';
import { DeviceProvider } from '../providers/DeviceProvider';

import Header from '../components/Header';

function LayoutContent({ children }) {
  const { isMobile, isClient } = useDeviceContext();
  const { deviceType } = useDevice();
  
  deviceType ? console.log("User is Mobile", deviceType) : console.log("User not Mobile", deviceType);

  return (
    <div className="flex flex-col h-screen min-h-screen w-full">
      <Header />
      <main className="main">{children}</main>
    </div>
  );
}

const ClientLayout = ({ children }) => {
  return (
    <DeviceProvider>
      <LayoutContent>{children}</LayoutContent>
    </DeviceProvider>
  );
}

export default ClientLayout;