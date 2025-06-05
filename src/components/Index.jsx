import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ReactTyped } from "react-typed";
import { Helmet } from 'react-helmet';
import Services from './Services';
import Whyus from './Whyus';
import Testimonial from './Testimonial';
import { Link } from 'react-router-dom';
import ThreeDModel from './ThreeDModel';

export default function Index() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      {/* Meta Description */}
      <Helmet>
        <title>Home - Archphaze Technologies</title>
        <meta
          name="description"
          content="Archphaze Technologies delivers innovative tech solutions for businesses. Discover our services in web, mobile, and cloud development tailored to your success."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="pt-0 bg-white flex items-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-15 px-6 md:px-12 xl:px-20 pt-4 pb-12">
          
          {/* Text Section */}
          <div className="flex flex-col justify-center space-y-10 text-center md:text-left" data-aos="fade-right">
            <p className="text-red-500 uppercase font-medium tracking-wide">
              BUILD.HOST.LAUNCH
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Innovative <span className="text-red-500">Tech Solutions</span> for Your Business
            </h1>

            <ReactTyped
              className="text-gray-600 text-base sm:text-lg"
              strings={['Empowering startups and enterprises with modern web and mobile technologies. Let’s create something impactful together.']}
              typeSpeed={40}
            />

            <div>
              <Link to="/Contactus">
                <button
                  className="px-6 py-3 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg
                    hover:from-pink-600 hover:to-red-500 hover:scale-105 hover:shadow-2xl transition transform duration-300 ease-in-out cursor-pointer"
                >
                  Build With Us
                </button>
              </Link>
            </div>
          </div>

          {/* 3D Model Section */}
          <div className="flex justify-center items-center h-[600px] w-full" data-aos="fade-left">
            <div className="w-full h-full">
              <ThreeDModel modelPath="/office.gltf" />
            </div>
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <Services />
      <Whyus />
      <Testimonial />
    </>
  );
}
