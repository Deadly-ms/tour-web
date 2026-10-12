"use client";

import { useRef } from "react";
import { Plane, Clock, Users, MapPin } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SectionHeader } from "@/components/animation/SectionHeader";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
};

const stats: Stat[] = [
  {
    label: "TRIPS PLANNED",
    value: 500,
    suffix: "+",
    icon: <Plane className="w-8 h-8 text-gray-500" />,
  },
  {
    label: "YEARS EXPERIENCE",
    value: 10,
    suffix: "+",
    icon: <Clock className="w-8 h-8 text-gray-500" />,
  },
  {
    label: "HAPPY TRAVELLERS",
    value: 300,
    suffix: "+",
    icon: <Users className="w-8 h-8 text-gray-500" />,
  },
  {
    label: "DESTINATIONS COVERED",
    value: 25,
    suffix: "+",
    icon: <MapPin className="w-8 h-8 text-gray-500" />,
  },
];

const TrustStats = () => {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const once = { trigger: grid.current, start: "top 80%", once: true };

        // Stats rise one by one, their top line draws in, icons pop
        gsap.from("[data-stat]", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: once,
        });
        gsap.from("[data-stat-line]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.inOut",
          scrollTrigger: once,
        });
        gsap.from("[data-stat-icon]", {
          scale: 0.4,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(2)",
          scrollTrigger: once,
        });

        // Numbers count up smoothly (no React re-renders)
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.value);
          const suffix = el.dataset.suffix ?? "";
          const obj = { v: 0 };
          el.textContent = `0${suffix}`;
          gsap.to(obj, {
            v: end,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(obj.v)}${suffix}`;
            },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative py-24 bg-white overflow-hidden mb-20 mt-20">
      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          number="05"
          eyebrow="Trusted by Travellers"
          lines={["Trusted Expertise", "in Tours & Travel"]}
        />

        {/* Stats Grid */}
        <div ref={grid} className="grid grid-cols-2 mt-20 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <div key={i} data-stat className="relative pt-8">
              <div className="absolute top-0 inset-x-0 h-px">
                <span data-stat-line className="block h-full w-full bg-gray-300" />
              </div>

              {/* Icon */}
              <div data-stat-icon className="flex justify-center mb-5">
                {stat.icon}
              </div>

              {/* Number */}
              <h3
                data-count
                data-value={stat.value}
                data-suffix={stat.suffix ?? ""}
                className="text-5xl font-bold text-gray-700"
              >
                {stat.value}
                {stat.suffix}
              </h3>

              {/* Label */}
              <p className="mt-3 text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { TrustStats, TrustStats as AboutTrustStats };
export default TrustStats;