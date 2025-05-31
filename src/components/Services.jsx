import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Helmet } from 'react-helmet';
import Modal from './Modal'; // Adjust path if needed

// Images
import WebDevImg from '../assets/homescreen.webp';
import MobileAppImg from '../assets/homescreen.webp';
import UIUXImg from '../assets/homescreen.webp';
import ApiImg from '../assets/homescreen.webp';

const data = [
  {
    img: WebDevImg,
    title: 'Website Development',
    para: 'Responsive, SEO-friendly, and high-performance websites.',
    details: [
      "We specialize in crafting modern, fast, and accessible websites using React, Next.js, and headless CMS solutions.",
      "Our builds are fully responsive, optimized for speed and SEO, and easily scalable.",
      "We prioritize code quality, performance, and great UX from concept to deployment."
    ]
  },
  {
    img: MobileAppImg,
    title: 'Mobile App Development',
    para: 'Cross-platform mobile apps with native performance.',
    details: [
      "We use React Native and Flutter to create smooth, high-performance apps for iOS and Android.",
      "From design to launch, we handle full lifecycle mobile development.",
      "Our apps offer consistent performance, sleek interfaces, and full device integration."
    ]
  },
  {
    img: UIUXImg,
    title: 'UI/UX Design',
    para: 'Intuitive and sleek user experiences tailored to your audience.',
    details: [
      "We craft interfaces that are both visually striking and functionally intuitive.",
      "Our process includes wireframes, user flows, and interactive prototypes.",
      "Designs are optimized for accessibility, responsiveness, and conversion."
    ]
  },
  {
    img: ApiImg,
    title: 'API Integration',
    para: 'Secure and scalable APIs integration for your apps and platforms.',
    details: [
      "We integrate and develop RESTful and GraphQL APIs with authentication and rate-limiting.",
      "Our approach includes proper error handling, validation, and scalable endpoints.",
      "We ensure secure connections between services and optimize for reliability."
    ]
  }
];

export default function Services() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: 'ease-in-out' });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '', image: '' });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleReadMore = (item) => {
    setModalContent({ title: item.title, content: item.details, image: item.img });
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full py-20 px-4 overflow-hidden bg-white">
      {/* SEO Tags */}
      <Helmet>
        <title>Our Services - Archphaze Technologies</title>
        <meta
          name="description"
          content="Explore our range of services including website development, mobile app development, UI/UX design, and API integration. We build modern, scalable, and reliable tech solutions."
        />
      </Helmet>

      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-black" data-aos="zoom-out">
            ARCH <span className="text-red-500">SERVICES</span>
          </h1>
          <p className="text-lg text-gray-700 mt-4" data-aos="zoom-in">
            We deliver creative, modern, and scalable tech solutions for businesses of all sizes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {data.map((item, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                className="group cursor-pointer bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:bg-gray-50"
                style={{
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  transitionProperty: 'transform',
                  transitionTimingFunction: 'ease-in-out',
                  transitionDuration: isHovered ? '300ms' : '150ms',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="w-full h-[180px] mb-6 overflow-hidden rounded-xl shadow-sm">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-3 text-black">{item.title}</h2>
                <p className="text-base text-gray-600 mb-4">{item.para}</p>
                <button
                  onClick={() => handleReadMore(item)}
                  className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition-colors duration-300"
                >
                  Read More
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
        image={modalContent.image}
      />
    </div>
  );
}
