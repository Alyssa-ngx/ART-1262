const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Cafe extends Model {
        static associate(models) {
            Cafe.hasMany(models.EmployeeCafe, { foreignKey: 'CafeId', onDelete: 'CASCADE' });
            Cafe.belongsToMany(models.Employee, { through: models.EmployeeCafe, foreignKey: 'CafeId', as: 'Employees' });
        }
    }

    Cafe.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,  // Allow empty logo
            validate: {
                isUrl: {
                    msg: "Logo must be a valid URL",
                }
            }
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Cafe',
        tableName: 'Cafes',
        timestamps: true
    });

    return Cafe;
};
