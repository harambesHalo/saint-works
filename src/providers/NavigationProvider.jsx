'use client';
import { createContext, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import LiquidTransition from '../components/Transitions/LiquidTransition';

// Create context
const NavigationContext = createContext({
  isNavigating: false,
  navigateTo: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export default function NavigationProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [nextPath, setNextPath] = useState(null);
  const router = useRouter();

  // Function to handle navigation with transition
  const navigateTo = (path) => {
    // Don't trigger navigation if already navigating
    if (isNavigating) return;
    
    setIsNavigating(true);
    setNextPath(path);
  };
  
  // Called when the liquid transition is complete
  const handleTransitionComplete = () => {
    if (nextPath) {
      // Perform the actual navigation
      router.push(nextPath);
      
      // Reset navigation state after a delay to ensure smooth transition
      setTimeout(() => {
        setIsNavigating(false);
        setNextPath(null);
      }, 100);
    }
  };

  return (
    <NavigationContext.Provider value={{ isNavigating, navigateTo }}>
      <AnimatePresence mode="wait">
        {isNavigating && (
          <LiquidTransition onComplete={handleTransitionComplete} />
        )}
      </AnimatePresence>
      {children}
    </NavigationContext.Provider>
  );
}