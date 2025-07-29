import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const productsDir = path.join(uploadsDir, 'products');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/backend/product/all', (req, res) => {
  res.json({
    products: [],
    totalPages: 0,
    currentPage: 1,
    total: 0
  });
});

// Mock get product route
app.get('/backend/product/get/:id', (req, res) => {
  const { id } = req.params;
  
  // Mock product data
  const mockProduct = {
    _id: id,
    productName: "Sample Product",
    category: "Test FY SOP Category 1",
    brand: "No Brand",
    description: "<p>This is a sample product description</p>",
    price: 100,
    specialPrice: 80,
    stock: 10,
    sku: "SKU001",
    freeItems: "",
    available: true,
    warrantyType: "",
    warrantyPeriod: "",
    warrantyPolicy: "",
    images: [
      "uploads/products/sample1.jpg",
      "uploads/products/sample2.jpg"
    ],
    variants: [
      {
        name: "Red",
        images: ["uploads/products/variant1.jpg"]
      },
      {
        name: "Blue", 
        images: ["uploads/products/variant2.jpg"]
      }
    ],
    userRef: "mockUserId",
    userMail: "test@example.com",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  res.json(mockProduct);
});

// Mock update product route
app.put('/backend/product/update/:id', (req, res) => {
  const { id } = req.params;
  
  // Mock successful update response
  res.json({
    _id: id,
    ...req.body,
    updatedAt: new Date()
  });
});

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
});

app.listen(3000, () => {
    console.log('Test server is running on port 3000');
});