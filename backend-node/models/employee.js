'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsToMany(models.Cafe, { 
        through: models.EmployeeCafe, 
        foreignKey: 'EmployeeId', 
        as: 'Cafes'
      });
    }
  }

  Employee.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    phone_number: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: { is: /^[89][0-9]{7}$/ }
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Employee',
    timestamps: true
  });

  return Employee;
};
