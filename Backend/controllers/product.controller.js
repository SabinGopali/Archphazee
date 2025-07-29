import Product from '../models/product.model.js';
import { errorHandler } from '../utils/error.js';
import fs from 'fs';
import path from 'path';

// Helper function to delete files
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Create product
export const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      category,
      brand,
      description,
      price,
      specialPrice,
      stock,
      sku,
      freeItems,
      available,
      warrantyType,
      warrantyPeriod,
      warrantyPolicy,
      userRef,
      userMail,
      variants
    } = req.body;

    // Process main product images
    const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    
    if (images.length === 0) {
      return next(errorHandler(400, 'At least one product image is required'));
    }

    // Process variants
    let processedVariants = [];
    if (variants) {
      const variantsData = JSON.parse(variants);
      
      variantsData.forEach((variant, index) => {
        if (variant.name.trim()) {
          const variantImages = req.files[`variantImages_${index}`] 
            ? req.files[`variantImages_${index}`].map(file => file.path) 
            : [];
          
          processedVariants.push({
            name: variant.name.trim(),
            images: variantImages
          });
        }
      });
    }

    const newProduct = new Product({
      productName,
      category,
      brand,
      description,
      price: parseFloat(price),
      specialPrice: specialPrice ? parseFloat(specialPrice) : null,
      stock: stock ? parseInt(stock) : 0,
      sku: sku || '',
      freeItems: freeItems || '',
      available: available === 'true',
      warrantyType: warrantyType || '',
      warrantyPeriod: warrantyPeriod || '',
      warrantyPolicy: warrantyPolicy || '',
      images,
      variants: processedVariants,
      userRef,
      userMail
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error('Error creating product:', error);
    next(errorHandler(500, error.message));
  }
};

// Get single product
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(errorHandler(404, 'Product not found'));
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    next(errorHandler(500, error.message));
  }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(errorHandler(500, error.message));
  }
};

// Get user products
export const getUserProducts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ userRef: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ userRef: userId });

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching user products:', error);
    next(errorHandler(500, error.message));
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return next(errorHandler(404, 'Product not found'));
    }

    const {
      productName,
      category,
      brand,
      description,
      price,
      specialPrice,
      stock,
      sku,
      freeItems,
      available,
      warrantyType,
      warrantyPeriod,
      warrantyPolicy,
      existingImages,
      imagesToDelete,
      variants
    } = req.body;

    // Handle image deletions
    if (imagesToDelete) {
      const imagesToDeleteArray = JSON.parse(imagesToDelete);
      imagesToDeleteArray.forEach(imagePath => {
        deleteFile(imagePath);
      });
    }

    // Process main product images
    let updatedImages = [];
    
    // Keep existing images
    if (existingImages) {
      const existingImagesArray = JSON.parse(existingImages);
      updatedImages = [...existingImagesArray];
    }
    
    // Add new images
    if (req.files['images']) {
      const newImages = req.files['images'].map(file => file.path);
      updatedImages = [...updatedImages, ...newImages];
    }

    if (updatedImages.length === 0) {
      return next(errorHandler(400, 'At least one product image is required'));
    }

    // Process variants
    let processedVariants = [];
    if (variants) {
      const variantsData = JSON.parse(variants);
      
      variantsData.forEach((variant, index) => {
        if (variant.name.trim()) {
          let variantImages = [...(variant.existingImages || [])];
          
          // Handle variant image deletions
          if (variant.imagesToDelete && variant.imagesToDelete.length > 0) {
            variant.imagesToDelete.forEach(imagePath => {
              deleteFile(imagePath);
            });
          }
          
          // Add new variant images
          if (req.files[`variantImages_${index}`]) {
            const newVariantImages = req.files[`variantImages_${index}`].map(file => file.path);
            variantImages = [...variantImages, ...newVariantImages];
          }
          
          processedVariants.push({
            name: variant.name.trim(),
            images: variantImages
          });
        }
      });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        productName,
        category,
        brand,
        description,
        price: parseFloat(price),
        specialPrice: specialPrice ? parseFloat(specialPrice) : null,
        stock: stock ? parseInt(stock) : 0,
        sku: sku || '',
        freeItems: freeItems || '',
        available: available === 'true',
        warrantyType: warrantyType || '',
        warrantyPeriod: warrantyPeriod || '',
        warrantyPolicy: warrantyPolicy || '',
        images: updatedImages,
        variants: processedVariants
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);

  } catch (error) {
    console.error('Error updating product:', error);
    next(errorHandler(500, error.message));
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(errorHandler(404, 'Product not found'));
    }

    // Delete all associated images
    product.images.forEach(imagePath => {
      deleteFile(imagePath);
    });

    // Delete variant images
    product.variants.forEach(variant => {
      variant.images.forEach(imagePath => {
        deleteFile(imagePath);
      });
    });

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Error deleting product:', error);
    next(errorHandler(500, error.message));
  }
};