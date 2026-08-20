import { useCallback, useRef } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";

interface LongPressOptions {
  onLongPress: () => void;
  onClick: () => void;
  /** How long a press must last to count as "inspect" rather than "insert". */
  delay?: number;
}

/**
 * Tap to insert, press-and-hold to look up.
 *
 * Right-click already means "define" on desktop; long-press is its direct
 * touch analogue, and touch has no other way to reach a second action.
 */
export function useLongPress({
  onLongPress,
  onClick,
  delay = 450,
}: LongPressOptions) {
  const timer = useRef<number | null>(null);
  const longPressed = useRef(false);

  const cancel = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(
    (e: PointerEvent) => {
      // Ignore secondary buttons; contextmenu handles those.
      if (e.button !== 0) return;
      longPressed.current = false;
      cancel();
      timer.current = window.setTimeout(() => {
        longPressed.current = true;
        onLongPress();
      }, delay);
    },
    [cancel, delay, onLongPress]
  );

  const finish = useCallback(() => {
    cancel();
    // A completed long-press already did its job; don't also insert the word.
    if (!longPressed.current) onClick();
  }, [cancel, onClick]);

  return {
    onPointerDown: start,
    onPointerUp: finish,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e: MouseEvent) => {
      e.preventDefault();
      cancel();
      onLongPress();
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    },
  };
}
