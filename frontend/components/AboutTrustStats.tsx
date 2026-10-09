"use client";

import { useEffect, useRef, useState } from "react";
import {
  PartyPopper,
  Clock,
  Users,
  Star,
} from "lucide-react";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
};

const stats: Stat[] = [
  {
    label: "EVENTS COMPLETED",
    value: 500,
    suffix: "+",
    icon: <PartyPopper className="w-8 h-8 text-gray-500" />,
  },
  {
    label: "YEARS EXPERIENCE",
    value: 10,
    suffix: "+",
    icon: <Clock className="w-8 h-8 text-gray-500" />,
  },
  {
    label: "HAPPY CLIENTS",
    value: 300,
    suffix: "+",
    icon: <Users className="w-8 h-8 text-gray-500" />,
  },
  {
    label: "CLIENT SATISFACTION",
    value: 100,
    suffix: "%",
    icon: <Star className="w-8 h-8 text-gray-500" />,
  },
];

const TrustStats = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  /* 👁️ Scroll trigger */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* 🔢 Count animation */
  useEffect(() => {
    if (!visible) return;

    stats.forEach((stat, i) => {
      const duration = 1500;
      const startTime = performance.now();

      function animate(time: number) {
        const progress = Math.min((time - startTime) / duration, 1);
        const value = Math.floor(progress * stat.value);

        setCounts((prev) => {
          const updated = [...prev];
          updated[i] = value;
          return updated;
        });

        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    });
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-white overflow-hidden mb-20 mt-20"
    >
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        {/* <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            Trusted Excellence
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Proven Event Decoration Expertise
          </h2>
        </div> */}

        <div className="relative mb-10">
            <h1 className="absolute -top-24 right-0 text-[140px] font-bold text-gray-100 select-none">
              05
            </h1>

            <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Trusted Excellence
            </p>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Proven Event Decoration Expertise
            </h2>
          </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 mt-20 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">
                {stat.icon}
              </div>

              {/* Number */}
              <h3 className="text-5xl font-bold text-gray-700">
                {counts[i]}
                {stat.suffix}
              </h3>

              {/* Label */}
              <p className="mt-3 text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { TrustStats, TrustStats as AboutTrustStats };
export default TrustStats;
