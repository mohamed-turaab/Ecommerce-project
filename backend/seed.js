const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  countInStock: Number,
  images: [{ url: String }],
  ratingAverage: Number,
  ratingQuantity: Number
}));

async function seedDatabase() {
  try {
    const dbUri = 'mongodb://127.0.0.1:27017/goobo_market';
    await mongoose.connect(dbUri);
    console.log('Database connected!');

    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Old data cleared.');

    const adminPass = await bcrypt.hash('MxMd2081', 12);
    const userPass = await bcrypt.hash('MxMd2080', 12);

    await User.create([
      { name: 'Goobo Admin', email: 'mohahappypoy@gmail.com', password: adminPass, role: 'admin' },
      { name: 'Test Customer', email: 'mohamedturaab3@gmail.com', password: userPass, role: 'user' }
    ]);
    console.log('Users created.');

    const productsData = [

      { name: 'Onyx Trench Coat', description: 'Stylish black trench coat with a modern silhouette and premium fabric.', price: 450, category: 'Clothing', countInStock: 5, images: [{ url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400' }], ratingAverage: 4.9, ratingQuantity: 12 },
      { name: 'Silk Midnight Dress', description: 'Elegant evening wear designed for special occasions and formal gatherings.', price: 220, category: 'Clothing', countInStock: 8, images: [{ url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400' }], ratingAverage: 4.8, ratingQuantity: 24 },
      { name: 'Linen Summer Shirt', description: 'Breathable lightweight linen shirt perfect for hot summer days.', price: 85, category: 'Clothing', countInStock: 15, images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' }], ratingAverage: 4.5, ratingQuantity: 18 },
      { name: 'Classic Denim Jacket', description: 'Timeless denim jacket with a relaxed fit and vintage wash finish.', price: 135, category: 'Clothing', countInStock: 10, images: [{ url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400' }], ratingAverage: 4.7, ratingQuantity: 30 },
      { name: 'Cashmere Wool Sweater', description: 'Ultra-soft cashmere sweater for cozy winter layering.', price: 310, category: 'Clothing', countInStock: 6, images: [{ url: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a73?w=400' }], ratingAverage: 4.6, ratingQuantity: 15 },
      { name: 'Tailored Slim Chinos', description: 'Modern slim-fit chinos crafted from stretch cotton for all-day comfort.', price: 95, category: 'Clothing', countInStock: 20, images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400' }], ratingAverage: 4.4, ratingQuantity: 22 },
      { name: 'Merino Wool Hoodie', description: 'Premium merino wool hoodie with a relaxed fit for everyday wear.', price: 185, category: 'Clothing', countInStock: 12, images: [{ url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400' }], ratingAverage: 4.7, ratingQuantity: 19 },
      { name: 'Leather Biker Jacket', description: 'Genuine leather biker jacket with quilted lining and silver hardware.', price: 520, category: 'Clothing', countInStock: 4, images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' }], ratingAverage: 4.9, ratingQuantity: 8 },
      { name: 'Floral Wrap Skirt', description: 'Flowing wrap skirt with a vibrant floral print for a summer look.', price: 70, category: 'Clothing', countInStock: 18, images: [{ url: 'https://images.unsplash.com/photo-1583496661160-fb5218a9ac56?w=400' }], ratingAverage: 4.5, ratingQuantity: 27 },
      { name: 'Oxford Button-Down Shirt', description: 'Classic Oxford cotton shirt, perfect for smart-casual and business wear.', price: 90, category: 'Clothing', countInStock: 25, images: [{ url: 'https://images.unsplash.com/photo-1603252109360-909baaf261ae?w=400' }], ratingAverage: 4.6, ratingQuantity: 33 },
      { name: 'Ribbed Knit Cardigan', description: 'Cozy ribbed cardigan with button front, perfect for layering.', price: 120, category: 'Clothing', countInStock: 14, images: [{ url: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=400' }], ratingAverage: 4.5, ratingQuantity: 21 },
      { name: 'High-Waist Jogger Pants', description: 'Comfortable high-waist jogger pants made from soft French terry fabric.', price: 75, category: 'Clothing', countInStock: 30, images: [{ url: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=400' }], ratingAverage: 4.4, ratingQuantity: 44 },

      { name: 'Premium Whey Isolate', description: 'High-quality whey protein isolate for muscle recovery and growth.', price: 75, category: 'Health & Wellness', countInStock: 50, images: [{ url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2c903?w=400' }], ratingAverage: 4.9, ratingQuantity: 120 },
      { name: 'Vegan Protein Blend', description: 'Plant-based protein powder made from pea, rice and hemp.', price: 65, category: 'Health & Wellness', countInStock: 40, images: [{ url: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=400' }], ratingAverage: 4.7, ratingQuantity: 85 },
      { name: 'Omega-3 Fish Oil', description: 'High-potency omega-3 supplement for heart and brain health.', price: 35, category: 'Health & Wellness', countInStock: 100, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' }], ratingAverage: 4.6, ratingQuantity: 200 },
      { name: 'Yoga Mat Pro', description: 'Non-slip eco-friendly yoga mat with alignment guides.', price: 55, category: 'Health & Wellness', countInStock: 30, images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' }], ratingAverage: 4.8, ratingQuantity: 60 },
      { name: 'Vitamin D3 Drops', description: 'Liquid vitamin D3 for immune support and bone health.', price: 22, category: 'Health & Wellness', countInStock: 80, images: [{ url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400' }], ratingAverage: 4.5, ratingQuantity: 95 },
      { name: 'Resistance Band Set', description: 'Set of 5 premium resistance bands for full-body workouts at home.', price: 40, category: 'Health & Wellness', countInStock: 45, images: [{ url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400' }], ratingAverage: 4.7, ratingQuantity: 70 },
      { name: 'Collagen Peptides Powder', description: 'Hydrolyzed collagen peptides for skin, hair, nails and joints.', price: 45, category: 'Health & Wellness', countInStock: 60, images: [{ url: 'https://images.unsplash.com/photo-1559181567-c3190bbed337?w=400' }], ratingAverage: 4.8, ratingQuantity: 88 },
      { name: 'Foam Roller', description: 'High-density foam roller for muscle recovery and deep tissue massage.', price: 30, category: 'Health & Wellness', countInStock: 55, images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }], ratingAverage: 4.6, ratingQuantity: 74 },
      { name: 'Magnesium Complex', description: 'High-absorption magnesium supplement for sleep quality and muscle function.', price: 28, category: 'Health & Wellness', countInStock: 90, images: [{ url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400' }], ratingAverage: 4.7, ratingQuantity: 130 },
      { name: 'Jump Rope Speed', description: 'Professional speed jump rope with ball bearings for cardio training.', price: 25, category: 'Health & Wellness', countInStock: 75, images: [{ url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a26?w=400' }], ratingAverage: 4.5, ratingQuantity: 56 },
      { name: 'Blender Bottle Shaker', description: 'Leak-proof shaker bottle with blending ball for smooth protein shakes.', price: 18, category: 'Health & Wellness', countInStock: 120, images: [{ url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400' }], ratingAverage: 4.4, ratingQuantity: 180 },
      { name: 'Posture Corrector', description: 'Adjustable back brace for improved posture and spinal alignment.', price: 35, category: 'Health & Wellness', countInStock: 40, images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400' }], ratingAverage: 4.3, ratingQuantity: 62 },

      { name: 'Midnight Oud', description: 'Dark and elegant evening scent with deep oud and amber notes.', price: 180, category: 'Perfumes', countInStock: 15, images: [{ url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400' }], ratingAverage: 5.0, ratingQuantity: 45 },
      { name: 'Royal Velvet Bloom', description: 'Sophisticated floral evening scent with rose and jasmine.', price: 210, category: 'Perfumes', countInStock: 30, images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400' }], ratingAverage: 4.6, ratingQuantity: 70 },
      { name: 'Oceanic Mist', description: 'Fresh aquatic daytime fragrance with citrus and sea salt.', price: 145, category: 'Perfumes', countInStock: 40, images: [{ url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400' }], ratingAverage: 4.7, ratingQuantity: 110 },
      { name: 'Golden Amber Noir', description: 'Classic oriental amber scent with vanilla and sandalwood.', price: 195, category: 'Perfumes', countInStock: 50, images: [{ url: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=400' }], ratingAverage: 4.5, ratingQuantity: 85 },
      { name: 'Cedar & Smoke', description: 'Bold woody fragrance with smoky cedar and leather undertones.', price: 165, category: 'Perfumes', countInStock: 25, images: [{ url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400' }], ratingAverage: 4.8, ratingQuantity: 55 },
      { name: 'Blossom Pétale', description: 'Light and romantic floral scent with peony and white musk.', price: 130, category: 'Perfumes', countInStock: 35, images: [{ url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400' }], ratingAverage: 4.4, ratingQuantity: 40 },
      { name: 'Saffron & Rose', description: 'Luxurious Middle Eastern blend of saffron, rose and musk.', price: 240, category: 'Perfumes', countInStock: 12, images: [{ url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400' }], ratingAverage: 4.9, ratingQuantity: 32 },
      { name: 'Fresh Citrus Grove', description: 'Energizing daytime scent bursting with lemon, bergamot and green tea.', price: 110, category: 'Perfumes', countInStock: 55, images: [{ url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400' }], ratingAverage: 4.5, ratingQuantity: 66 },
      { name: 'Velvet Tobacco', description: 'Rich and warm evening fragrance with tobacco, vanilla and bourbon.', price: 175, category: 'Perfumes', countInStock: 20, images: [{ url: 'https://images.unsplash.com/photo-1587017547035-bfc02d51cf68?w=400' }], ratingAverage: 4.8, ratingQuantity: 48 },
      { name: 'Lavender Dreams', description: 'Calming lavender and chamomile blend perfect for relaxation.', price: 125, category: 'Perfumes', countInStock: 45, images: [{ url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400' }], ratingAverage: 4.6, ratingQuantity: 78 },
      { name: 'Iris & Violet', description: 'Sophisticated powdery iris and violet fragrance with a woody base.', price: 158, category: 'Perfumes', countInStock: 28, images: [{ url: 'https://images.unsplash.com/photo-1636274150-00b6eddaa551?w=400' }], ratingAverage: 4.7, ratingQuantity: 38 },
      { name: 'Marine Breeze', description: 'Crisp and clean marine fragrance evoking ocean waves and sea air.', price: 120, category: 'Perfumes', countInStock: 42, images: [{ url: 'https://images.unsplash.com/photo-1562158147-f8d37e2c2ce5?w=400' }], ratingAverage: 4.4, ratingQuantity: 52 },

      { name: 'Carbon Fiber Laptop', description: 'Ultra-thin professional laptop with 16GB RAM and 512GB SSD.', price: 1800, category: 'Tech & Gadgets', countInStock: 5, images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' }], ratingAverage: 5.0, ratingQuantity: 10 },
      { name: 'Noise Cancelling Headset', description: 'Premium wireless headphones with active noise cancellation.', price: 299, category: 'Tech & Gadgets', countInStock: 12, images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' }], ratingAverage: 4.9, ratingQuantity: 85 },
      { name: 'Smart Watch Ultra', description: 'Advanced fitness tracker with GPS, heart rate, and AMOLED display.', price: 450, category: 'Tech & Gadgets', countInStock: 8, images: [{ url: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400' }], ratingAverage: 4.8, ratingQuantity: 65 },
      { name: 'Wireless Earbuds Pro', description: 'True wireless earbuds with spatial audio and 30hr battery life.', price: 199, category: 'Tech & Gadgets', countInStock: 20, images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400' }], ratingAverage: 4.7, ratingQuantity: 110 },
      { name: 'Portable Power Bank', description: '20000mAh fast-charging power bank with USB-C and wireless charging.', price: 65, category: 'Tech & Gadgets', countInStock: 30, images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400' }], ratingAverage: 4.6, ratingQuantity: 45 },
      { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with hot-swappable switches and aluminum frame.', price: 159, category: 'Tech & Gadgets', countInStock: 15, images: [{ url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400' }], ratingAverage: 4.8, ratingQuantity: 70 },
      { name: '4K Webcam', description: 'Ultra-HD 4K webcam with auto-focus and built-in ring light for streaming.', price: 120, category: 'Tech & Gadgets', countInStock: 18, images: [{ url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400' }], ratingAverage: 4.7, ratingQuantity: 55 },
      { name: 'Wireless Charging Pad', description: 'Fast 15W Qi wireless charging pad compatible with all Qi devices.', price: 45, category: 'Tech & Gadgets', countInStock: 40, images: [{ url: 'https://images.unsplash.com/photo-1609592806596-b01e5c3f8965?w=400' }], ratingAverage: 4.5, ratingQuantity: 90 },
      { name: 'Portable Bluetooth Speaker', description: 'Waterproof 360° Bluetooth speaker with 24-hour battery and deep bass.', price: 89, category: 'Tech & Gadgets', countInStock: 25, images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' }], ratingAverage: 4.8, ratingQuantity: 72 },
      { name: 'USB-C Hub 7-in-1', description: 'Slim USB-C hub with HDMI 4K, SD card reader, and 100W PD charging.', price: 55, category: 'Tech & Gadgets', countInStock: 35, images: [{ url: 'https://images.unsplash.com/photo-1625695575440-f42e85413793?w=400' }], ratingAverage: 4.6, ratingQuantity: 48 },
      { name: 'Smart Desk Lamp', description: 'Adjustable LED desk lamp with wireless charging base and touch control.', price: 78, category: 'Tech & Gadgets', countInStock: 22, images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400' }], ratingAverage: 4.5, ratingQuantity: 37 },
      { name: 'Gaming Mouse Pro', description: 'Precision gaming mouse with 25K DPI sensor and customizable RGB lighting.', price: 95, category: 'Tech & Gadgets', countInStock: 28, images: [{ url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400' }], ratingAverage: 4.9, ratingQuantity: 102 },

      { name: 'Trail Running Shoes', description: 'Lightweight trail runners with aggressive grip and waterproof membrane.', price: 175, category: 'Sports & Outdoors', countInStock: 12, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' }], ratingAverage: 4.8, ratingQuantity: 90 },
      { name: 'Camping Tent 4P', description: 'Four-person waterproof tent with quick-setup design.', price: 250, category: 'Sports & Outdoors', countInStock: 8, images: [{ url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400' }], ratingAverage: 4.7, ratingQuantity: 35 },
      { name: 'Mountain Bike Helmet', description: 'Ventilated lightweight helmet with MIPS protection technology.', price: 95, category: 'Sports & Outdoors', countInStock: 20, images: [{ url: 'https://images.unsplash.com/photo-1557803175-d472badb1736?w=400' }], ratingAverage: 4.6, ratingQuantity: 50 },
      { name: 'Insulated Water Bottle', description: '32oz stainless steel bottle that keeps drinks cold for 24 hours.', price: 38, category: 'Sports & Outdoors', countInStock: 60, images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' }], ratingAverage: 4.9, ratingQuantity: 150 },
      { name: 'Hiking Backpack 40L', description: 'Ergonomic 40-liter pack with rain cover and hydration compatibility.', price: 140, category: 'Sports & Outdoors', countInStock: 10, images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }], ratingAverage: 4.7, ratingQuantity: 40 },
      { name: 'Compression Tights', description: 'High-performance compression leggings for running and training.', price: 60, category: 'Sports & Outdoors', countInStock: 25, images: [{ url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400' }], ratingAverage: 4.5, ratingQuantity: 65 },
      { name: 'Adjustable Dumbbell Set', description: '5-52.5lb adjustable dumbbells that replace 15 sets of weights.', price: 299, category: 'Sports & Outdoors', countInStock: 7, images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' }], ratingAverage: 4.9, ratingQuantity: 43 },
      { name: 'Kayak Paddle', description: 'Lightweight carbon fiber kayak paddle with feathered blades.', price: 120, category: 'Sports & Outdoors', countInStock: 15, images: [{ url: 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=400' }], ratingAverage: 4.6, ratingQuantity: 28 },
      { name: 'Climbing Chalk Bag', description: 'Premium leather chalk bag with adjustable belt for rock climbing.', price: 28, category: 'Sports & Outdoors', countInStock: 50, images: [{ url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400' }], ratingAverage: 4.5, ratingQuantity: 61 },
      { name: 'Running Belt', description: 'Slim waist pack for runners with phone pocket and water bottle holder.', price: 22, category: 'Sports & Outdoors', countInStock: 70, images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }], ratingAverage: 4.4, ratingQuantity: 88 },
      { name: 'Sleeping Bag -10°C', description: 'Mummy sleeping bag rated to -10°C with lightweight ripstop shell.', price: 185, category: 'Sports & Outdoors', countInStock: 9, images: [{ url: 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=400' }], ratingAverage: 4.8, ratingQuantity: 25 },
      { name: 'Trekking Poles', description: 'Collapsible aluminium trekking poles with cork grips and wrist straps.', price: 65, category: 'Sports & Outdoors', countInStock: 18, images: [{ url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400' }], ratingAverage: 4.7, ratingQuantity: 34 },

      { name: 'Scandinavian Desk Lamp', description: 'Minimalist adjustable desk lamp with warm LED lighting.', price: 85, category: 'Home & Furniture', countInStock: 18, images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400' }], ratingAverage: 4.7, ratingQuantity: 55 },
      { name: 'Velvet Accent Chair', description: 'Mid-century modern accent chair with gold metal legs.', price: 320, category: 'Home & Furniture', countInStock: 6, images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' }], ratingAverage: 4.8, ratingQuantity: 28 },
      { name: 'Marble Coffee Table', description: 'Elegant round coffee table with white marble top and brass base.', price: 450, category: 'Home & Furniture', countInStock: 4, images: [{ url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400' }], ratingAverage: 4.9, ratingQuantity: 15 },
      { name: 'Woven Throw Blanket', description: 'Cozy handwoven cotton throw blanket in neutral tones.', price: 55, category: 'Home & Furniture', countInStock: 30, images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400' }], ratingAverage: 4.6, ratingQuantity: 80 },
      { name: 'Ceramic Vase Set', description: 'Set of 3 handcrafted ceramic vases in earth tones.', price: 72, category: 'Home & Furniture', countInStock: 22, images: [{ url: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400' }], ratingAverage: 4.5, ratingQuantity: 42 },
      { name: 'Floating Wall Shelf', description: 'Solid walnut floating shelf with hidden bracket mounting system.', price: 110, category: 'Home & Furniture', countInStock: 14, images: [{ url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400' }], ratingAverage: 4.7, ratingQuantity: 35 },
      { name: 'Linen Duvet Cover Set', description: 'Pure linen duvet cover and pillowcase set in soft stone wash finish.', price: 145, category: 'Home & Furniture', countInStock: 16, images: [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' }], ratingAverage: 4.8, ratingQuantity: 47 },
      { name: 'Rattan Storage Basket', description: 'Handwoven rattan storage basket with cotton liner for home organization.', price: 42, category: 'Home & Furniture', countInStock: 35, images: [{ url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400' }], ratingAverage: 4.5, ratingQuantity: 63 },
      { name: 'Solid Oak Dining Chair', description: 'Sturdy solid oak dining chair with upholstered linen seat cushion.', price: 195, category: 'Home & Furniture', countInStock: 8, images: [{ url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400' }], ratingAverage: 4.7, ratingQuantity: 20 },
      { name: 'Aromatherapy Diffuser', description: 'Ultrasonic essential oil diffuser with 7-colour ambient light and timer.', price: 48, category: 'Home & Furniture', countInStock: 50, images: [{ url: 'https://images.unsplash.com/photo-1608181831718-c9aea5f84c83?w=400' }], ratingAverage: 4.6, ratingQuantity: 95 },
      { name: 'Blackout Curtain Pair', description: 'Premium blackout curtains with thermal insulation and noise reduction.', price: 88, category: 'Home & Furniture', countInStock: 20, images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }], ratingAverage: 4.7, ratingQuantity: 58 },
      { name: 'Monstera Plant Pot', description: 'Large glazed ceramic indoor plant pot with drainage hole and saucer.', price: 65, category: 'Home & Furniture', countInStock: 12, images: [{ url: 'https://images.unsplash.com/photo-1520585975975-4f2e5d3b4f5c?w=400' }], ratingAverage: 4.6, ratingQuantity: 39 },
    ];

    await Product.insertMany(productsData);
    console.log(`${productsData.length} products seeded across 6 categories.`);

    console.log('Seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
