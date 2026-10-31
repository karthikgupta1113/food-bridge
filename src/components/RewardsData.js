export const rarityStyles = {
  common: {
    border: "#9CA3AF",
    glow: "#D1D5DB",
    label: "COMMON",
    bgGradient: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
  },
  rare: {
    border: "#3B82F6",
    glow: "#60A5FA",
    label: "RARE",
    bgGradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
  },
  epic: {
    border: "#8B5CF6",
    glow: "#A78BFA",
    label: "EPIC",
    bgGradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
  },
  legendary: {
    border: "#F59E0B",
    glow: "#FCD34D",
    label: "LEGENDARY",
    bgGradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
  },
};

export const rewardsData = [
  // Swiggy
  { id: 18, brand: "Swiggy", reward: "Flat ₹50 off on orders above ₹199", rarity: "common", couponCode: "SWIGGY50", image: "🍕" },
  { id: 19, brand: "Swiggy", reward: "20% off up to ₹100 on food delivery", rarity: "common", couponCode: "SWIGGY20", image: "🍕" },
  { id: 20, brand: "Swiggy", reward: "Free delivery for 1 month", rarity: "rare", couponCode: "SWIGGYFREE", image: "🍕" },

  // Zomato
  { id: 21, brand: "Zomato", reward: "15% off up to ₹75 on orders", rarity: "common", couponCode: "ZOMATO15", image: "🍔" },
  { id: 22, brand: "Zomato", reward: "Flat ₹100 off on orders above ₹399", rarity: "rare", couponCode: "ZOMATO100", image: "🍔" },
  { id: 23, brand: "Zomato", reward: "Buy 1 Get 1 free at select restaurants", rarity: "epic", couponCode: "ZOMATOBOGO", image: "🍔" },

  // Domino's
  { id: 24, brand: "Domino's", reward: "Flat ₹100 off on orders over ₹300", rarity: "rare", couponCode: "DOMINO100", image: "🍕" },
  { id: 25, brand: "Domino's", reward: "40% off on your order (up to ₹150)", rarity: "epic", couponCode: "DOMINO40", image: "🍕" },

  // Fast Food
  { id: 26, brand: "Pizza Hut", reward: "Flat ₹150 off on minimum purchase", rarity: "rare", couponCode: "PIZZAHUT150", image: "🍕" },
  { id: 27, brand: "McDonald's", reward: "Free burger on orders above ₹199", rarity: "epic", couponCode: "MCDONALDS", image: "🍟" },
  { id: 28, brand: "KFC", reward: "Free 2-piece Hot & Crispy on orders above ₹299", rarity: "legendary", couponCode: "KFCFREE", image: "🍗" },
  { id: 29, brand: "Burger King", reward: "50% off on all combos", rarity: "epic", couponCode: "BURGERKING50", image: "🍔" },

  // Biryani & Meals
  { id: 30, brand: "Behrouz Biryani", reward: "Flat ₹200 off on minimum cart value", rarity: "legendary", couponCode: "BEHROUZ200", image: "🍛" },
  { id: 31, brand: "Faasos", reward: "Flat ₹100 off on wraps and meals", rarity: "rare", couponCode: "FAASOS100", image: "🌯" },
  { id: 32, brand: "Ovenstory", reward: "Flat ₹150 off on signature pizzas", rarity: "epic", couponCode: "OVENSTORY150", image: "🍕" },

  // Cafes
  { id: 33, brand: "Starbucks", reward: "20% off on total bill", rarity: "epic", couponCode: "STARBUCKS20", image: "☕" },
  { id: 34, brand: "Chaayos", reward: "1+1 on all hot beverages", rarity: "rare", couponCode: "CHAAYOS11", image: "☕" },

  // Food Chains
  { id: 35, brand: "Box8", reward: "Flat ₹100 off on all-in-meals", rarity: "rare", couponCode: "BOX8100", image: "🍱" },
  { id: 36, brand: "Subway", reward: "Free cookie and beverage on meals", rarity: "common", couponCode: "SUBWAYFREE", image: "🥪" },
  { id: 37, brand: "Haldiram's", reward: "10% off on total bill", rarity: "common", couponCode: "HALDIRAM10", image: "🍿" },
  { id: 38, brand: "Baskin Robbins", reward: "Flat ₹50 off", rarity: "common", couponCode: "BASKIN50", image: "🍦" },
  { id: 39, brand: "Wendy's", reward: "50% off on specific burgers", rarity: "epic", couponCode: "WENDYS50", image: "🍔" },
  { id: 40, brand: "Wow! Momo", reward: "Flat ₹75 off on orders above ₹249", rarity: "rare", couponCode: "WOWMOMO75", image: "🥟" },

  // Shopping
  { id: 41, brand: "Amazon", reward: "10% cashback up to ₹50", rarity: "rare", couponCode: "AMAZON50", image: "📦" },
  { id: 42, brand: "Flipkart", reward: "Flat ₹100 off on select electronics", rarity: "rare", couponCode: "FLIPKART100", image: "📱" },
  { id: 43, brand: "Myntra", reward: "Flat ₹300 off on ₹1499+", rarity: "legendary", couponCode: "MYNTRA300", image: "👗" },
  { id: 44, brand: "Myntra", reward: "10% off on fashion items", rarity: "common", couponCode: "MYNTRA10", image: "👗" },
  { id: 45, brand: "Ajio", reward: "Flat ₹500 off on ₹1990+", rarity: "legendary", couponCode: "AJIO500", image: "👔" },
  { id: 46, brand: "Tata CLiQ", reward: "15% off on apparels", rarity: "epic", couponCode: "TATACLIQ15", image: "👕" },
  { id: 47, brand: "Reliance Digital", reward: "Flat ₹200 off on electronics", rarity: "rare", couponCode: "RELIANCE200", image: "💻" },
  { id: 48, brand: "Croma", reward: "Flat ₹500 off on appliances", rarity: "legendary", couponCode: "CROMA500", image: "🔌" },

  // Fashion
  { id: 49, brand: "Lifestyle", reward: "Flat ₹200 off on spends above ₹999", rarity: "rare", couponCode: "LIFESTYLE200", image: "👜" },
  { id: 50, brand: "Shoppers Stop", reward: "10% off on cart", rarity: "common", couponCode: "SHOPPERS10", image: "🛍️" },
  { id: 51, brand: "Pantaloons", reward: "Flat ₹150 off on ₹1000+", rarity: "rare", couponCode: "PANTALOONS150", image: "👖" },
  { id: 52, brand: "Max Fashion", reward: "Flat ₹100 off", rarity: "common", couponCode: "MAXFASHION100", image: "👗" },
  { id: 53, brand: "Westside", reward: "10% off on total bill", rarity: "common", couponCode: "WESTSIDE10", image: "👕" },

  // Kids & Eyewear
  { id: 54, brand: "FirstCry", reward: "40% off on baby essentials", rarity: "legendary", couponCode: "FIRSTCRY40", image: "👶" },
  { id: 55, brand: "Lenskart", reward: "₹500 off on spectacles", rarity: "legendary", couponCode: "LENSKART500", image: "👓" },
  { id: 56, brand: "Titan EyePlus", reward: "15% off on lenses", rarity: "epic", couponCode: "TITANEYE15", image: "👓" },

  // Beauty
  { id: 57, brand: "Nykaa", reward: "Flat ₹100 off on orders above ₹999", rarity: "rare", couponCode: "NYKAA100", image: "💄" },
  { id: 58, brand: "Purplle", reward: "20% off on beauty products", rarity: "epic", couponCode: "PURPLLE20", image: "💄" },
  { id: 59, brand: "Sugar Cosmetics", reward: "Flat ₹100 off", rarity: "rare", couponCode: "SUGAR100", image: "💄" },

  // Grooming
  { id: 60, brand: "The Man Company", reward: "25% off on grooming kits", rarity: "epic", couponCode: "MANCOMPANY25", image: "🧴" },
  { id: 61, brand: "Beardo", reward: "Flat ₹200 off on ₹799+", rarity: "rare", couponCode: "BEARDO200", image: "🧴" },
  { id: 62, brand: "Bombay Shaving", reward: "30% off", rarity: "epic", couponCode: "BOMBAY30", image: "🧴" },
  { id: 63, brand: "Bath & Body Works", reward: "Flat ₹250 off", rarity: "legendary", couponCode: "BBW250", image: "🧼" },
  { id: 64, brand: "Marks & Spencer", reward: "15% off", rarity: "epic", couponCode: "MARKS15", image: "👕" },
];


export const getRandomReward = () => {
  const randomIndex = Math.floor(Math.random() * rewardsData.length);
  return rewardsData[randomIndex];
};

export const getRewardById = (id) => {
  return rewardsData.find((reward) => reward.id === id);
};

export const getRewardsByRarity = (rarity) => {
  return rewardsData.filter((reward) => reward.rarity === rarity);
};

export const getRewardsByBrand = (brand) => {
  return rewardsData.filter((reward) => reward.brand === brand);
};

export const getAllBrands = () => {
  return [...new Set(rewardsData.map((reward) => reward.brand))];
};
