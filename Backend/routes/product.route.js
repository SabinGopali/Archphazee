import express from 'express';
import { 
  createProduct, 
  getProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts,
  getUserProducts 
} from '../controllers/product.controller.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Product routes
router.post('/create', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'variantImages_0', maxCount: 3 },
  { name: 'variantImages_1', maxCount: 3 },
  { name: 'variantImages_2', maxCount: 3 }
]), createProduct);

router.get('/get/:id', getProduct);
router.get('/all', getAllProducts);
router.get('/user/:userId', getUserProducts);

router.put('/update/:id', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'variantImages_0', maxCount: 3 },
  { name: 'variantImages_1', maxCount: 3 },
  { name: 'variantImages_2', maxCount: 3 }
]), updateProduct);

router.delete('/delete/:id', deleteProduct);

export default router;