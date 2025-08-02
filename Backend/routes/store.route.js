import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../utils/verifyUser.js';
import { 
  getStoreProfile, 
  createOrUpdateStoreProfile, 
  deleteStoreProfile 
} from '../controllers/store.controller.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/store/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
router.get('/store-profile', verifyToken, getStoreProfile);
router.post('/store-profile', 
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bgImage", maxCount: 1 },
  ]),
  createOrUpdateStoreProfile
);
router.delete('/store-profile', verifyToken, deleteStoreProfile);

// Legacy route for backward compatibility
router.post('/create',
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bgImage", maxCount: 1 },
  ]),
  createOrUpdateStoreProfile
);

export default router;