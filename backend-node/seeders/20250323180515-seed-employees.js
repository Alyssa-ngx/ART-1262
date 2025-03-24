'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if Employees table exists before inserting
      const tableExists = await queryInterface.describeTable('Employees').catch(() => null);

      if (!tableExists) {
        console.error("ERROR: Employees table does not exist. Run migrations first.");
        return;
      }

      // Delete existing records to avoid duplicate key errors
      await queryInterface.bulkDelete('Employees', null, {});

      // Insert new employee data
      await queryInterface.bulkInsert('Employees', [
        {
          id: 'UI1234567',
          name: 'John Doe',
          email_address: 'john@example.com',
          phone_number: '91234567',
          gender: 'Male',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'UI2345678',
          name: 'Jane Smith',
          email_address: 'jane@example.com',
          phone_number: '82345678',
          gender: 'Female',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { validate: true });

      console.log("Employees seeded successfully.");
    } catch (error) {
      console.error("ERROR: Failed to seed employees:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Employees', {
        id: ['UI1234567', 'UI2345678']
      });

      console.log("Employees reverted successfully.");
    } catch (error) {
      console.error("ERROR: Failed to revert employees:", error);
    }
  }
};
