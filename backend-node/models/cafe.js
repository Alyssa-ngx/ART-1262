'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cafe extends Model {
    static associate(models) {
      // Cafe has multiple Employees
      Cafe.hasMany(models.Employee, { 
        foreignKey: 'cafeId', 
        as: 'Employees',
        onDelete: 'CASCADE' 
      });

      // ✅ Cafe has multiple records in EmployeeCafe (Employment History)
      Cafe.hasMany(models.EmployeeCafe, { 
        foreignKey: 'CafeId', 
        as: 'EmployeeCafes',
        onDelete: 'CASCADE' 
      });

      // ✅ Cafe belongs to Many Employees (via EmployeeCafe)
      Cafe.belongsToMany(models.Employee, { 
        through: models.EmployeeCafe, 
        foreignKey: 'CafeId',
        as: 'EmployeesMany'
      });
    }
  }

  Cafe.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // unique ID
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 50], //length
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 256] //length
      }
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true, // optional logo URL
      validate: {
        isUrl: {
          msg: 'Logo must be a valid URL' // error message for validation
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true // location is not empty
      }
    }
  }, {
    sequelize,
    modelName: 'Cafe',
    timestamps: true,
    tableName: 'cafes' // set table name to avoid sequelize pluralization issues
  });

  return Cafe;
};
