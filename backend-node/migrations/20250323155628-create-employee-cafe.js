module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmployeeCafes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      EmployeeId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Employees',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      CafeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Cafes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EmployeeCafes');
  }
};
