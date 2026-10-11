"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/animation/SectionHeader";
import { Reveal } from "@/components/animation/Reveal";

const CARD_WIDTH = 360;
const GAP = 48;

const testimonials = [
  {
    text: "Absolutely stunning décor! Every detail was perfect and our wedding looked magical. Highly professional team.",
    name: "Priya & Arjun",
    role: "Wedding Clients",
  },
  {
    text: "PlantFashion transformed our corporate event into a luxury experience. Impressive execution and creativity.",
    name: "Rohit Sharma",
    role: "Corporate Client",
  },
  {
    text: "Professional, punctual, and incredibly stylish. The stage décor exceeded our expectations.",
    name: "Meenakshi Raj",
    role: "Engagement Event",
  },
  {
    text: "Beautiful execution and premium décor. Everything was perfectly organized.",
    name: "Suresh Kumar",
    role: "Birthday Event",
  },
  {
    text: "Elegant designs and flawless execution. Guests were truly impressed.",
    name: "Ananya Patel",
    role: "Reception Event",
  },
];

export default function TestimonialSlider() {
  const [items, setItems] = useState(testimonials);
  const [offset, setOffset] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [animating, setAnimating] = useState(false);

  /* Responsive card count */
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const VIEWPORT_WIDTH =
    CARD_WIDTH * cardsPerView + GAP * (cardsPerView - 1);

  /* Auto slide */
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setOffset(-(CARD_WIDTH + GAP));

      setTimeout(() => {
        setItems((prev) => {
          const copy = [...prev];
          copy.push(copy.shift()!);
          return copy;
        });
        setAnimating(false);
        setOffset(0);
      }, 600);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-28 overflow-x-clip">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-16 md:mb-24">
        <SectionHeader
          number="04"
          eyebrow="Client Words"
          lines={["What Our Clients Say"]}
          align="center"
        />
      </div>

      {/* Slider: fades up as a whole (the slide logic itself is unchanged) */}
      <Reveal y={50}>
        <div
          className="mx-auto overflow-hidden"
          style={{ width: VIEWPORT_WIDTH }}
        >
          <div
            className="grid grid-flow-col auto-cols-max gap-12"
            style={{
              transform: `translateX(${offset}px)`,
              transition: animating ? "transform 600ms ease-in-out" : "none",
            }}
          >
            {items.slice(0, cardsPerView + 1).map((item, i) => (
              <div key={i} style={{ width: CARD_WIDTH }}>
                <div className="bg-gray-100 p-8 shadow-sm h-full hover:bg-gray-200 transition-colors duration-300">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    “{item.text}”
                  </p>
                  <h4 className="font-semibold">— {item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export { TestimonialSlider };