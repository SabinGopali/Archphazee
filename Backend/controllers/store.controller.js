import StoreProfile from '../models/StoreProfile.js';

// Get store profile
export const getStoreProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // from verifyToken middleware

    const storeProfile = await StoreProfile.findOne({ userId });
    
    res.status(200).json({ 
      storeProfile: storeProfile || null 
    });
  } catch (err) {
    console.error("Error fetching store profile:", err);
    res.status(500).json({ message: "Failed to fetch store profile" });
  }
};

// Create or Update store profile
export const createOrUpdateStoreProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // from verifyToken middleware

    const {
      companyDescription,
      city,
      street,
      postCode,
      openingHours,
    } = req.body;

    const logo = req.files?.logo?.[0]?.path?.replace(/\\/g, "/") || "";
    const bgImage = req.files?.bgImage?.[0]?.path?.replace(/\\/g, "/") || "";

    let parsedOpeningHours = [];
    try {
      parsedOpeningHours = JSON.parse(openingHours || "[]");
    } catch (e) {
      return res.status(400).json({ message: "Invalid openingHours format" });
    }

    // Check if profile already exists for user
    const existingProfile = await StoreProfile.findOne({ userId });
    
    if (existingProfile) {
      // Update existing profile
      existingProfile.companyDescription = companyDescription || existingProfile.companyDescription;
      existingProfile.city = city || existingProfile.city;
      existingProfile.street = street || existingProfile.street;
      existingProfile.postCode = postCode || existingProfile.postCode;
      existingProfile.openingHours = parsedOpeningHours.length > 0 ? parsedOpeningHours : existingProfile.openingHours;
      
      // Only update images if new ones are provided
      if (logo) existingProfile.logo = logo;
      if (bgImage) existingProfile.bgImage = bgImage;

      await existingProfile.save();
      res.status(200).json({ 
        message: "Profile updated successfully", 
        storeProfile: existingProfile 
      });
    } else {
      // Create new profile
      const newProfile = new StoreProfile({
        userId,
        companyDescription,
        city,
        street,
        postCode,
        openingHours: parsedOpeningHours,
        logo,
        bgImage,
      });

      await newProfile.save();
      res.status(201).json({ 
        message: "Profile created successfully", 
        storeProfile: newProfile 
      });
    }
  } catch (err) {
    console.error("Error creating/updating store profile:", err);
    res.status(500).json({ message: "Failed to save store profile" });
  }
};

// Delete store profile
export const deleteStoreProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const deletedProfile = await StoreProfile.findOneAndDelete({ userId });
    
    if (!deletedProfile) {
      return res.status(404).json({ message: "Store profile not found" });
    }

    res.status(200).json({ message: "Store profile deleted successfully" });
  } catch (err) {
    console.error("Error deleting store profile:", err);
    res.status(500).json({ message: "Failed to delete store profile" });
  }
};