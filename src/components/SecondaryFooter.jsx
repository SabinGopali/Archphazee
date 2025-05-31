import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";
import logo from "../assets/archphaze.webp";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 sm:px-10 md:px-20 border-t border-[#1B2A4C] animate-fadeIn w-full">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand & Social Icons */}
        <div className="px-4">
          <div className="flex items-center space-x-3 mb-4">
            <Link to="/">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita
          </p>
          <div className="flex space-x-3 mt-4">
            <Link
              to="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1B2A4C] p-2 rounded text-white hover:bg-[#2B3C5C] transition transform hover:scale-110 shadow-md"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </Link>
            <Link
              to="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1B2A4C] p-2 rounded text-white hover:bg-[#2B3C5C] transition transform hover:scale-110 shadow-md"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </Link>
            <Link
              to="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1B2A4C] p-2 rounded text-white hover:bg-[#2B3C5C] transition transform hover:scale-110 shadow-md"
              aria-label="YouTube"
            >
              <FaYoutube size={20} />
            </Link>
            <Link
              to="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1B2A4C] p-2 rounded text-white hover:bg-[#2B3C5C] transition transform hover:scale-110 shadow-md"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={20} />
            </Link>
          </div>
        </div>

        {/* Address */}
        <div className="px-4">
          <h3 className="text-xl font-semibold mb-4">Address</h3>
          <p className="flex items-center space-x-2 text-sm mb-2">
            <FaMapMarkerAlt size={16} />
            <span>Kalimati, Kathmandu, Nepal</span>
          </p>
          <p className="flex items-center space-x-2 text-sm mb-2">
            <FaPhoneAlt size={16} />
            <span >+997 9999999999</span>
          </p>
          <p className="flex items-center space-x-2 text-sm">
            <FaEnvelope size={16} />
            <span >info@example.com</span>
          </p>
        </div>

        {/* Quick Links */}
        <div className="px-4">
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              { name: "Archphaze Development Center", to: "/Aboutus" },
              { name: "Privacy Notice", to: "/Contactus" },
              { name: "Your Privacy Rights", to: "/Services" },
              { name: "Cookie Preferences", to: "/Testimonial" },
              { name: "Terms of Use", to: "/Career" },
              { name: "Support", to: "/Career" },
              { name: "Contact Us", to: "/Career" }
            ].map(({ name, to }, i) => (
              <li key={i}>
                <Link
                  to={to}
                  className="block w-fit relative after:block after:h-[2px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left hover:text-white"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
