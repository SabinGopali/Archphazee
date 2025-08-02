import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Suppliersidebar from "./Suppliersidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Utility for cropping image, returns a Blob
function getCroppedImg(imageSrc, crop, zoom) {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

  return createImage(imageSrc).then((image) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  });
}

export default function StoreProfile() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [companyDescription, setCompanyDescription] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postCode, setPostCode] = useState("");

  // Store cropped files
  const [logoFile, setLogoFile] = useState(null);
  const [bgImageFile, setBgImageFile] = useState(null);

  // Store existing image URLs from backend
  const [existingLogoUrl, setExistingLogoUrl] = useState("");
  const [existingBgImageUrl, setExistingBgImageUrl] = useState("");

  // For previewing images (createObjectURL for new files, URL for existing)
  const logoPreview = logoFile 
    ? URL.createObjectURL(logoFile) 
    : existingLogoUrl 
    ? `http://localhost:3000/${existingLogoUrl}` 
    : null;
    
  const bgPreview = bgImageFile 
    ? URL.createObjectURL(bgImageFile) 
    : existingBgImageUrl 
    ? `http://localhost:3000/${existingBgImageUrl}` 
    : null;

  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppingFor, setCroppingFor] = useState("logo");
  const [openCrop, setOpenCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [openingHours, setOpeningHours] = useState(
    daysOfWeek.map((day) => ({
      day,
      open: "10:00",
      close: "18:00",
      enabled: true,
    }))
  );

  useEffect(() => {
    async function fetchStoreProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/store-profile", {
          credentials: 'include', // Include cookies for authentication
        });
        if (!res.ok) {
          if (res.status === 401) {
            alert("Please log in to access this page");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch store profile");
        }
        const data = await res.json();
        console.log("Fetched store profile data:", data);
        
        if (data.storeProfile) {
          const sp = data.storeProfile;
          setCompanyDescription(sp.companyDescription || "");
          setCity(sp.city || "");
          setStreet(sp.street || "");
          setPostCode(sp.postCode || "");

          // Set existing image URLs
          setExistingLogoUrl(sp.logo || "");
          setExistingBgImageUrl(sp.bgImage || "");

          setOpeningHours(
            sp.openingHours && sp.openingHours.length === 7
              ? sp.openingHours
              : daysOfWeek.map((day) => ({
                  day,
                  open: "10:00",
                  close: "18:00",
                  enabled: true,
                }))
          );
        }
      } catch (err) {
        console.error("Error fetching store profile:", err);
        alert("Failed to fetch store profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    if (currentUser) {
      fetchStoreProfile();
    } else {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleToggle = (day) => {
    setOpeningHours((prev) =>
      prev.map((entry) =>
        entry.day === day ? { ...entry, enabled: !entry.enabled } : entry
      )
    );
  };

  const updateTime = (day, field, value) => {
    setOpeningHours((prev) =>
      prev.map((entry) =>
        entry.day === day ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setCroppingFor(type);
        setOpenCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels, zoom);
    const fileName = croppingFor === "logo" ? "logo.jpeg" : "background.jpeg";
    const file = new File([croppedBlob], fileName, { type: "image/jpeg" });

    if (croppingFor === "logo") {
      setLogoFile(file);
      // Clear existing logo URL when new file is selected
      setExistingLogoUrl("");
    } else {
      setBgImageFile(file);
      // Clear existing bg image URL when new file is selected
      setExistingBgImageUrl("");
    }
    setOpenCrop(false);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const formData = new FormData();
    formData.append("companyDescription", companyDescription);
    formData.append("city", city);
    formData.append("street", street);
    formData.append("postCode", postCode);
    formData.append("openingHours", JSON.stringify(openingHours));

    if (logoFile) formData.append("logo", logoFile);
    if (bgImageFile) formData.append("bgImage", bgImageFile);

    try {
      const response = await fetch("/api/store-profile", {
        method: "POST",
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Store profile saved response:", result);
      
      // Update existing URLs with new ones from response
      if (result.storeProfile) {
        setExistingLogoUrl(result.storeProfile.logo || existingLogoUrl);
        setExistingBgImageUrl(result.storeProfile.bgImage || existingBgImageUrl);
        // Clear file states after successful save
        setLogoFile(null);
        setBgImageFile(null);
      }
      
      alert("Store profile saved successfully!");
    } catch (error) {
      console.error("Error saving store profile:", error);
      alert("Failed to save store profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageRemove = (type) => {
    if (type === "logo") {
      setLogoFile(null);
      setExistingLogoUrl("");
    } else {
      setBgImageFile(null);
      setExistingBgImageUrl("");
    }
  };

  const fullAddress = [street, city, "Nepal", postCode].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(fullAddress || "Nepal");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8 lg:flex lg:gap-8 relative z-10">
        <aside className="hidden lg:block w-62 sticky top-6 self-start">
          <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
        </aside>

        <main className="flex-1 shadow-md rounded-xl overflow-hidden bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-800">Store Profile</h2>
          <p className="text-gray-500 mb-6">
            Edit contact data visible for your users on the store's profile
          </p>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
            {/* Logo Upload */}
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                    <button
                      onClick={() => handleImageRemove("logo")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-600">Logo</span>
                )}
              </div>
              <input
                id="logoUpload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "logo")}
                className="hidden"
              />
              <label
                htmlFor="logoUpload"
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded shadow"
              >
                {logoPreview ? "Change Logo" : "Upload Logo"}
              </label>
            </div>

            {/* Background Image Upload */}
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="relative w-full rounded-lg overflow-hidden bg-gray-100">
                {bgPreview ? (
                  <>
                    <img
                      src={bgPreview}
                      alt="Background Preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => handleImageRemove("background")}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center text-lg font-bold text-gray-600">
                    Background Image
                  </div>
                )}
              </div>
              <input
                id="bgUpload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "background")}
                className="hidden"
              />
              <label
                htmlFor="bgUpload"
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded shadow"
              >
                {bgPreview ? "Change Background" : "Upload Background Image"}
              </label>
            </div>
          </div>

          {/* Company Description */}
          <label className="block text-sm font-semibold mb-1 text-gray-600">
            Company Description
          </label>
          <textarea
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Write a brief description of your company"
          />

          {/* Store Address */}
          <h3 className="font-bold text-sm text-gray-600 uppercase mb-2">Store Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Country (read-only) */}
            <div>
              <label className="text-sm font-medium text-gray-500">Country</label>
              <input
                value="Nepal"
                readOnly
                disabled
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-medium text-gray-500">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter city name"
              />
            </div>

            {/* Street */}
            <div>
              <label className="text-sm font-medium text-gray-500">Street</label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter street address"
              />
            </div>

            {/* Post Code */}
            <div>
              <label className="text-sm font-medium text-gray-500">Post Code</label>
              <input
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter postal code"
              />
            </div>
          </div>

          {/* Google Map Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Map Preview</h4>
            <div className="border rounded-lg overflow-hidden h-64 w-full">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                allowFullScreen
                loading="lazy"
                title="Store Location Map"
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="mb-6">
            <h3 className="font-bold text-sm text-gray-600 uppercase mb-2">Opening Hours</h3>
            {openingHours.map(({ day, open, close, enabled }) => (
              <div key={day} className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 w-28">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleToggle(day)}
                    className="accent-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">{day}</span>
                </label>
                <input
                  type="time"
                  value={open}
                  onChange={(e) => updateTime(day, "open", e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={!enabled}
                />
                <span>–</span>
                <input
                  type="time"
                  value={close}
                  onChange={(e) => updateTime(day, "close", e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={!enabled}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded shadow flex items-center gap-2"
          >
            {saveLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {saveLoading ? "Saving..." : "Save Store Profile"}
          </button>
        </main>
      </div>

      {/* Cropper Dialog */}
      <Dialog open={openCrop} onClose={() => setOpenCrop(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <div className="relative w-full h-[300px] bg-black">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={croppingFor === "logo" ? 1 : 16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="mt-4">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setOpenCrop(false)}
            className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCropSave}
            className="text-sm px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
          >
            Save
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}