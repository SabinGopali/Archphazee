import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import model1 from "/speaker.webp";
import model2 from "/headphone.webp";
import model3 from "/charger.webp";
import model4 from "/vr.webp";
import { useNavigate } from "react-router-dom";

// Image list
const models = [
  { id: 1, image: model1 },
  { id: 2, image: model2 },
  { id: 3, image: model3 },
  { id: 4, image: model4 },
];

const duplicatedModels = [...models, ...models, ...models]; // For seamless looping

const customCardStyles = [
  "h-[360px] mt-6 mb-6",
  "h-[440px] mt-6 mb-6",
  "h-[400px] mt-6 mb-6",
  "h-[380px] mt-6 mb-6",
];

export default function Productmodal() {
  const controls = useAnimation();
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const [contentWidth, setContentWidth] = useState(0);
  const baseDuration = 30;

  const startScrolling = (fromX = 0) => {
    if (!contentWidth) return;
    const remainingDistance = contentWidth + fromX;
    const speed = contentWidth / baseDuration;
    const adjustedDuration = remainingDistance / speed;

    controls.start({
      x: [fromX, -contentWidth],
      transition: {
        duration: adjustedDuration,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (trackRef.current) {
      const width = trackRef.current.scrollWidth / 2;
      setContentWidth(width);
      startScrolling(0);
    }
  }, []);

  const stopScrolling = () => controls.stop();

  const resumeScrolling = () => {
    const currentX = x.get();
    startScrolling(currentX);
  };

  const handleCardClick = (model, index) => {
    const element = itemRefs.current[index];
    const rect = element.getBoundingClientRect();

    const clone = element.cloneNode(true);
    document.body.appendChild(clone);

    Object.assign(clone.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: 9999,
      margin: 0,
      pointerEvents: "none",
    });

    import("gsap").then(({ default: gsap }) => {
      gsap.set(clone, {
        transformOrigin: "center center",
        opacity: 1,
        scale: 1,
      });

      gsap.to(clone, {
        duration: 0.7,
        scale: 1.1,
        opacity: 0,
        ease: "power2.out",
        onComplete: () => {
          document.body.removeChild(clone);
          navigate("/productdetail", {
            state: {
              item: {
                title: `Model ${model.id}`,
                image: model.image,
              },
              rect,
            },
          });
        },
      });
    });
  };

  return (
    <div className="min-h-screen w-screen bg-white-100 flex flex-col items-center text-center overflow-hidden">
      {/* Header */}
      <div className="mb-4 mt-6">
        <button className="bg-white text-black px-5 py-1 rounded-full shadow border border-black text-sm">
          ARCH SHOP
        </button>
      </div>

      {/* Title & Tagline */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight uppercase max-w-4xl px-4">
        Where style meets <span className="text-red-500">innovative ways</span> of
        <br /> meeting new fashion
      </h1>

      <p className="mt-4 text-gray-600 max-w-xl text-base px-4">
        Unveiling a fashion destination where trends blend seamlessly with your individual style aspirations. Discover today.
      </p>

      <div className="mt-4">
        <button
          onClick={() => navigate("/collection")}
          className="px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition cursor-pointer text-sm md:text-base"
        >
          New Collection
        </button>
      </div>

      {/* Scrolling Cards */}
      <div
        className="w-full overflow-hidden mt-10"
        onMouseEnter={stopScrolling}
        onMouseLeave={resumeScrolling}
      >
        <motion.div
          ref={trackRef}
          animate={controls}
          style={{ x }}
          className="flex gap-4 w-max px-4 items-center"
        >
          {duplicatedModels.map((model, index) => (
            <div
              key={`${model.id}-${index}`}
              ref={(el) => (itemRefs.current[index] = el)}
              onClick={() => handleCardClick(model, index)}
              className={`bg-white rounded-3xl overflow-hidden shadow-2xl p-3 cursor-pointer flex-shrink-0 w-[200px] sm:w-[220px] md:w-[250px] transition-transform hover:scale-105 ${customCardStyles[index % customCardStyles.length]}`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={model.image}
                  alt={`Model ${model.id}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
