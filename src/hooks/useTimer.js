import { useEffect, useRef } from "react";

export default function useStoryTimer(active, index, onNext) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    timerRef.current = setTimeout(() => {
      onNext();
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [index, active]);
}
