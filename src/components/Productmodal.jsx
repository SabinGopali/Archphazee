import React, { useState } from 'react';
import image from '../assets/archphaze.webp'; // Update path if necessary

const products = [
  {
    name: 'Premium Wireless Headphones',
    price: 'Rs 2000',
    description: 'High-quality wireless headphones with noise cancellation',
    image: image,
  },
  {
    name: 'Smart Watch Pro',
    price: 'Rs 2000',
    description: 'Advanced smartwatch with health monitoring features & track your daily life activities',
    image: image,
  },
  {
    name: 'JBL Portable Wireless Speaker',
    price: 'Rs 2000',
    description: 'Waterproof portable speaker with amazing sound quality & strong base with fast charging',
    image: image,
  },
  {
    name: '4K Drone Camera',
    price: 'Rs 2000',
    description: 'Professional drone with 4K camera and stable flight, enhance your travel experience',
    image: image,
  },
];

const ProductCard = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="w-full py-16 px-4 bg-white">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-black">
            ARCH <span className="text-red-500">SHOP</span>
          </h1>
          <p className="text-lg text-gray-700 mt-4">
            Explore tech gadgets that improve your lifestyle and productivity.
          </p>
        </div>

        {/* Product Grid - 3 cards per row on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="group cursor-pointer bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <div className="w-full h-48 overflow-hidden rounded-xl mb-5 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-black">{product.name}</h2>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  
                  <button className="flex items-center px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition cursor-pointer text-sm md:text-base">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.5h11.1a1 1 0 00.9-1.5L17 13M7 13V6h10v7"
                            />
                        </svg>
                        Add to Cart
                        </button>
                  <span className="text-lg font-bold text-black">{product.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
