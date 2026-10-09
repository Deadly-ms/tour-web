"use client";

import { useEffect, useState } from "react";

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
    <section className="bg-white py-28">
      {/* Heading */}
      {/* <div className="absolute right-0 mt-20 max-w-7xl mx-auto px-6 md:px-20 mb-20">

        <h1 className="absolute -top-60 right-0 text-[140px] font-bold text-gray-100 select-none">
              04
            </h1>

        <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
          Client Words
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          What Our Clients Say
        </h2>
      </div> */}

      <div className="relative mb-27 mt-5 max-w-7xl mx-auto px-6 text-center md:px-20">

            <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Client Words
            </p>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              What Our Clients Say
            </h2>
          </div>

      {/* 🔒 HARD CLIPPED VIEWPORT */}
      <div
        className="mx-auto overflow-hidden"
        style={{ width: VIEWPORT_WIDTH }}
      >
        {/* GRID = no flex-gap leakage */}
        <div
          className="grid grid-flow-col auto-cols-max gap-12"
          style={{
            transform: `translateX(${offset}px)`,
            transition: animating ? "transform 600ms ease-in-out" : "none",
          }}
        >
          {/* Render only needed cards */}
          {items.slice(0, cardsPerView + 1).map((item, i) => (
            <div key={i} style={{ width: CARD_WIDTH }}>
              <div className="bg-gray-100 p-8 shadow-sm h-full">
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
    </section>
  );
}

export { TestimonialSlider };
