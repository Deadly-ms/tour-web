"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/animation/SectionHeader";
import { Reveal } from "@/components/animation/Reveal";

const CARD_WIDTH = 360;
const GAP = 48;

const testimonials = [
  {
    text: "Our Kerala trip was beautifully planned. Every stay, transfer and activity was perfectly arranged, and the team was always one call away.",
    name: "Priya & Arjun",
    role: "Honeymoon Travellers",
  },
  {
    text: "Track Your Trip turned our family holiday into a stress-free experience. The itinerary suited everyone, from the kids to the grandparents.",
    name: "Rohit Sharma",
    role: "Family Trip",
  },
  {
    text: "Professional, punctual, and genuinely caring. Our local guide made the journey far more special than we expected.",
    name: "Meenakshi Raj",
    role: "Heritage Tour",
  },
  {
    text: "Great hotels, comfortable transport, and not a single surprise. Everything was exactly as promised.",
    name: "Suresh Kumar",
    role: "Group Tour",
  },
  {
    text: "A perfectly paced itinerary with time to enjoy each place. We will definitely book our next trip with them.",
    name: "Ananya Patel",
    role: "Adventure Trip",
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
          eyebrow="Traveller Stories"
          lines={["What Our Travellers Say"]}
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