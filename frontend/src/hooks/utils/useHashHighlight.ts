import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const useHashHighlight = (
  targetHash: string,
  highlightDuration = 2000,
) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkForHighlight = () => {
      const currentLocation = router.state.location;
      const hash = currentLocation.hash;

      if (hash === targetHash) {
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), highlightDuration);
      } else {
        setIsHighlighted(false);
      }
    };

    // Check on mount and when router state changes
    checkForHighlight();

    // Subscribe to router state changes
    const unsubscribe = router.subscribe("onBeforeLoad", () => {
      checkForHighlight();
    });

    return unsubscribe;
  }, [targetHash, highlightDuration, router]);

  return isHighlighted;
};
