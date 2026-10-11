"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import AboutTrustStats from "@/components/AboutTrustStats";
import TestimonialSlider from "@/components/TestimonialSlider";
import Footer from "@/components/Footer";
import aboutImg from "@/assets/img2.jpg";

import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SectionHeader } from "@/components/animation/SectionHeader";
import { RevealGroup } from "@/components/animation/Reveal";
import { ScrollWords } from "@/components/animation/ScrollWords";
import { StackingCards } from "@/components/animation/StackingCards";
import { ScrollProgress } from "@/components/animation/ScrollProgress";

const PURPOSE = [
  {
    label: "Our Vision",
    text: "To become a leading luxury event decoration brand known for innovative designs, premium quality, and memorable customer experiences across all celebrations.",
  },
  {
    label: "Our Mission",
    text: "To transform every event into an emotional and visual masterpiece through creativity, precision, and professional execution.",
  },
];

const FEATURES = [
  {
    title: "Premium Quality Materials",
    text: "We use hand-picked flowers, luxury fabrics, premium lighting, and high-end décor elements.",
    card: "bg-gray-50 border-gray-200 text-black",
    num: "text-gray-300",
    body: "text-gray-600",
  },
  {
    title: "Customized Design Concepts",
    text: "Every setup is uniquely tailored to your theme, space, and personal style.",
    card: "bg-gray-100 border-gray-200 text-black",
    num: "text-gray-300",
    body: "text-gray-600",
  },
  {
    title: "Experienced Creative Team",
    text: "Our decorators, designers, and technicians bring years of hands-on professional expertise.",
    card: "bg-gray-200 border-gray-300 text-black",
    num: "text-gray-400",
    body: "text-gray-700",
  },
  {
    title: "End-to-End Event Execution",
    text: "We handle everything from concept planning to final execution without stress for you.",
    card: "bg-black border-black text-white",
    num: "text-white/20",
    body: "text-gray-300",
  },
];

const About = () => {
  const imgSrc = (aboutImg as any)?.src || aboutImg;
  const hero = useRef<HTMLElement>(null);

  // Hero image: opens from a small rounded shape to the full frame, then drifts while scrolling
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: hero.current, start: "top 80%", once: true },
        });
        tl.fromTo(
          "[data-hero-mask]",
          { clipPath: "inset(18% 18% 18% 18% round 140px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 2px)",
            duration: 1.6,
            ease: "power3.inOut",
            clearProps: "clipPath",
          },
          0
        )
          .from("[data-hero-img]", { scale: 1.4, duration: 1.9 }, 0)
          .from("[data-hero-deco]", { x: 40, y: 40, opacity: 0, duration: 1.2 }, 0.5);

        gsap.fromTo(
          "[data-hero-par]",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: hero.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: hero }
  );

  return (
    <>
      <ScrollProgress />

      <main className="bg-white">
        {/* ================= 01 · ABOUT HERO ================= */}
        <section ref={hero} className="py-12 sm:py-16 overflow-x-clip">
          <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-20 items-center">
            {/* Left Image */}
            <div className="relative">
              <div
                data-hero-mask
                className="relative h-[380px] md:h-[500px] overflow-hidden rounded-sm bg-gray-100"
              >
                <div data-hero-par className="absolute -inset-y-[10%] inset-x-0">
                  <img
                    data-hero-img
                    src={imgSrc}
                    alt="About PlantFashion"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div
                data-hero-deco
                className="absolute -top-10 -left-10 w-40 h-40 bg-gray-100 -z-10"
              />
            </div>

            {/* Right Content */}
            <div>
              <SectionHeader
                number="01"
                eyebrow="Who We Are"
                lines={["Great Events", "Start Together"]}
                className="mb-6"
              />

              <RevealGroup y={30} stagger={0.15}>
                <p className="text-gray-600 leading-relaxed mb-6">
                  PlantFashion is a premium event decoration brand specializing in
                  luxury floral styling, wedding décor, corporate setups, and custom
                  event transformations. We blend creativity, craftsmanship, and
                  precision to deliver unforgettable visual experiences.
                </p>

                <p className="text-gray-600 leading-relaxed mb-8">
                  From intimate celebrations to grand-scale productions, our
                  dedication to quality and detail makes every moment extraordinary.
                </p>

                <div>
                  <Link
                    to="/Contact"
                    className="inline-block px-8 py-3 border border-black text-black font-medium hover:bg-black hover:text-white transition"
                  >
                    Contact Us
                  </Link>
                </div>
              </RevealGroup>
            </div>
          </div>
        </section>

        {/* ================= 02 · VISION & MISSION ================= */}
        <section className="bg-white py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <SectionHeader
              number="02"
              eyebrow="Our Purpose"
              lines={["Vision & Mission"]}
              align="right"
              className="mb-16 md:mb-24"
            />

            <div className="space-y-20 md:space-y-32">
              {PURPOSE.map((item, i) => (
                <div key={item.label} className="grid md:grid-cols-12 gap-6 md:gap-16 items-start">
                  <div className="md:col-span-4 md:sticky md:top-32">
                    <span className="font-mono text-xs text-gray-400">0{i + 1}</span>
                    <h3 className="mt-2 text-2xl font-semibold">{item.label}</h3>
                    <div className="mt-4 h-px w-16 bg-black" />
                  </div>
                  <ScrollWords
                    text={item.text}
                    className="md:col-span-8 text-2xl md:text-4xl font-semibold leading-snug text-gray-900"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 03 · WHY CHOOSE US ================= */}
        <section className="bg-white py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <SectionHeader
              number="03"
              eyebrow="Our Strength"
              lines={["Why Choose", "PlantFashion"]}
              className="mb-16 md:mb-20"
            />

            <StackingCards topOffset={96} peek={14} gap={48}>
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className={`rounded-3xl border shadow-lg p-8 md:p-12 min-h-[260px] md:min-h-[300px] flex flex-col md:flex-row md:items-center gap-6 md:gap-16 ${f.card}`}
                >
                  <span className={`text-7xl md:text-[120px] leading-none font-bold ${f.num}`}>
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl md:text-4xl font-semibold mb-3">{f.title}</h3>
                    <p className={`leading-relaxed max-w-md ${f.body}`}>{f.text}</p>
                  </div>
                </div>
              ))}
            </StackingCards>
          </div>
        </section>

        {/* ================= 04 · TESTIMONIALS ================= */}
        <TestimonialSlider />

        {/* ================= 05 · STATS ================= */}
        <AboutTrustStats />
      </main>

      {/* <Footer /> */}
    </>
  );
};

export default About;