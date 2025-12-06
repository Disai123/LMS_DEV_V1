'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate sample orders for existing customers
    const orders = [
      {
        id: '20000000-0000-0000-0000-000000000001',
        order_number: 'ORD-2024-001',
        user_id: '00000000-0000-0000-0000-000000000002', // customer@ecommerce.com
        total: 179.98,
        status: 'DELIVERED',
        shipping_address: Sequelize.literal(`'{"street":"123 Customer Street","city":"New York","state":"NY","zip":"10001","country":"USA"}'::jsonb`),
        payment_status: 'PAID',
        payment_method: 'Credit Card',
        tracking_number: 'TRK123456789',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: '20000000-0000-0000-0000-000000000002',
        order_number: 'ORD-2024-002',
        user_id: '00000000-0000-0000-0000-000000000003', // john.doe@example.com
        total: 299.99,
        status: 'SHIPPED',
        shipping_address: Sequelize.literal(`'{"street":"123 Main Street","city":"New York","state":"NY","zip":"10001","country":"USA"}'::jsonb`),
        payment_status: 'PAID',
        payment_method: 'PayPal',
        tracking_number: 'TRK987654321',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '20000000-0000-0000-0000-000000000003',
        order_number: 'ORD-2024-003',
        user_id: '00000000-0000-0000-0000-000000000004', // jane.smith@example.com
        total: 124.97,
        status: 'PROCESSING',
        shipping_address: Sequelize.literal(`'{"street":"789 Park Avenue","city":"Chicago","state":"IL","zip":"60601","country":"USA"}'::jsonb`),
        payment_status: 'PAID',
        payment_method: 'Credit Card',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '20000000-0000-0000-0000-000000000004',
        order_number: 'ORD-2024-004',
        user_id: '00000000-0000-0000-0000-000000000005', // mike.johnson@example.com
        total: 89.98,
        status: 'PENDING',
        shipping_address: Sequelize.literal(`'{"street":"456 Oak Avenue","city":"Los Angeles","state":"CA","zip":"90001","country":"USA"}'::jsonb`),
        payment_status: 'PENDING',
        payment_method: 'Credit Card',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('orders', orders);

    // Add order items
    const orderItems = [
      // Order 1 items
      {
        id: '30000000-0000-0000-0000-000000000001',
        order_id: '20000000-0000-0000-0000-000000000001',
        product_id: '10000000-0000-0000-0000-000000000001', // Wireless Bluetooth Headphones
        quantity: 1,
        price: 99.99,
        product_name: 'Wireless Bluetooth Headphones',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: '30000000-0000-0000-0000-000000000002',
        order_id: '20000000-0000-0000-0000-000000000001',
        product_id: '10000000-0000-0000-0000-000000000008', // Laptop Backpack
        quantity: 1,
        price: 49.99,
        product_name: 'Laptop Backpack Professional',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: '30000000-0000-0000-0000-000000000003',
        order_id: '20000000-0000-0000-0000-000000000001',
        product_id: '10000000-0000-0000-0000-000000000009', // Wireless Mouse
        quantity: 1,
        price: 29.99,
        product_name: 'Wireless Ergonomic Mouse',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      // Order 2 items
      {
        id: '30000000-0000-0000-0000-000000000004',
        order_id: '20000000-0000-0000-0000-000000000002',
        product_id: '10000000-0000-0000-0000-000000000002', // Smart Watch Pro
        quantity: 1,
        price: 299.99,
        product_name: 'Smart Watch Pro',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      // Order 3 items
      {
        id: '30000000-0000-0000-0000-000000000005',
        order_id: '20000000-0000-0000-0000-000000000003',
        product_id: '10000000-0000-0000-0000-000000000012', // Phone Case
        quantity: 2,
        price: 19.99,
        product_name: 'Phone Case with Stand & Card Holder',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '30000000-0000-0000-0000-000000000006',
        order_id: '20000000-0000-0000-0000-000000000003',
        product_id: '10000000-0000-0000-0000-000000000011', // Wireless Charger
        quantity: 1,
        price: 24.99,
        product_name: 'Fast Wireless Charging Pad',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '30000000-0000-0000-0000-000000000007',
        order_id: '20000000-0000-0000-0000-000000000003',
        product_id: '10000000-0000-0000-0000-000000000010', // USB-C Hub
        quantity: 1,
        price: 39.99,
        product_name: 'USB-C Multi-Port Hub',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '30000000-0000-0000-0000-000000000008',
        order_id: '20000000-0000-0000-0000-000000000003',
        product_id: '10000000-0000-0000-0000-000000000013', // Cable Organizer
        quantity: 2,
        price: 14.99,
        product_name: 'Cable Management Organizer',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      // Order 4 items
      {
        id: '30000000-0000-0000-0000-000000000009',
        order_id: '20000000-0000-0000-0000-000000000004',
        product_id: '10000000-0000-0000-0000-000000000015', // T-Shirt
        quantity: 2,
        price: 24.99,
        product_name: 'Classic Cotton T-Shirt',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '30000000-0000-0000-0000-000000000010',
        order_id: '20000000-0000-0000-0000-000000000004',
        product_id: '10000000-0000-0000-0000-000000000017', // Hooded Sweatshirt
        quantity: 1,
        price: 39.99,
        product_name: 'Hooded Sweatshirt',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('order_items', orderItems);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_items', {
      order_id: {
        [Sequelize.Op.in]: [
          '20000000-0000-0000-0000-000000000001',
          '20000000-0000-0000-0000-000000000002',
          '20000000-0000-0000-0000-000000000003',
          '20000000-0000-0000-0000-000000000004'
        ]
      }
    });
    
    await queryInterface.bulkDelete('orders', {
      order_number: {
        [Sequelize.Op.in]: [
          'ORD-2024-001',
          'ORD-2024-002',
          'ORD-2024-003',
          'ORD-2024-004'
        ]
      }
    });
  }
};

