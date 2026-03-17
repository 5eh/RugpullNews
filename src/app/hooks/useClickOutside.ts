"use client";

import { RefObject, useEffect, useCallback, useRef } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const stableHandler = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      handlerRef.current();
    }
  }, [ref]);

  useEffect(() => {
    document.addEventListener("mousedown", stableHandler);
    return () => document.removeEventListener("mousedown", stableHandler);
  }, [stableHandler]);
}
