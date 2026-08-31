/**
 * Trip Planner Utility Functions
 * Contains helper functions and static fallback mock templates
 */

// Generate a simple unique ID for stops/days
export const generateId = () => {
  return 'id-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
};

// Formatting helper for pricing or durations
export const formatDuration = (val) => {
  if (!val) return 'Flexible';
  return val;
};

// Rich template itinerary for Tokyo (fallback if LLM API is unavailable/erroring)
export const DEFAULT_TOKYO_ITINERARY = [
  {
    id: generateId(),
    dayNumber: 1,
    title: "Arrival & Akihabara Electric Town",
    theme: "Neon Lights & Pop Culture",
    stops: [
      {
        id: generateId(),
        time: "Morning",
        activity: "Arrive at Haneda Airport & Check-in",
        description: "Land, clear customs, pick up your Suica card, and head to your hotel in central Tokyo to drop off bags.",
        location: "Haneda Airport Terminal 3, Ota City, Tokyo",
        duration: "2 hours",
        cost: "¥1,200 (Train)"
      },
      {
        id: generateId(),
        time: "Afternoon",
        activity: "Explore Akihabara Electric Town",
        description: "Walk down Chuo Dori. Browse retro video games at Super Potato, multi-story anime shops like Radio Kaikan, and tax-free electronics.",
        location: "1 Chome Sotokanda, Chiyoda City, Tokyo",
        duration: "3.5 hours",
        cost: "Free (Browsing)"
      },
      {
        id: generateId(),
        time: "Evening",
        activity: "Themed Dinner & Arcade Gaming",
        description: "Have a bite at a themed café, then head to Gigo Akihabara for claw machines and rhythm games like Taiko no Tatsujin.",
        location: "Gigo Akihabara #1, 1 Chome-10-9 Sotokanda, Chiyoda City",
        duration: "2.5 hours",
        cost: "¥3,000"
      }
    ]
  },
  {
    id: generateId(),
    dayNumber: 2,
    title: "Historic Asakusa & Futuristic Shibuya",
    theme: "Tradition Meets Modernity",
    stops: [
      {
        id: generateId(),
        time: "Morning",
        activity: "Sensō-ji Temple & Nakamise Shopping Street",
        description: "Pass under the Kaminarimon Gate to visit Tokyo's oldest Buddhist temple. Try freshly baked melonpan on Nakamise Street.",
        location: "2 Chome-3-1 Asakusa, Taito City, Tokyo",
        duration: "2 hours",
        cost: "Free entrance"
      },
      {
        id: generateId(),
        time: "Afternoon",
        activity: "Shibuya Crossing & Hachiko Statue",
        description: "Take the Ginza line to Shibuya. Cross the famous scramble crossing and take photos with the iconic Hachiko memorial statue.",
        location: "2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo",
        duration: "1.5 hours",
        cost: "Free"
      },
      {
        id: generateId(),
        time: "Evening",
        activity: "Sunset Views at Shibuya Sky & Izakaya Dinner",
        description: "Enjoy 360-degree open-air views of Tokyo from Shibuya Sky (book tickets in advance!). Afterwards, head to Nonbei Yokocho for cozy yakitori skewers.",
        location: "Shibuya Scramble Square, 2 Chome-24-12 Shibuya, Tokyo",
        duration: "3 hours",
        cost: "¥2,200 (Sky ticket) + dinner"
      }
    ]
  },
  {
    id: generateId(),
    dayNumber: 3,
    title: "Meiji Shrine & Harajuku Culture",
    theme: "Nature and Quirky Fashion",
    stops: [
      {
        id: generateId(),
        time: "Morning",
        activity: "Stroll Through Meiji Jingu Forest",
        description: "Walk through the massive wooden torii gates into a tranquil forest sanctuary dedicated to Emperor Meiji and Empress Shoken.",
        location: "1-1 Yoyogikamizonocho, Shibuya City, Tokyo",
        duration: "2 hours",
        cost: "Free"
      },
      {
        id: generateId(),
        time: "Afternoon",
        activity: "Takeshita Street Shopping & Crepe Snack",
        description: "Walk down Takeshita Street, the epicenter of Tokyo's kawaii youth culture. Stop by Marion Crepes for a classic sweet strawberry crepe.",
        location: "1 Chome Jingumae, Shibuya City, Tokyo",
        duration: "2 hours",
        cost: "¥800"
      },
      {
        id: generateId(),
        time: "Evening",
        activity: "Explore Trendy Omotesando Hills",
        description: "Stroll down the tree-lined avenue of Omotesando, known for architectural flagships, cafes, and stylish boutique shopping.",
        location: "4 Chome Jingumae, Shibuya City, Tokyo",
        duration: "2.5 hours",
        cost: "Free (Dinner extra)"
      }
    ]
  }
];

// Helper to validate and clean up a parsed itinerary object
export const sanitizeItinerary = (rawItinerary) => {
  if (!rawItinerary || typeof rawItinerary !== 'object') {
    throw new Error('Itinerary data is not an object or array.');
  }

  const daysArray = Array.isArray(rawItinerary) 
    ? rawItinerary 
    : (rawItinerary.days || rawItinerary.itinerary || rawItinerary.trip || []);

  if (!Array.isArray(daysArray) || daysArray.length === 0) {
    throw new Error('No travel days found in the response.');
  }

  return daysArray.map((day, dIdx) => {
    // Defend against null or non-object day elements
    const dayObj = (day && typeof day === 'object') ? day : {};
    const rawStops = Array.isArray(dayObj.stops) ? dayObj.stops : [];
    
    return {
      id: dayObj.id || generateId(),
      dayNumber: Number(dayObj.dayNumber || dayObj.day || (dIdx + 1)),
      title: String(dayObj.title || dayObj.theme || `Day ${dIdx + 1}`).trim(),
      theme: String(dayObj.theme || dayObj.title || 'Sightseeing').trim(),
      stops: rawStops.map((stop) => {
        // Defend against null or non-object stop elements
        const stopObj = (stop && typeof stop === 'object') ? stop : {};
        return {
          id: stopObj.id || generateId(),
          time: String(stopObj.time || 'Flexible').trim(),
          activity: String(stopObj.activity || stopObj.name || stopObj.title || 'Unnamed Stop').trim(),
          description: String(stopObj.description || stopObj.details || 'No description provided.').trim(),
          location: String(stopObj.location || stopObj.address || 'Flexible Location').trim(),
          duration: String(stopObj.duration || stopObj.timeSpent || 'Flexible').trim(),
          cost: String(stopObj.cost || stopObj.price || 'N/A').trim()
        };
      })
    };
  });
};
