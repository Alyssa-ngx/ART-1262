import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../api/api';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { Container, Button, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this employee?")) {
            try {
                await deleteEmployee(id);
                setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id)); // Optimistic UI update
            } catch (error) {
                console.error("Error deleting employee:", error);
            }
        }
    };

    const columns = [
        { headerName: 'ID', field: 'id' },
        { headerName: 'Name', field: 'name' },
        { headerName: 'Email', field: 'email_address' },
        { headerName: 'Phone', field: 'phone_number' },
        { headerName: 'Days Worked', field: 'days_worked' },
        { headerName: 'Café', field: 'cafe' },
        {
            headerName: 'Actions',
            field: 'id',
            cellRenderer: (params) => (
                <>
                    <IconButton component={Link} to={`/employees/edit/${params.value}`}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(params.value)}><DeleteIcon /></IconButton>
                </>
            ),
        }
    ];

    return (
        <Container>
            <Typography variant="h4">Employees</Typography>
            <Button component={Link} to="/employees/new" variant="contained" color="primary" style={{ marginBottom: 10 }}>
                Add Employee
            </Button>
            
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <div className="ag-theme-alpine" style={{ height: 400 }}>
                    <AgGridReact 
                        rowData={employees} 
                        columnDefs={columns} 
                        pagination={true} 
                        modules={[ClientSideRowModelModule]} 
                    />
                </div>
            )}
        </Container>
    );
};

export default EmployeesPage;
