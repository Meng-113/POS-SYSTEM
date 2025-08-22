import { Product, Sale, Category } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Shirt',
    category: 'Shirts',
    price: 3,
    image:
      'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '4',
    name: 'Shirt',
    category: 'Shirts',
    price: 6,
    image: '/shirt_6.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '5',
    name: 'Shirt',
    category: 'Shirts',
    price: 7,
    image: '/shirt_7.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '6',
    name: 'Shirt',
    category: 'Shirts',
    price: 8,
    image: '/shirt_8.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '7',
    name: 'Shirt',
    category: 'Shirts',
    price: 9,
    image: '/shirt_9.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '8',
    name: 'Shirt',
    category: 'Shirts',
    price: 10,
    image: '/shirt_10.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '15',
    name: 'Jeans',
    category: 'Jeans',
    price: 10,
    image: '/jean_10.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '17',
    name: 'Jeans',
    category: 'Jeans',
    price: 12,
    image: '/jean_12.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '19',
    name: 'Jeans',
    category: 'Jeans',
    price: 14,
    image: '/jean_14.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '22',
    name: 'Sets',
    category: 'Sets',
    price: 12,
    image: '/set_12.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  {
    id: '66',
    name: 'Socks',
    category: 'Socks',
    price: 1.5,
    image: '/Socks.jpg',
    stock: 500,
  },
  {
    id: '68',
    name: 'Skirts',
    category: 'Skirts',
    price: 10,
    image: '/skirt_10.jpg',
    stock: 500,
    sizes: ['S', 'M', 'L', 'Free Size'],
  },
  // ... keep the rest unchanged (external URLs can stay as they are)
];

export const mockSales: Sale[] = [];

export const mockCategories: Category[] = [
  { id: '1', name: 'Shirts', color: '#F59E0B', icon: '👕' },
  { id: '2', name: 'Jeans', color: '#06B6D4', icon: '👖' },
  { id: '3', name: 'Sets', color: '#10B981', icon: '🧥' },
  // ...
];

export const banks = [
  'ABA Bank',
  'Acleda Bank',
  'Wing Bank',
  'Vattanac Bank',
  'Canadia Bank',
  'Chip Mong Commercial Bank',
  'Prince Bank',
  'FTB Bank',
];

export const USD_TO_KHR_RATE = 4100;
