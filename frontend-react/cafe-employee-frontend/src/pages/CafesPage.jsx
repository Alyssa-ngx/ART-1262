import React, { useEffect, useState } from 'react';
import { getCafes, deleteCafe } from '../api/api';
import { AgGridReact } from 'ag-grid-react';
import { Container, Button, TextField, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const CafesPage = () => {
    const [cafes, setCafes] = useState([]);
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const data = await getCafes(location);
                setCafes(data);
            } catch (error) {
                console.error("Error fetching cafés:", error);
            }
        };

        fetchCafes();
    }, [location]);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this café?")) {
            try {
                await deleteCafe(id);
                setCafes(prevCafes => prevCafes.filter(cafe => cafe.id !== id));
            } catch (error) {
                console.error("Error deleting café:", error);
            }
        }
    };

    const columns = [
        { headerName: 'Logo', field: 'logo', cellRenderer: (params) => params.value ? <img src={params.value} alt="Logo" width="50" /> : 'No Logo' },
        { headerName: 'Name', field: 'name' },
        { headerName: 'Description', field: 'description' },
        { headerName: 'Employees', field: 'employees' },
        { headerName: 'Location', field: 'location' },
        {
            headerName: 'Actions',
            field: 'id',
            cellRenderer: (params) => (
                <>
                    <IconButton component={Link} to={`/cafes/edit/${params.value}`}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(params.value)}><DeleteIcon /></IconButton>
                </>
            ),
        }
    ];

    return (
        <Container>
            <Typography variant="h4">Cafés</Typography>
            <TextField 
                label="Filter by Location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                style={{ marginBottom: 10 }}
            />
            <Button variant="contained" color="primary" component={Link} to="/cafes/new">Add Café</Button>
            <div className="ag-theme-alpine" style={{ height: 400, marginTop: 20 }}>
                <AgGridReact 
                    rowData={cafes} 
                    columnDefs={columns} 
                    pagination={true} 
                    modules={[ClientSideRowModelModule]} 
                />
            </div>
        </Container>
    );
};

export default CafesPage;
