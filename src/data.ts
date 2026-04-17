import { Product } from './types';

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/electronics-357edc77-1775939180712.webp' },
  { id: 'clothing', name: 'Clothing', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/clothing-ffb860c9-1775939181928.webp' },
  { id: 'home', name: 'Home & Garden', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/home-garden-9c6993fc-1775939181716.webp' },
  { id: 'beauty', name: 'Beauty & Health', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/beauty-health-90fc52d7-1775939181626.webp' },
  { id: 'books', name: 'Books & Hobbies', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/books-category-icon-3a6c274c-1775997208474.webp' },
  { id: 'sports', name: 'Sports & Outdoors', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/sports-category-icon-71b6f77e-1775997199348.webp' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Used iPhone 13 - Like New',
    price: 45000,
    description: 'Perfect condition, 128GB, blue color. Comes with original box and cable.',
    category: 'electronics',
    image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/product-iphone-b7651e25-1775934057392.webp',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/product-iphone-b7651e25-1775934057392.webp'],
    location: 'Bole, Addis Ababa',
    user_id: 'mock-user-1',
    created_at: new Date().toISOString(),
    seller_phone: '+251911223344'
  },
  {
    id: '2',
    title: 'Vintage 90s Windbreaker',
    price: 1200,
    description: 'Authentic retro windbreaker. Oversized fit, perfect for festivals.',
    category: 'clothing',
    image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/product-jacket-fef66fce-1775934058450.webp',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/product-jacket-fef66fce-1775934058450.webp'],
    location: 'Sarbet, Addis Ababa',
    user_id: 'mock-user-2',
    created_at: new Date().toISOString(),
    seller_phone: '+251911334455'
  },
  {
    id: '3',
    title: 'Nespresso Espresso Machine',
    price: 15000,
    description: 'Great condition, well maintained. Makes amazing coffee in seconds.',
    category: 'home',
    image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/product-coffee-maker-ba1152ad-1775934059749.webp',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/3b11593f-4a99-48dc-80dd-e4d53eadcf78/product-coffee-maker-ba1152ad-1775934059749.webp'],
    location: 'Old Airport, Addis Ababa',
    user_id: 'mock-user-1',
    created_at: new Date().toISOString(),
    seller_phone: '+251911223344'
  }
];