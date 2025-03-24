'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure referenced Employees exist
    const employees = await queryInterface.sequelize.query(
      `SELECT id FROM Employees WHERE id IN ('UI1234567', 'UI2345678');`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Ensure referenced Cafes exist
    const cafes = await queryInterface.sequelize.query(
      `SELECT id FROM Cafes WHERE id IN ('e1d2c3b4-a5f6-4d8e-9a1b-2c3d4e5f6g7h', 'a1b2c3d4-e5f6-4g8h-9i0j-k1l2m3n4o5p6');`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (employees.length < 2 || cafes.length < 2) {
      console.error("ERROR: Required Employees or Cafes do not exist in the database.");
      return;
    }

    await queryInterface.bulkInsert('EmployeeCafes', [
      {
        EmployeeId: 'UI1234567',
        CafeId: 'e1d2c3b4-a5f6-4d8e-9a1b-2c3d4e5f6g7h',
        start_date: new Date('2023-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        EmployeeId: 'UI2345678',
        CafeId: 'a1b2c3d4-e5f6-4g8h-9i0j-k1l2m3n4o5p6',
        start_date: new Date('2023-05-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('EmployeeCafes', null, {});
  }
};
