"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Layer {
  src: string;
  depth: number; // smaller = slower, bigger = faster
  className?: string;
}

interface ImageDepthParallaxProps {
  layers: Layer[];
  height?: string;
}

const ImageDepthParallax = ({
  layers,
  height = "h-[80vh]",
}: ImageDepthParallaxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${height}`}
    >
      {layers.map((layer, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          ["0%", `${layer.depth}%`]
        );

        return (
          <motion.img
            key={index}
            src={layer.src}
            alt=""
            style={{ y }}
            className={`absolute inset-0 w-full h-full object-cover ${layer.className}`}
          />
        );
      })}
    </div>
  );
};

export default ImageDepthParallax;
