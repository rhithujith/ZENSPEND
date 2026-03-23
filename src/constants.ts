import { Restaurant } from "./types";

export const MOCK_RESTAURANTS: Restaurant[] = [
  { 
    id: '1', name: 'Spice Garden', price: '$$', distance: '1.2 km', rating: 4.5, category: 'Local', 
    isCheap: false, isHealthy: true, reviews: 1240, tasteProfile: ['Spicy', 'Aromatic', 'Traditional'] 
  },
  { 
    id: '2', name: 'Burger King', price: '$', distance: '0.8 km', rating: 4.0, category: 'Western', 
    isCheap: true, isHealthy: false, reviews: 8500, tasteProfile: ['Savory', 'Flame-grilled'] 
  },
  { 
    id: '3', name: 'Dosa Plaza', price: '$', distance: '0.5 km', rating: 4.8, category: 'Local', 
    isCheap: true, isHealthy: true, reviews: 3200, tasteProfile: ['Crispy', 'Tangy'] 
  },
  { 
    id: '4', name: 'Pizza Hut', price: '$$', distance: '2.1 km', rating: 4.2, category: 'Western', 
    isCheap: false, isHealthy: false, reviews: 5400, tasteProfile: ['Cheesy', 'Classic'] 
  },
  { 
    id: '5', name: 'Biryani House', price: '$$', distance: '1.5 km', rating: 4.7, category: 'Local', 
    isCheap: false, isHealthy: false, reviews: 2100, tasteProfile: ['Rich', 'Flavorful'] 
  },
  { 
    id: '6', name: 'Street Tacos', price: '$', distance: '0.3 km', rating: 4.3, category: 'Western', 
    isCheap: true, isHealthy: true, reviews: 980, tasteProfile: ['Fresh', 'Zesty'] 
  },
  { 
    id: '7', name: 'Amma\'s Kitchen', price: '$', distance: '0.9 km', rating: 4.9, category: 'Local', 
    isCheap: true, isHealthy: true, reviews: 450, tasteProfile: ['Home-cooked', 'Nutritious'] 
  },
  { 
    id: '8', name: 'Noodle Bar', price: '$', distance: '1.1 km', rating: 4.1, category: 'Western', 
    isCheap: true, isHealthy: true, reviews: 1100, tasteProfile: ['Umami', 'Quick'] 
  },
];
