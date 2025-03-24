const express = require('express');
const router = express.Router();
const { Employee, EmployeeCafe, Cafe } = require('../models');

// GET Employees with Assigned Cafés
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [
                {
                    model: Cafe,
                    through: { attributes: ['start_date'] },
                    as: "Cafes"
                }
            ]
        });

        res.status(200).json(employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            email_address: emp.email_address,
            phone_number: emp.phone_number,
            gender: emp.gender,
            cafe: emp.Cafes.length ? emp.Cafes[0].name : "",
            days_worked: emp.Cafes.length
                ? Math.floor((new Date() - new Date(emp.Cafes[0].EmployeeCafe.start_date)) / (1000 * 60 * 60 * 24))
                : 0 // Default if empty
        })));
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: 'Error retrieving employees' });
    }
});

// POST - Create Employee & Assign to Café
router.post('/', async (req, res) => {
    try {
        const { cafeId, ...employeeData } = req.body;
        const newEmployee = await Employee.create(employeeData);

        if (cafeId) {
            await EmployeeCafe.create({ 
                EmployeeId: newEmployee.id, 
                CafeId: cafeId, 
                start_date: new Date() 
            });
        }

        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: 'Error creating employee' });
    }
});

// DELETE - Remove Employee & Relationship in EmployeeCafe
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await EmployeeCafe.destroy({ where: { EmployeeId: req.params.id } });
        await employee.destroy();

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: 'Error deleting employee' });
    }
});

module.exports = router;
