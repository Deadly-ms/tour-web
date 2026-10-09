"use client";

import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import Lenis from "@studio-freight/lenis";
import { useAnimationFrame } from "framer-motion";

const SmoothScroll = ({ children }: PropsWithChildren) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.25,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
    });

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  useAnimationFrame((time) => {
    lenisRef.current?.raf(time);
  });

  return <>{children}</>;
};

export default SmoothScroll;
