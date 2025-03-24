const express = require('express');
const router = express.Router();
const { Cafe, Employee, EmployeeCafe } = require('../models');

// GET - Fetch All Cafés with Employee Count
router.get('/', async (req, res) => {
    try {
        const { location } = req.query;

        const queryOptions = {
            include: [{ model: Employee, as: "Employees", attributes: ['id'] }]
        };

        // filter by location (case-insensitive)
        if (location) {
            queryOptions.where = {
                location: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('location')),
                    'LIKE',
                    `%${location.toLowerCase()}%`
                )
            };
        }

        const cafes = await Cafe.findAll(queryOptions);

        res.status(200).json(
            cafes.map(cafe => ({
                id: cafe.id,
                name: cafe.name,
                description: cafe.description,
                logo: cafe.logo,
                location: cafe.location,
                employees: cafe.Employees ? cafe.Employees.length : 0
            }))
        );
    } catch (error) {
        console.error("Error fetching cafés:", error);
        res.status(500).json({ message: 'Error retrieving cafés' });
    }
});


// POST - Create Café
router.post('/', async (req, res) => {
    try {
        let { name, description, logo, location } = req.body;

        if (!name || !description || !location) {
            return res.status(400).json({ message: 'Name, description, and location are required.' });
        }

        // logo is a valid URL or set it to null if empty
        if (logo && logo.trim() !== '') {
            const urlPattern = new RegExp('^(https?:\\/\\/)?' +
                '((([a-zA-Z0-9$_.+!*\'(),%-]+)\\.)+[a-zA-Z]{2,})' +
                '(\\/[a-zA-Z0-9$_.+!*\'(),%-]*)*' +
                '(\\?[a-zA-Z0-9$_.+!*\'(),%-=&]*)?' +
                '(#[a-zA-Z0-9$_.+!*\'(),%-]*)?$', 'i');

            if (!urlPattern.test(logo)) {
                return res.status(400).json({ message: 'Invalid logo URL format.' });
            }
        } else {
            logo = null;
        }

        // Create the Café
        const newCafe = await Cafe.create({ name, description, logo, location });

        res.status(201).json({ message: 'Café created successfully', cafe: newCafe });
    } catch (error) {
        console.error("Error creating café:", error);

        // Sequelize validation errors
        if (error.errors && error.errors.length > 0) {
            return res.status(400).json({ message: error.errors[0].message });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
});


// PUT - Update Café
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cafe = await Cafe.findByPk(id);

        if (!cafe) {
            return res.status(404).json({ message: 'Café not found' });
        }

        await cafe.update(req.body);
        res.status(200).json({ message: 'Café updated successfully', cafe });
    } catch (error) {
        console.error("Error updating café:", error);
        res.status(500).json({ message: 'Error updating café' });
    }
});

// DELETE - Remove Café & Employees
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Checking if Café ID ${id} exists...`);

        // Check if the café exists
        const cafe = await Cafe.findOne({ where: { id } });

        if (!cafe) {
            console.log(`Café ID ${id} not found.`);
            return res.status(404).json({ message: 'Café not found' });
        }

        console.log(`Café ID ${id} found. Proceeding with deletion...`);

        await EmployeeCafe.destroy({ where: { CafeId: id } });

        await cafe.destroy();

        console.log(`Café ID ${id} and its employees deleted successfully.`);
        res.status(200).json({ message: 'Café and associated employees deleted successfully' });
    } catch (error) {
        console.error("Error deleting café:", error);
        res.status(500).json({ message: 'Error deleting café' });
    }
});

module.exports = router;
