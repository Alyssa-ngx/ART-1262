'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Seeding Cafes...");

      // Check if cafes exist before inserting
      const existingCafes = await queryInterface.sequelize.query(
        `SELECT id FROM Cafes;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (existingCafes.length > 0) {
        console.log("⚠️ Cafes already exist. Deleting before seeding...");
        await queryInterface.bulkDelete('Cafes', null, {}); // Delete all existing cafes
      }

      // Seed cafes (Use bulkCreate with upsert to prevent duplicates)
      await queryInterface.bulkInsert('Cafes', [
        {
          id: 'e1d2c3b4-a5f6-4d8e-9a1b-2c3d4e5f6g7h',
          name: 'Sunrise Café',
          description: 'A cozy café with amazing coffee.',
          logo: 'https://example.com/logo1.png',
          location: 'Downtown',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'a1b2c3d4-e5f6-4g8h-9i0j-k1l2m3n4o5p6',
          name: 'Mocha Delights',
          description: 'Your daily dose of espresso!',
          logo: 'https://example.com/logo2.png',
          location: 'Uptown',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { validate: true });

      console.log("Cafes seeded successfully.");
    } catch (error) {
      console.error("Error seeding cafes:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      console.log("Reverting Cafes Seeder...");
      await queryInterface.bulkDelete('Cafes', null, {});
      console.log("Cafes reverted successfully.");
    } catch (error) {
      console.error("Error reverting cafes seeder:", error);
    }
  }
};
