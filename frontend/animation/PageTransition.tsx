"use client";

import { motion } from "framer-motion";

const PageTransition = ({ children }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1], // Apple-like easing
        },
      }}
      exit={{
        opacity: 0,
        y: -16,
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 1, 1],
        },
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
