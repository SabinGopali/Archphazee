import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { BsShieldCheck, BsTruck, BsArrowReturnLeft } from "react-icons/bs";
import { FiStar } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function ProductPage() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  function getProductImageUrl(imagePath) {
    if (!imagePath) return "https://via.placeholder.com/600x600";
    let imageUrl = imagePath.replace(/\\/g, "/");
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      if (imageUrl.startsWith("/")) imageUrl = imageUrl.slice(1);
      imageUrl = `http://localhost:3000/${imageUrl}`;
    }
    return imageUrl;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser?._id) return;
      try {
        const res = await fetch(`/backend/user/product/${currentUser._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        const productArray = Array.isArray(data) ? data : data?.products ?? [];

        if (productArray.length > 0) {
          setProducts(productArray);
          setSelectedProduct(productArray[0]);
          setSelectedImage(productArray[0].images?.[0] ?? "");
          
          // Set first variant as default if variants exist
          if (productArray[0].variants && productArray[0].variants.length > 0) {
            setSelectedVariant(productArray[0].variants[0]);
            setSelectedImage(productArray[0].variants[0].images?.[0] ?? productArray[0].images?.[0] ?? "");
          }
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [currentUser?._id]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setSelectedImage(variant.images?.[0] ?? selectedProduct.images?.[0] ?? "");
    setQuantity(1); // Reset quantity when variant changes
  };

  const handleAddToCart = async () => {
    if (!currentUser?._id || !selectedProduct) return;
    
    setIsAddingToCart(true);
    try {
      const cartItem = {
        productId: selectedProduct._id,
        variantId: selectedVariant?._id || null,
        quantity: quantity,
        userId: currentUser._id
      };

      const response = await fetch('/backend/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cartItem)
      });

      if (response.ok) {
        // Show success message or update cart state
        console.log('Item added to cart successfully');
        // You can add a toast notification here
      } else {
        console.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Get current item stock (from variant if selected, otherwise from main product)
  const getCurrentStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock || 0;
    }
    return selectedProduct?.stock || 0;
  };

  // Get current item price (from variant if selected, otherwise from main product)
  const getCurrentPrice = () => {
    if (selectedVariant) {
      return {
        price: selectedVariant.price || selectedProduct?.price || 0,
        specialPrice: selectedVariant.specialPrice || 0
      };
    }
    return {
      price: selectedProduct?.price || 0,
      specialPrice: selectedProduct?.specialPrice || 0
    };
  };

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPricing = getCurrentPrice();
  const currentStock = getCurrentStock();
  const hasDiscount = currentPricing.specialPrice > 0 && currentPricing.specialPrice < currentPricing.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((currentPricing.price - currentPricing.specialPrice) / currentPricing.price) * 100)
    : 0;

  // Get images to display (from selected variant or main product)
  const displayImages = selectedVariant?.images?.length > 0 
    ? selectedVariant.images 
    : selectedProduct.images || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-gray-900 cursor-pointer">{selectedProduct.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {selectedProduct.productName}
              {selectedVariant && <span className="text-gray-600 ml-1">- {selectedVariant.name}</span>}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main product image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={getProductImageUrl(selectedImage)}
                alt={selectedProduct.productName}
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discountPercentage}%
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <AiOutlineHeart size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Thumbnail images */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {displayImages.map((img, idx) => (
                <img
                  key={idx}
                  src={getProductImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg object-cover cursor-pointer transition-all duration-300 ${
                    selectedImage === img 
                      ? "border-2 border-blue-500 scale-105" 
                      : "border border-gray-200 hover:border-gray-300"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Product Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Product Title & Rating */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{selectedProduct.brand}</span>
                <span>•</span>
                <span>SKU: {selectedProduct.sku || "N/A"}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {selectedProduct.productName}
                {selectedVariant && (
                  <span className="block text-lg text-gray-600 font-medium mt-1">
                    {selectedVariant.name}
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) • 234 reviews</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${hasDiscount ? currentPricing.specialPrice : currentPricing.price}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    ${currentPricing.price}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStock > 0 ? `In Stock (${currentStock} available)` : 'Out of Stock'}
                </span>
                {currentStock > 0 && currentStock <= 5 && (
                  <span className="text-sm text-orange-600 font-medium">Only {currentStock} left!</span>
                )}
              </div>
            </div>

            {/* Variant Selection */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Choose Variant</h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedProduct.variants.map((variant, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleVariantSelect(variant)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedVariant?._id === variant._id || (idx === 0 && !selectedVariant)
                          ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                          : "bg-white border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {variant.images?.[0] && (
                            <img
                              src={getProductImageUrl(variant.images[0])}
                              alt={variant.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{variant.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>${variant.price || selectedProduct.price}</span>
                              <span>•</span>
                              <span className={variant.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedVariant?._id === variant._id || (idx === 0 && !selectedVariant)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}>
                          {(selectedVariant?._id === variant._id || (idx === 0 && !selectedVariant)) && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                disabled={currentStock === 0 || isAddingToCart}
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <AiOutlineShoppingCart size={20} />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button 
                disabled={currentStock === 0}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BsTruck className="text-green-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BsArrowReturnLeft className="text-blue-600" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BsShieldCheck className="text-purple-600" />
                <span>
                  {selectedProduct.warranty?.type !== "No" 
                    ? `${selectedProduct.warranty?.period} Warranty` 
                    : "Quality Assured"
                  }
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                { id: "reviews", label: "Reviews (234)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
                <div
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                />
                {selectedVariant && selectedVariant.description && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Variant Details:</h4>
                    <div
                      className="text-blue-700"
                      dangerouslySetInnerHTML={{ __html: selectedVariant.description }}
                    />
                  </div>
                )}
                {selectedProduct.freeItems && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">Free Items Included:</h4>
                    <p className="text-green-700">{selectedProduct.freeItems}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="text-gray-600">{selectedProduct.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Brand:</span>
                      <span className="text-gray-600">{selectedProduct.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">SKU:</span>
                      <span className="text-gray-600">{selectedProduct.sku || "N/A"}</span>
                    </div>
                    {selectedVariant && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">Selected Variant:</span>
                        <span className="text-gray-600">{selectedVariant.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Warranty Type:</span>
                      <span className="text-gray-600">{selectedProduct.warranty?.type || "No"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Warranty Period:</span>
                      <span className="text-gray-600">{selectedProduct.warranty?.period || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className="text-gray-600">{currentStock}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                <div className="text-center py-8 text-gray-500">
                  <p>Reviews feature coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}