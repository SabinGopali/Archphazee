import { FaFacebook, FaTwitter, FaInstagram, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-gray-300 py-8 px-4 sm:px-6 relative border-t border-white w-full">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 px-2 sm:px-4">
        {/* Branding */}
        <div className="text-center md:text-left w-full md:w-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Archphaze Technologies Pvt. Ltd
          </h2>
          <p className="text-xs sm:text-sm mt-1">
            © {year}. All rights reserved.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center space-x-4 mt-2 md:mt-0">
          <Link to="https://www.facebook.com" aria-label="facebook" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaFacebook size={18} className="sm:size-5" />
          </Link>
          <Link to="https://www.twitter.com" aria-label="twitter" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaTwitter size={18} className="sm:size-5" />
          </Link>
          <Link to="https://www.instagram.com" aria-label="instagram" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaInstagram size={18} className="sm:size-5" />
          </Link>
        </div>
      </div>

      {/* Scroll to Top */}
      
    </footer>
  );
}
