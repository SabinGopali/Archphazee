import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CiUser } from 'react-icons/ci';
import logo from '/logo.webp';

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setServicesOpen(false);
  };

  const toggleServicesMenu = () => {
    setServicesOpen(!isServicesOpen);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 w-full h-24 border-b border-gray-200 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-8 lg:px-16 h-full">

        {/* Logo */}
        <NavLink to="/" className="mt-3 flex items-center space-x-3 shrink-0">
          <img
            src={logo}
            width={200}
            height={140}
            alt="Logo"
            className="object-contain h-20 w-auto"
            style={{ maxWidth: 'none' }}
          />
        </NavLink>

        {/* Desktop Nav Center */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex flex-wrap space-x-4 md:space-x-6 lg:space-x-10 bg-[#f7f8fc] px-4 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4 rounded-xl font-medium text-gray-600 text-sm md:text-base">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Home</NavLink></li>
            <li><NavLink to="/Services" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Arch Services</NavLink></li>
            <li><NavLink to="/productmodal" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Arch Shop</NavLink></li>
            <li><NavLink to="/career" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Career</NavLink></li>
            <li className="relative group">
              <div className="flex items-center gap-1 cursor-pointer hover:text-black">
                <NavLink to="/Testimonial" className={({ isActive }) => isActive ? 'text-black font-semibold' : ''}>Meet The Team</NavLink>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 ease-in-out z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <NavLink to="/Aboutus" className={({ isActive }) => isActive ? 'block px-4 py-2 bg-gray-100' : 'block px-4 py-2 hover:bg-gray-100'}>About Us</NavLink>
                  </li>
                </ul>
              </div>
            </li>
            <li><NavLink to="/Contactus" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Contact Us</NavLink></li>
          </ul>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-x-4 lg:gap-x-6">
          <Link to="/Login" aria-label="login">
            <CiUser className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
          </Link>
          <Link to="/cart" aria-label="cart">
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🛒</span>
          </Link>
          <Link to="/Contactus">
            <button className="px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm md:text-base">
              Build With Us
            </button>
          </Link>
        </div>

        {/* Mobile: User + Cart + Hamburger */}
        <div className="flex md:hidden items-center space-x-4">
          <Link to="/Login" aria-label="login">
            <CiUser className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
          </Link>
          <Link to="/cart" aria-label="cart">
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🛒</span>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-gray-50 border-t border-gray-200 overflow-y-auto transition-[max-height,opacity] duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[calc(100vh-96px)] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col px-6 py-4 text-gray-700 font-medium space-y-3 text-sm">
          <li><NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/Services" onClick={() => setMobileMenuOpen(false)}>Arch Services</NavLink></li>
          <li><NavLink to="/productmodal" onClick={() => setMobileMenuOpen(false)}>Arch Shop</NavLink></li>
          <li><NavLink to="/career" onClick={() => setMobileMenuOpen(false)}>Career</NavLink></li>
          <li>
            <button
              className="w-full text-left flex items-center justify-between focus:outline-none"
              onClick={toggleServicesMenu}
              aria-expanded={isServicesOpen}
              aria-controls="services-submenu"
            >
              <span>Meet The Team</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isServicesOpen && (
              <ul id="services-submenu" className="mt-2 ml-4 space-y-2 text-sm">
                <li><NavLink to="/Aboutus" onClick={() => setMobileMenuOpen(false)}>About Us</NavLink></li>
              </ul>
            )}
          </li>
          <li><NavLink to="/Contactus" onClick={() => setMobileMenuOpen(false)}>Contact Us</NavLink></li>
          <li>
            <Link to="/Contactus">
              <button
                className="w-full text-center cursor-pointer px-5 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
                type="button"
              >
                Build With Us
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
