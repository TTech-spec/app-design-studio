// Sample data for AGRICON NG prototype
export const CROP_CATEGORIES = [
  { id: "grains", name: "Grains & Cereals", icon: "🌾", count: 1284 },
  { id: "tubers", name: "Tubers & Roots", icon: "🍠", count: 862 },
  { id: "vegetables", name: "Vegetables", icon: "🥬", count: 1042 },
  { id: "fruits", name: "Fruits", icon: "🍊", count: 728 },
  { id: "legumes", name: "Legumes & Beans", icon: "🫘", count: 511 },
  { id: "livestock", name: "Livestock", icon: "🐄", count: 344 },
  { id: "poultry", name: "Poultry & Eggs", icon: "🥚", count: 622 },
  { id: "cash", name: "Cash Crops", icon: "☕", count: 289 },
];

export const FARMS = [
  { id: "f1", name: "Kolawole Family Farms", owner: "Adekunle Kolawole", location: "Oyo State", crops: ["Cassava", "Yam", "Maize"], rating: 4.9, reviews: 214, verified: true, size: "42 hectares", img: "farm-lush-greens" },
  { id: "f2", name: "Sahel Grains Co.", owner: "Fatima Bello", location: "Kano State", crops: ["Rice", "Millet", "Sorghum"], rating: 4.8, reviews: 189, verified: true, size: "128 hectares", img: "farm-golden-fields" },
  { id: "f3", name: "Green Delta Farms", owner: "Chinedu Okafor", location: "Delta State", crops: ["Plantain", "Palm Oil", "Cocoa"], rating: 4.7, reviews: 156, verified: true, size: "88 hectares", img: "farm-tropical" },
  { id: "f4", name: "Northern Harvest Co-op", owner: "Musa Ibrahim", location: "Kaduna State", crops: ["Tomato", "Onion", "Pepper"], rating: 4.9, reviews: 342, verified: true, size: "64 hectares", img: "farm-vegetables" },
  { id: "f5", name: "Ogun Poultry Estate", owner: "Blessing Adeyemi", location: "Ogun State", crops: ["Eggs", "Broilers"], rating: 4.6, reviews: 98, verified: false, size: "12 hectares", img: "farm-poultry" },
  { id: "f6", name: "Cross River Cocoa", owner: "Emeka Nwosu", location: "Cross River", crops: ["Cocoa", "Coffee"], rating: 4.8, reviews: 176, verified: true, size: "56 hectares", img: "farm-cocoa" },
];

export const CROPS = [
  { id: "c1", name: "Premium White Cassava", farm: "Kolawole Family Farms", price: "₦48,000", unit: "per tonne", stock: "24 tonnes", rating: 4.9, season: "In season", verified: true },
  { id: "c2", name: "Long-grain Ofada Rice", farm: "Sahel Grains Co.", price: "₦52,000", unit: "per 50kg bag", stock: "180 bags", rating: 4.8, season: "Harvest ready", verified: true },
  { id: "c3", name: "Sweet Plantain (Ripe)", farm: "Green Delta Farms", price: "₦18,500", unit: "per bunch", stock: "62 bunches", rating: 4.7, season: "In season", verified: true },
  { id: "c4", name: "Roma Tomatoes Grade A", farm: "Northern Harvest Co-op", price: "₦28,000", unit: "per basket", stock: "94 baskets", rating: 4.9, season: "Peak season", verified: true },
  { id: "c5", name: "Fresh Free-range Eggs", farm: "Ogun Poultry Estate", price: "₦4,200", unit: "per crate", stock: "312 crates", rating: 4.6, season: "Year-round", verified: false },
  { id: "c6", name: "Raw Cocoa Beans", farm: "Cross River Cocoa", price: "₦1,850,000", unit: "per tonne", stock: "6 tonnes", rating: 4.8, season: "Just harvested", verified: true },
];

export const MESSAGES = [
  { id: "m1", from: "Adekunle Kolawole", farm: "Kolawole Family Farms", last: "Yes, we can arrange delivery to Lagos next week.", time: "2m", unread: 2, online: true },
  { id: "m2", from: "Fatima Bello", farm: "Sahel Grains Co.", last: "Sent you the harvest schedule for Q1", time: "1h", unread: 0, online: true },
  { id: "m3", from: "Chinedu Okafor", farm: "Green Delta Farms", last: "The plantains will be ready by Friday", time: "3h", unread: 1, online: false },
  { id: "m4", from: "Musa Ibrahim", farm: "Northern Harvest Co-op", last: "Photos attached — Grade A tomatoes", time: "Yesterday", unread: 0, online: false },
  { id: "m5", from: "Blessing Adeyemi", farm: "Ogun Poultry Estate", last: "Thanks for the review!", time: "2d", unread: 0, online: false },
];

export const NOTIFICATIONS = [
  { id: "n1", type: "verify", title: "Verification complete", body: "Your farm profile is now verified. Start listing crops.", time: "2m ago", unread: true },
  { id: "n2", type: "message", title: "New message from Fatima Bello", body: "Sent you the harvest schedule for Q1", time: "1h ago", unread: true },
  { id: "n3", type: "listing", title: "Listing performance", body: "Your Cassava listing was viewed 42 times today", time: "3h ago", unread: false },
  { id: "n4", type: "harvest", title: "Harvest reminder", body: "Rice harvest window opens in 5 days for Sahel Grains", time: "1d ago", unread: false },
  { id: "n5", type: "review", title: "New 5-star review", body: "Chinedu left a review on your Plantain listing", time: "2d ago", unread: false },
];

