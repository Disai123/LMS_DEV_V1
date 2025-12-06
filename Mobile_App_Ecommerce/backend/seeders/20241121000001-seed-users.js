'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@ecommerce.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'customer@ecommerce.com',
        name: 'Test Customer',
        password: customerPassword,
        role: 'customer',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: customerPassword,
        role: 'customer',
        is_active: true,
        phone: '+1-555-0101',
        address: Sequelize.literal(`'{"street":"123 Main Street","city":"New York","state":"NY","zip":"10001","country":"USA"}'::jsonb`),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        password: customerPassword,
        role: 'customer',
        is_active: true,
        phone: '+1-555-0102',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000005',
        email: 'mike.johnson@example.com',
        name: 'Mike Johnson',
        password: customerPassword,
        role: 'customer',
        is_active: true,
        phone: '+1-555-0103',
        address: Sequelize.literal(`'{"street":"456 Oak Avenue","city":"Los Angeles","state":"CA","zip":"90001","country":"USA"}'::jsonb`),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'admin@ecommerce.com',
          'customer@ecommerce.com',
          'john.doe@example.com',
          'jane.smith@example.com',
          'mike.johnson@example.com'
        ]
      }
    });
  }
};

