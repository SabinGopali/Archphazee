import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import image from '../assets/homescreen.webp';
import Whyus from './Whyus';

export default function Aboutus() {
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  const content = {
    about: {
      title: '✓ Who are We',
      paragraphs: [
        `At Archphaze Technologies, we specialize in delivering top-tier IT solutions to businesses, offering cutting-edge web solutions tailored for your success. With a seasoned team boasting experience across diverse industries, we consistently innovate to drive client success.`,
        `Our approach prioritizes critical information, ensuring professionalism and post-implementation support for enduring results. Driven by innovation, we constantly push boundaries, presenting fresh ideas and approaches to ensure your success.`,
        `We prioritize essential information, maintaining a high level of professionalism while delivering impactful results. Join us, and let's embark on a journey of growth, innovation, and unparalleled success together.`,
      ],
    },
    mission: {
      title: '✓ Our Mission',
      paragraphs: [
        `Our mission is to empower businesses through innovative and scalable IT solutions that simplify complexities, enhance operational efficiency, and drive measurable growth.`,
        `We aim to be a trusted technology partner, delivering value by aligning our solutions with your business objectives. Our goal is to make technology accessible, reliable, and transformative for organizations of all sizes.`,
      ],
    },
    vision: {
      title: '✓ Our Vision',
      paragraphs: [
        `Our vision is to become a global leader in IT services by constantly evolving, adapting to emerging technologies, and setting industry benchmarks in quality, performance, and innovation.`,
        `We envision a world where businesses, regardless of size, thrive through technology that is secure, intuitive, and future-ready.`,
      ],
    },
  };

  return (
    <section className="bg-white max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-20 py-16">
      <Helmet>
        <title>About Us - Archphaze Technologies</title>
        <meta
          name="description"
          content="Learn more about Archphaze Technologies—who we are, our mission, and our vision. Discover how we empower businesses with innovative IT solutions."
        />
      </Helmet>

      <div>
        {/* Title */}
        <motion.h2
          className="text-4xl sm:text-5xl font-semibold text-gray-800 mb-2"
          data-aos="fade-down"
        >
          About <span className="text-red-500">US</span>
        </motion.h2>

        <motion.h3
          className="text-xl sm:text-2xl text-gray-600 font-medium mb-6"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Archphaze Technologies Pvt. Ltd.
        </motion.h3>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-300 mb-6 text-lg font-medium">
          {['about', 'mission', 'vision'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-700 hover:text-red-500'
              }`}
            >
              {tab === 'about'
                ? 'About Us'
                : tab === 'mission'
                ? 'Our Mission'
                : 'Our Vision'}
            </button>
          ))}
        </div>

        {/* Grid Section for Content and Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-10">
          {/* Text Content */}
          <motion.div
            data-aos="fade-right"
            key={activeTab}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-red-500 font-semibold mb-2">{content[activeTab].title}</p>
            {content[activeTab].paragraphs.map((para, index) => (
              <p
                key={index}
                className="text-gray-700 text-justify leading-relaxed text-base sm:text-lg mb-4"
              >
                {para}
              </p>
            ))}
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="flex justify-center"
            data-aos="fade-left"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={image}
                alt="About Company"
                className="w-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
