const express = require('express');
const router = express.Router();
const { Employee, EmployeeCafe, Cafe } = require('../models');

// GET - Fetch Employees with Associated Cafés
router.get('/', async (req, res) => {
    try {
        const { cafe } = req.query;

        const queryOptions = {
            include: [
                {
                    model: Cafe,
                    through: EmployeeCafe,
                    as: 'Cafes'
                }
            ],
            order: [['createdAt', 'DESC']]
        };

        // Filter by café if provided
        if (cafe) {
            queryOptions.include[0].where = { id: cafe };
        }

        const employees = await Employee.findAll(queryOptions);

        res.status(200).json(employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            email_address: emp.email_address,
            phone_number: emp.phone_number,
            gender: emp.gender,
            cafe: emp.Cafes.length ? emp.Cafes[0].name : "", // multiple cafés
            days_worked: emp.Cafes.length
                ? Math.floor((new Date() - new Date(emp.Cafes[0].EmployeeCafe.start_date)) / (1000 * 60 * 60 * 24))
                : 0
        })));
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: 'Error retrieving employees' });
    }
});

// ✅ POST - Create Employee & Assign to Café
router.post('/', async (req, res) => {
    try {
        console.log("📥 Incoming Employee Data:", req.body);

        const { id, name, email_address, phone_number, gender, cafeId } = req.body;

        if (!id || !name || !email_address || !phone_number || !gender) {
            return res.status(400).json({ message: 'All employee fields are required.' });
        }

        // email is unique
        const existingEmployee = await Employee.findOne({ where: { email_address } });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email address is already in use.' });
        }

        // Create Employee
        const newEmployee = await Employee.create({ id, name, email_address, phone_number, gender });

        // Assign Employee to a Café
        if (cafeId) {
            const cafeExists = await Cafe.findByPk(cafeId);
            if (!cafeExists) {
                return res.status(400).json({ message: 'Café does not exist.' });
            }

            await EmployeeCafe.create({
                EmployeeId: id,
                CafeId: cafeId,
                start_date: new Date(),
            });
        }

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });

    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: 'Error creating employee' });
    }
});



// PUT - Update Employee & Change Assigned Café
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { cafeId, ...employeeData } = req.body;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.update(employeeData);

        // If changing café assignment
        if (cafeId) {
            const cafeExists = await Cafe.findByPk(cafeId);
            if (!cafeExists) {
                return res.status(400).json({ message: 'Café does not exist.' });
            }

            await EmployeeCafe.destroy({ where: { EmployeeId: id } });
            await EmployeeCafe.create({ EmployeeId: id, CafeId: cafeId, start_date: new Date() });
        }

        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: 'Error updating employee' });
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
