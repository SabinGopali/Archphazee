import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import logo from "/logo.webp";
import { Link } from "react-router-dom";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");

  const handleGoogleLogin = () => {
    window.location.href = "https://accounts.google.com/signin";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 md:p-10 space-y-6">
        
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain"
          />
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center">
          <div className="bg-gray-200 p-1 rounded-full flex gap-1 w-fit">
            <button
              className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-black text-white shadow"
                  : "text-black hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Log In
            </button>
            <button
              className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-black text-white shadow"
                  : "text-black hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          {activeTab === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          {activeTab === "login" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-red-500" />
                Remember me
              </label>
              <Link to="/forgetpassword" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}
          <button className="w-full bg-white text-black border border-black py-3 rounded-xl hover:bg-black hover:text-white transition-all text-base sm:text-lg font-medium">
            {activeTab === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="text-center text-gray-500 font-semibold">OR</div>

        {/* Social Login */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all text-sm sm:text-base font-medium shadow-sm"
        >
          <FaGoogle className="text-red-500 text-xl" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
