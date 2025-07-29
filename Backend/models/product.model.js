import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    default: []
  }]
}, { _id: false });

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  specialPrice: {
    type: Number,
    min: 0,
    default: null
  },
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    trim: true,
    default: ''
  },
  freeItems: {
    type: String,
    trim: true,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  },
  warrantyType: {
    type: String,
    enum: ['Manufacturer', 'Seller', 'No', ''],
    default: ''
  },
  warrantyPeriod: {
    type: String,
    trim: true,
    default: ''
  },
  warrantyPolicy: {
    type: String,
    trim: true,
    default: ''
  },
  images: [{
    type: String,
    required: true
  }],
  variants: [variantSchema],
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userMail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
productSchema.index({ userRef: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ available: 1 });
productSchema.index({ productName: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;