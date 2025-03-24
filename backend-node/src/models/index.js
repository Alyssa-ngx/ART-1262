const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve(__dirname, '../../config/config.json'); // ✅ Ensure correct config path

if (!fs.existsSync(configPath)) {
    throw new Error(`❌ Config file not found at ${configPath}. Please check the path.`);
}

const rawConfig = fs.readFileSync(configPath, 'utf8');
const parsedConfig = JSON.parse(rawConfig);
const config = parsedConfig[env];

let sequelize;
try {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            dialect: config.dialect,
            logging: false,
            define: {
                freezeTableName: true
            }
        }
    );

    console.log("✅ Database connected successfully.");
} catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Cafe = require('./cafe')(sequelize, Sequelize);
db.Employee = require('./employee')(sequelize, Sequelize);
db.EmployeeCafe = require('./employeeCafe')(sequelize, Sequelize);

db.Employee.belongsToMany(db.Cafe, { 
    through: db.EmployeeCafe, 
    foreignKey: 'EmployeeId',
    as: "Cafes"
});

db.Cafe.belongsToMany(db.Employee, { 
    through: db.EmployeeCafe, 
    foreignKey: 'CafeId',
    as: "Employees"
});


if (env === 'development') {
    sequelize.sync({ alter: true }).then(() => {
        console.log("🔄 Database sync completed.");
    }).catch(err => {
        console.error("❌ Error syncing database:", err);
    });
}

module.exports = db;
