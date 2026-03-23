export interface RealRestaurant {
  id: string;
  name: string;
  price: string;
  distance: string;
  rating: number;
  category: string;
  isCheap: boolean;
  isHealthy: boolean;
  address: string;
  url: string;
}

export const fetchNearbyRestaurants = async (lat: number, lng: number): Promise<RealRestaurant[]> => {
  try {
    // Overpass API Query: Find restaurants within 2000 meters of the given lat/lng
    const query = `
      [out:json];
      (
        node["amenity"="restaurant"](around:2000,${lat},${lng});
        way["amenity"="restaurant"](around:2000,${lat},${lng});
        node["amenity"="cafe"](around:2000,${lat},${lng});
        way["amenity"="cafe"](around:2000,${lat},${lng});
        node["amenity"="fast_food"](around:2000,${lat},${lng});
        way["amenity"="fast_food"](around:2000,${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) throw new Error('Overpass API request failed');

    const data = await response.json();
    if (!data.elements) return [];

    // Helper to calculate distance (Haversine formula)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    return data.elements
      .filter((el: any) => el.tags && el.tags.name)
      .slice(0, 15) // Limit to top 15
      .map((el: any) => {
        const tags = el.tags;
        const dist = calculateDistance(lat, lng, el.lat || el.center?.lat || lat, el.lon || el.center?.lon || lng);
        
        // Heuristics for price and health since OSM data is sparse on these
        const isFastFood = tags.amenity === 'fast_food';
        const cuisine = tags.cuisine || 'Dining';
        
        return {
          id: el.id.toString(),
          name: tags.name,
          price: isFastFood ? "$" : "$$",
          distance: `${dist.toFixed(1)} km`,
          rating: 4.0 + (Math.random() * 1.0), // Mock rating as OSM doesn't have it
          category: cuisine.split(';')[0].charAt(0).toUpperCase() + cuisine.split(';')[0].slice(1),
          isCheap: isFastFood || tags.diet_cheap === 'yes',
          isHealthy: ['vegan', 'vegetarian', 'salad', 'healthy'].some(v => cuisine.toLowerCase().includes(v)),
          address: tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}` : "Nearby",
          url: tags.website || `https://www.google.com/search?q=${encodeURIComponent(tags.name)}`
        };
      });
  } catch (error) {
    console.error("Error fetching restaurants from OpenStreetMap:", error);
    return [];
  }
};
