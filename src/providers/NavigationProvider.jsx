'use client';
import { createContext, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import LiquidTransition from '../components/Transitions/liquid/LiquidTransition';

// Create context
const NavigationContext = createContext({
  isNavigating: false,
  navigateTo: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export default function NavigationProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const nextPathRef = useRef(null);
  const router = useRouter();

  // Function to handle navigation with transition
  const navigateTo = (path) => {
    // Don't trigger navigation if already navigating
    if (isNavigating) return;
    
    // Store the target path in a ref for later use
    nextPathRef.current = path;
    
    // Start the transition animation
    setIsNavigating(true);
  };
  
  // Called when the transition animation is at the midpoint
  // This is the key change - we navigate during the transition, not after
  const handleTransitionMidpoint = () => {
    if (nextPathRef.current) {
      // Perform the actual navigation during the transition
      router.push(nextPathRef.current);
    }
  };
  
  // Called when the transition is fully complete
  const handleTransitionComplete = () => {
    // Reset navigation state
    setIsNavigating(false);
    nextPathRef.current = null;
  };

  return (
    <NavigationContext.Provider value={{ isNavigating, navigateTo }}>
      {children}
      <AnimatePresence mode="wait">
        {isNavigating && (
          <LiquidTransition 
            onMidpoint={handleTransitionMidpoint} 
            onComplete={handleTransitionComplete} 
          />
        )}
      </AnimatePresence>
    </NavigationContext.Provider>
  );
}