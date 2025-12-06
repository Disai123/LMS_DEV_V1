'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      // Electronics Category
      {
        id: '10000000-0000-0000-0000-000000000001',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless Bluetooth headphones with active noise cancellation. 30-hour battery life, premium sound quality, and comfortable over-ear design. Perfect for music lovers and professionals.',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        stock: 50,
        category: 'Electronics',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000002',
        name: 'Smart Watch Pro',
        description: 'Feature-rich smartwatch with advanced health tracking, GPS navigation, heart rate monitor, and 7-day battery life. Stay connected on the go with call and message notifications.',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        stock: 30,
        category: 'Electronics',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000003',
        name: 'Mechanical Keyboard RGB',
        description: 'Premium mechanical keyboard with customizable RGB lighting, Cherry MX switches, and aluminum frame. Perfect for gaming and professional typing. Full-size layout with dedicated media controls.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
        stock: 40,
        category: 'Electronics',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000004',
        name: 'Portable Bluetooth Speaker',
        description: 'Compact portable speaker with 360-degree sound, waterproof IPX7 rating, and 12-hour battery. Perfect for outdoor adventures, parties, and daily use. Crystal clear audio quality.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        stock: 45,
        category: 'Electronics',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000005',
        name: '4K Ultra HD Webcam',
        description: 'Ultra HD 4K webcam with autofocus, built-in microphone array, and privacy shutter. Perfect for video calls, streaming, and content creation. Plug-and-play USB-C connectivity.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
        stock: 25,
        category: 'Electronics',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000006',
        name: 'Wireless Earbuds Pro',
        description: 'Premium true wireless earbuds with active noise cancellation, transparency mode, and spatial audio. 8-hour battery with charging case providing 24 additional hours. Water resistant.',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
        stock: 35,
        category: 'Electronics',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000007',
        name: 'Tablet Stand Adjustable',
        description: 'Ergonomic adjustable tablet stand with 360-degree rotation and multiple angle positions. Compatible with all tablets and smartphones. Aluminum construction with non-slip base.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        stock: 65,
        category: 'Electronics',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Accessories Category
      {
        id: '10000000-0000-0000-0000-000000000008',
        name: 'Laptop Backpack Professional',
        description: 'Durable and stylish laptop backpack with padded compartment for laptops up to 15.6", multiple pockets, USB charging port, and water-resistant material. Perfect for work and travel.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        stock: 75,
        category: 'Accessories',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000009',
        name: 'Wireless Ergonomic Mouse',
        description: 'Ergonomic wireless mouse with precision optical sensor, 2-year battery life, and comfortable grip. Compatible with all operating systems. Silent clicking technology.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
        stock: 100,
        category: 'Accessories',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000010',
        name: 'USB-C Multi-Port Hub',
        description: 'Multi-port USB-C hub with 4K HDMI output, 3x USB 3.0 ports, SD/TF card reader, and USB-C power delivery. Expand your connectivity options for laptops and tablets.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500',
        stock: 60,
        category: 'Accessories',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000011',
        name: 'Fast Wireless Charging Pad',
        description: '15W fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and built-in safety features. Supports phones, earbuds, and smartwatches.',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500',
        stock: 80,
        category: 'Accessories',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000012',
        name: 'Phone Case with Stand & Card Holder',
        description: 'Protective phone case with built-in kickstand and card holder slots. Shock-absorbent material, raised screen protection, and supports wireless charging. Available for all major phone models.',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500',
        stock: 120,
        category: 'Accessories',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000013',
        name: 'Cable Management Organizer',
        description: 'Desktop cable management organizer with adhesive backing and multiple cable slots. Keep your workspace tidy and organized. Fits all standard cables.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
        stock: 90,
        category: 'Accessories',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000014',
        name: 'Laptop Cooling Pad',
        description: 'Ergonomic laptop cooling pad with 5 adjustable fans, LED lighting, and USB-powered operation. Reduces laptop temperature and provides comfortable typing angle.',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        stock: 40,
        category: 'Accessories',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Clothing Category
      {
        id: '10000000-0000-0000-0000-000000000015',
        name: 'Classic Cotton T-Shirt',
        description: 'Premium 100% cotton t-shirt with comfortable fit and durable construction. Available in multiple colors. Perfect for casual wear or layering.',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        stock: 150,
        category: 'Clothing',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000016',
        name: 'Denim Jeans Classic Fit',
        description: 'Classic fit denim jeans with stretch comfort, five-pocket design, and durable construction. Perfect for everyday wear. Available in multiple sizes and washes.',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        stock: 80,
        category: 'Clothing',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000017',
        name: 'Hooded Sweatshirt',
        description: 'Comfortable hooded sweatshirt with front pocket, adjustable drawstring hood, and soft fleece lining. Perfect for casual wear and cooler weather.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        stock: 70,
        category: 'Clothing',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000018',
        name: 'Running Shoes Athletic',
        description: 'Lightweight running shoes with breathable mesh upper, cushioned sole, and non-slip traction. Perfect for jogging, gym workouts, and daily activities.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        stock: 55,
        category: 'Clothing',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Home & Living Category
      {
        id: '10000000-0000-0000-0000-000000000019',
        name: 'Smart LED Light Bulbs (4-Pack)',
        description: 'WiFi-enabled smart LED light bulbs with app control, 16 million colors, dimming, and scheduling. Compatible with Alexa and Google Home. Energy efficient and long-lasting.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
        stock: 50,
        category: 'Home & Living',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000020',
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof lid, BPA-free, and easy to clean. 32oz capacity.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
        stock: 85,
        category: 'Home & Living',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000021',
        name: 'Yoga Mat Premium',
        description: 'Non-slip premium yoga mat with extra cushioning, carrying strap, and moisture-resistant material. Perfect for yoga, pilates, and exercise routines. 6mm thickness.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        stock: 60,
        category: 'Home & Living',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000022',
        name: 'Coffee Maker Programmable',
        description: '12-cup programmable coffee maker with auto shut-off, brew strength selector, and keep-warm function. Perfect for busy mornings and entertaining guests.',
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1517668808823-b833c6cf4a15?w=500',
        stock: 30,
        category: 'Home & Living',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Books Category
      {
        id: '10000000-0000-0000-0000-000000000023',
        name: 'JavaScript: The Definitive Guide',
        description: 'Comprehensive guide to JavaScript programming. Covers ES6+ features, modern web development, and best practices. Essential for web developers.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        stock: 25,
        category: 'Books',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000024',
        name: 'React: The Complete Guide',
        description: 'Master React.js with this comprehensive guide covering hooks, context, routing, state management, and building modern web applications.',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
        stock: 30,
        category: 'Books',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000025',
        name: 'Clean Code: A Handbook',
        description: 'Learn to write clean, maintainable code with best practices, design principles, and professional techniques. Essential reading for all developers.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500',
        stock: 35,
        category: 'Books',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Health & Beauty Category
      {
        id: '10000000-0000-0000-0000-000000000026',
        name: 'Sonic Facial Cleansing Brush',
        description: 'Rechargeable sonic facial cleansing brush with multiple speed settings and interchangeable brush heads. Deep cleanses pores and exfoliates gently.',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500',
        stock: 40,
        category: 'Health & Beauty',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000027',
        name: 'Electric Toothbrush Set',
        description: 'Advanced electric toothbrush with 5 cleaning modes, timer, pressure sensor, and USB charging. Includes travel case and multiple brush heads.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c10?w=500',
        stock: 45,
        category: 'Health & Beauty',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Sports & Outdoors Category
      {
        id: '10000000-0000-0000-0000-000000000028',
        name: 'Dumbbell Set Adjustable',
        description: 'Adjustable dumbbell set with quick-change weight system. Range from 5-25 lbs per dumbbell. Space-saving design perfect for home gyms.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        stock: 20,
        category: 'Sports & Outdoors',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000029',
        name: 'Camping Tent 4-Person',
        description: 'Weather-resistant 4-person camping tent with easy setup, ventilation windows, and waterproof rainfly. Perfect for family camping trips and outdoor adventures.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500',
        stock: 15,
        category: 'Sports & Outdoors',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000030',
        name: 'Bicycle Helmet Safety',
        description: 'Ventilated bicycle helmet with adjustable fit system, LED rear light, and multiple sizes. Meets safety standards and provides excellent protection.',
        price: 54.99,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        stock: 35,
        category: 'Sports & Outdoors',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};

