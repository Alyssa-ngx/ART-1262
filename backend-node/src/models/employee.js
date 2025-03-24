const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Employee extends Model {
        static associate(models) {
            // An Employee belongs to one Cafe
            Employee.belongsTo(models.Cafe, { foreignKey: 'cafeId', onDelete: 'SET NULL' });

            // An Employee has one EmployeeCafe record
            Employee.hasOne(models.EmployeeCafe, { foreignKey: 'EmployeeId', onDelete: 'CASCADE' });
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
            validate: { is: /^[89][0-9]{7}$/ } // 8 or 9 and is 8 digits long
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female'),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Employee',
        tableName: 'Employees',
        timestamps: true
    });

    return Employee;
};
