const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Employee extends Model {
        static associate(models) {
            // Employee belongs to a Cafe
            Employee.belongsTo(models.Cafe, { 
                foreignKey: 'cafeId', 
                as: 'Cafe', 
                onDelete: 'SET NULL' // Keep employee even if cafe is deleted
            });

            // Employee has one record in EmployeeCafe
            Employee.hasOne(models.EmployeeCafe, { 
                foreignKey: 'EmployeeId', 
                as: 'Employment', // Ensure alias matches in queries
                onDelete: 'CASCADE' // If employee is deleted, employment record is removed
            });
        }
    }

    Employee.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true, // Unique Employee Identifier
            allowNull: false,
            unique: true,
            validate: {
                is: /^UI[0-9A-Z]{7}$/, // Ensures format UIXXXXXXX
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 50], // Name must be between 3-50 characters
                notEmpty: true
            }
        },
        email_address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Prevent duplicate emails
            validate: { 
                isEmail: true // Ensures valid email format
            }
        },
        phone_number: {
            type: DataTypes.STRING(8),
            allowNull: false,
            validate: { 
                is: /^[89][0-9]{7}$/, // Ensures phone starts with 8 or 9 and is exactly 8 digits
                notEmpty: true
            }
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female'),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Employee',
        timestamps: true,
        tableName: 'employees' // avoid sequelize pluralization issues
    });

    return Employee;
};
