import { useRef, useState } from 'react';

const SWIPE_THRESHOLD = 72;

interface UseSwipeOptions {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  enabled?: boolean;
}

export function useSwipe({ onSwipeRight, onSwipeLeft, enabled = true }: UseSwipeOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);
  const offsetRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);

  function onTouchStart(e: React.TouchEvent) {
    if (!enabled) return;
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    tracking.current = true;
    offsetRef.current = 0;
    setOffsetX(0);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!enabled || !tracking.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;
    if (Math.abs(dy) > Math.abs(dx)) {
      tracking.current = false;
      offsetRef.current = 0;
      setOffsetX(0);
      return;
    }
    offsetRef.current = dx;
    setOffsetX(dx);
  }

  function onTouchEnd() {
    if (!enabled || !tracking.current) {
      setOffsetX(0);
      return;
    }
    tracking.current = false;

    const dx = offsetRef.current;
    if (dx > SWIPE_THRESHOLD) {
      onSwipeRight?.();
    } else if (dx < -SWIPE_THRESHOLD) {
      onSwipeLeft?.();
    }
    offsetRef.current = 0;
    setOffsetX(0);
  }

  return {
    offsetX,
    swipeHandlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
