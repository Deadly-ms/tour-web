"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ParallaxSection = ({ children }: { children: any }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Apple-like subtle parallax
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div
        style={{ y, opacity }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default ParallaxSection;
