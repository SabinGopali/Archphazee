import React, { useEffect, useState, useRef } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase"; // Adjust path as needed
import Suppliersidebar from "./Suppliersidebar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Productbasicinformation() {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  
  // Main form state
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    brand: '',
    category: "Test FY SOP Category 1",
    regularPrice: 0,
    specialPrice: 0,
    stock: 0,
    sku: '',
    freeItems: '',
    available: true,
    warrantyType: '',
    warrantyPeriod: '',
    warrantyPolicy: '',
    variants: []
  });

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Editor state
  const [description, setDescription] = useState("");

  // Refs for sections
  const productInfoRef = useRef(null);
  const priceVariantRef = useRef(null);
  const warrantyRef = useRef(null);

  // Track which section is active for description
  const [activeSection, setActiveSection] = useState("productInfo");

  console.log(formData);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setDescription(content);
      setFormData(prev => ({ ...prev, description: content }));
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(description || "");
    }
  }, [editor]);

  // Handle image upload to Firebase
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      
      Promise.all(promises)
        .then((urls) => {
          setFormData(prev => ({ 
            ...prev, 
            imageUrls: prev.imageUrls.concat(urls) 
          }));
          setImageUploadError(false);
          setUploading(false);
          setFiles([]);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 MB max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev, 
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) {
      setError("Image is missing. Please upload at least 1 image.");
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
    setError("");
  };

  const removeImage = (indexToRemove) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddVariant = () => {
    if (formData.variants.length >= 3) return;
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: "", images: [] }]
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      updated[index][field] = value;
      return { ...prev, variants: updated };
    });
  };

  const handleVariantImageUpload = (index, files) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      const existingImages = updated[index].images || [];
      const newImages = Array.from(files);
      const combined = [...existingImages, ...newImages].slice(0, 3);
      updated[index].images = combined;
      return { ...prev, variants: updated };
    });
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      updated[variantIndex].images.splice(imageIndex, 1);
      return { ...prev, variants: updated };
    });
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [id]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (formData.imageUrls.length < 1 && files.length < 1) {
        return setError('You must upload at least one image');
      }
      
      if (!formData.description.trim() || formData.description === "<p></p>") {
        return setError("Please enter a product description.");
      }
      
      if (!formData.name.trim()) {
        return setError("Please enter a product name.");
      }

      // Upload any pending files first
      if (files.length > 0) {
        await handleImageSubmit();
      }

      setLoading(true);
      setError("");
      
      const res = await fetch('/backend/product/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const productRect = productInfoRef.current?.getBoundingClientRect();
      const priceRect = priceVariantRef.current?.getBoundingClientRect();
      const warrantyRect = warrantyRef.current?.getBoundingClientRect();

      if (productRect && productRect.top <= 150 && productRect.bottom > 150) {
        setActiveSection("productInfo");
      } else if (priceRect && priceRect.top <= 150 && priceRect.bottom > 150) {
        setActiveSection("priceVariant");
      } else if (warrantyRect && warrantyRect.top <= 150 && warrantyRect.bottom > 150) {
        setActiveSection("warranty");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-10">
      {/* Mobile Sidebar Toggle */}
      <div className="px-4 lg:hidden mb-5">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border shadow rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 lg:flex lg:gap-8">
        <aside className="sticky top-6 self-start hidden lg:block w-64">
          <Suppliersidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </aside>

        <main className="flex-1">
          <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
              Add Product
            </h2>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Product Info Section */}
              <div ref={productInfoRef}>
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Product Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    className="w-full border border-gray-300 rounded-md p-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Test FY SOP Category 1">Test FY SOP Category 1</option>
                    <option value="Work Shoes">Work Shoes</option>
                  </select>
                </div>

                {/* Product Images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Product Images <span className="text-red-600">*</span>
                  </label>
                  <div
                    className={`w-full p-8 rounded-lg border-2 border-dashed flex flex-col items-center justify-center ${
                      imageUploadError ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    } transition`}
                  >
                    <label
                      className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-black transition"
                      htmlFor="product-image-upload"
                    >
                      <FiPlus className="text-5xl mb-2" />
                      <span className="text-base font-medium select-none">
                        Click to upload images
                      </span>
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>

                    {imageUploadError && <p className="text-sm text-red-600 mt-3">{imageUploadError}</p>}

                    {/* Display uploaded files preview */}
                    {files.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                        {files.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition"
                          >
                            <img
                              src={URL.createObjectURL(img)}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-600 shadow hover:text-red-700 transition"
                              aria-label="Remove image"
                            >
                              <FiTrash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Display uploaded images from Firebase */}
                    {formData.imageUrls.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                        {formData.imageUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition"
                          >
                            <img
                              src={url}
                              alt="uploaded"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-600 shadow hover:text-red-700 transition"
                              aria-label="Remove image"
                            >
                              <FiTrash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button for files */}
                    {files.length > 0 && (
                      <button
                        type="button"
                        onClick={handleImageSubmit}
                        disabled={uploading}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition"
                      >
                        {uploading ? 'Uploading...' : 'Upload Images'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Brand <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                    required
                  >
                    <option value="" disabled>
                      Select a brand
                    </option>
                    <option value="No Brand">No Brand</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Apple">Apple</option>
                    <option value="Xiaomi">Xiaomi</option>
                  </select>
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Product Description <span className="text-red-600">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-md min-h-[180px] shadow-sm focus-within:ring-2 focus-within:ring-black focus-within:border-transparent bg-white transition">
                    {editor ? (
                      <EditorContent editor={editor} className="p-4 prose max-w-none text-gray-700" />
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Variants + Price Section */}
              <div ref={priceVariantRef}>
                <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b pb-3">
                  Price, Stock & Variant Images
                </h3>
                <button
                  onClick={handleAddVariant}
                  disabled={formData.variants.length >= 3}
                  className={`mb-6 px-4 py-2 border rounded-md text-sm font-medium transition ${
                    formData.variants.length >= 3
                      ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
                      : "border-black text-black hover:bg-black hover:text-white"
                  }`}
                  type="button"
                >
                  + Add Variant ({formData.variants.length}/3)
                </button>

                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="mb-8 border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm"
                  >
                    <input
                      type="text"
                      placeholder="Variant name (e.g. Red, Large)"
                      className="w-full mb-4 border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      {variant.images?.map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative border rounded-lg overflow-hidden h-24 shadow-sm hover:shadow-md transition"
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            className="w-full h-full object-cover"
                            alt="variant preview"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(index, imgIdx)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-600 shadow hover:text-red-700 transition"
                            aria-label="Remove variant image"
                          >
                            <FiTrash size={16} />
                          </button>
                        </div>
                      ))}
                      {variant.images?.length < 3 && (
                        <label className="border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center h-24 cursor-pointer text-gray-400 hover:text-black transition shadow-sm hover:shadow-md">
                          <FiPlus size={26} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleVariantImageUpload(index, e.target.files)}
                            multiple
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-6 gap-4 items-end text-sm text-gray-800">
                  <div>
                    <label className="block font-semibold mb-2">
                      Price <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      id="regularPrice"
                      value={formData.regularPrice}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      placeholder="Rs."
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Special Price</label>
                    <input
                      type="number"
                      id="specialPrice"
                      value={formData.specialPrice}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Seller SKU</label>
                    <input
                      type="text"
                      id="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      placeholder="SKU code"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Free Items</label>
                    <input
                      type="text"
                      id="freeItems"
                      value={formData.freeItems}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      placeholder="e.g. 1"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="block font-semibold mb-2">Availability</label>
                    <label
                      htmlFor="availability-toggle"
                      className="inline-flex items-center cursor-pointer select-none"
                    >
                      <input
                        id="available"
                        type="checkbox"
                        checked={formData.available}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                          formData.available ? "bg-black" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                            formData.available ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* WARRANTY SECTION */}
              <div ref={warrantyRef} className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-3">
                  Warranty Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold text-gray-800 mb-2">
                      Warranty Type
                    </label>
                    <select
                      id="warrantyType"
                      className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      value={formData.warrantyType}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Manufacturer">Manufacturer Warranty</option>
                      <option value="Seller">Seller Warranty</option>
                      <option value="No">No Warranty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-2">
                      Warranty Period
                    </label>
                    <input
                      type="text"
                      id="warrantyPeriod"
                      className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      placeholder="e.g. 6 months, 1 year"
                      value={formData.warrantyPeriod}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-800 mb-2">
                      Warranty Policy
                    </label>
                    <textarea
                      id="warrantyPolicy"
                      className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition resize-none"
                      rows={4}
                      placeholder="Describe warranty coverage and claim instructions"
                      value={formData.warrantyPolicy}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-5 mt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-md bg-white text-black font-semibold border border-black hover:bg-black hover:text-white transition shadow-lg disabled:bg-gray-400 disabled:border-gray-400"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}