export const REVIEWS = [
  { id: "r1", author: "Emeka Nwosu", rating: 5, time: "3 days ago", text: "Absolutely premium quality cassava. Delivery was on time and packaging was excellent. Will definitely order again for our processing plant." },
  { id: "r2", author: "Fatima Bello", rating: 5, time: "1 week ago", text: "One of the most reliable farmers I've worked with on Agricon. Transparent pricing, great communication, and consistent quality." },
  { id: "r3", author: "Blessing Adeyemi", rating: 4, time: "2 weeks ago", text: "Good produce and fair pricing. Communication could be slightly faster but overall a solid partner." },
];

export const HARVEST_TIMELINE = [
  { month: "Jan", crop: "Cassava", status: "harvesting" },
  { month: "Feb", crop: "Cassava", status: "harvesting" },
  { month: "Mar", crop: "Maize planting", status: "planting" },
  { month: "Apr", crop: "Yam planting", status: "planting" },
  { month: "Jul", crop: "Maize harvest", status: "harvesting" },
  { month: "Oct", crop: "Yam harvest", status: "harvesting" },
];

export const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "ha", name: "Hausa", native: "Hausa", flag: "🇳🇬" },
  { code: "yo", name: "Yoruba", native: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", native: "Ìgbò", flag: "🇳🇬" },
  { code: "pcm", name: "Pidgin", native: "Naija", flag: "🇳🇬" },
];

export const SCREENS: { slug: string; title: string; section: string }[] = [
  { slug: "splash", title: "Splash", section: "Auth" },
  { slug: "intro", title: "App Introduction", section: "Auth" },
  { slug: "welcome", title: "Welcome Carousel", section: "Auth" },
  { slug: "language", title: "Language Selection", section: "Auth" },
  { slug: "login", title: "Login", section: "Auth" },
  { slug: "signup", title: "Sign Up", section: "Auth" },
  { slug: "otp", title: "OTP Verification", section: "Auth" },
  { slug: "create-password", title: "Create Password", section: "Auth" },
  { slug: "forgot-password", title: "Forgot Password", section: "Auth" },
  { slug: "password-reset-success", title: "Reset Success", section: "Auth" },
  { slug: "user-type", title: "Choose User Type", section: "Onboarding" },
  { slug: "personal-info", title: "Personal Information", section: "Onboarding" },
  { slug: "contact-info", title: "Contact Information", section: "Onboarding" },
  { slug: "profile-photo", title: "Profile Photo Upload", section: "Onboarding" },
  { slug: "farm-info", title: "Farm Information", section: "Onboarding" },
  { slug: "business-info", title: "Business Information", section: "Onboarding" },
  { slug: "document-upload", title: "Document Upload", section: "Onboarding" },
  { slug: "verification-submitted", title: "Verification Submitted", section: "Onboarding" },
  { slug: "verification-status", title: "Verification Status", section: "Onboarding" },
  { slug: "home", title: "Home", section: "Marketplace" },
  { slug: "marketplace", title: "Marketplace", section: "Marketplace" },
  { slug: "categories", title: "Categories", section: "Marketplace" },
  { slug: "search", title: "Search", section: "Marketplace" },
  { slug: "search-results", title: "Search Results", section: "Marketplace" },
  { slug: "filters", title: "Filters", section: "Marketplace" },
  { slug: "featured-farms", title: "Featured Farms", section: "Marketplace" },
  { slug: "seasonal", title: "Seasonal Produce", section: "Marketplace" },
  { slug: "farm-profile", title: "Farm Profile", section: "Farm & Crop" },
  { slug: "farmer-profile", title: "Farmer Profile", section: "Farm & Crop" },
  { slug: "crop-details", title: "Crop Details", section: "Farm & Crop" },
  { slug: "photo-gallery", title: "Photo Gallery", section: "Farm & Crop" },
  { slug: "reviews", title: "Reviews & Ratings", section: "Farm & Crop" },
  { slug: "harvest-timeline", title: "Harvest Timeline", section: "Farm & Crop" },
  { slug: "farm-map", title: "Farm Location Map", section: "Farm & Crop" },
  { slug: "contact-farmer", title: "Contact Farmer", section: "Farm & Crop" },
  { slug: "messages", title: "Messages", section: "Communication" },
  { slug: "chat", title: "Chat Conversation", section: "Communication" },
  { slug: "image-viewer", title: "Image Viewer", section: "Communication" },
  { slug: "notifications", title: "Notifications", section: "Communication" },
  { slug: "farmer-dashboard", title: "Farmer Dashboard", section: "Dashboards" },
  { slug: "my-farms", title: "My Farms", section: "Dashboards" },
  { slug: "my-listings", title: "My Crop Listings", section: "Dashboards" },
  { slug: "listing-performance", title: "Listing Performance", section: "Dashboards" },
  { slug: "distributor-dashboard", title: "Distributor Dashboard", section: "Dashboards" },
  { slug: "saved-farms", title: "Saved Farms", section: "Dashboards" },
  { slug: "inquiry-history", title: "Inquiry History", section: "Dashboards" },
  { slug: "analytics", title: "Analytics", section: "Dashboards" },
  { slug: "settings", title: "Settings", section: "Settings" },
  { slug: "help-center", title: "Help Center", section: "Settings" },
  { slug: "contact-support", title: "Contact Support", section: "Settings" },
];
