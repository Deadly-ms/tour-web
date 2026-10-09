"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ScrollBlurProps = {
  children: React.ReactNode;
};

const ScrollBlur = ({ children }: ScrollBlurProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0.85 1", "0.25 1"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], ["8px", "0px"]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        filter: blur,
        y,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollBlur;
