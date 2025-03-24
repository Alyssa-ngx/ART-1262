import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container, Button, Typography, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "../components/TextInput";
import { getEmployees, getCafes, addEmployee, updateEmployee } from "../api/api";

const generateEmployeeId = () => `UI${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

const schema = yup.object({
  name: yup.string().min(6, "Must be at least 6 characters").max(10, "Must be at most 10 characters").required("Name is required"),
  email_address: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().matches(/^[89]\d{7}$/, "Invalid SG phone number").required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  cafeId: yup.string().required("Please select a café"),
});

const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: id || generateEmployeeId(),
      name: "",
      email_address: "",
      phone_number: "",
      gender: "Male",
      cafeId: "",
    },
  });

  useEffect(() => {
    getCafes().then(setCafes).catch(() => setCafes([]));
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getEmployees().then((data) => {
        const employee = data.find((emp) => emp.id === id);
        if (employee) {
          reset({
            id: employee.id, // Keep existing ID when updating
            name: employee.name || "",
            email_address: employee.email_address || "",
            phone_number: employee.phone_number || "",
            gender: employee.gender || "Male",
            cafeId: employee.cafeId || "",
          });
        }
      }).finally(() => setLoading(false));
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      // Generate an ID only if creating a new employee
      const employeeData = id ? data : { ...data, id: generateEmployeeId() };

      // Check for duplicate email
      const employees = await getEmployees();
      const existingEmployee = employees.find((emp) => emp.email_address === data.email_address && emp.id !== id);
      if (existingEmployee) {
        return alert("Email address is already in use. Please use a different email.");
      }

      id ? await updateEmployee(id, employeeData) : await addEmployee(employeeData);
      navigate("/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

    
  return (
    <Container>
      <Typography variant="h4">{id ? "Edit Employee" : "Add New Employee"}</Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput control={control} name="name" label="Name" />
          <TextInput control={control} name="email_address" label="Email" />
          <TextInput control={control} name="phone_number" label="Phone Number" />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            )}
          />

          <Controller
            name="cafeId"
            control={control}
            render={({ field }) => (
              <Select {...field} fullWidth displayEmpty>
                <MenuItem value="">Select a Café</MenuItem>
                {cafes.map((cafe) => (
                  <MenuItem key={cafe.id} value={cafe.id}>
                    {cafe.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          <Button type="submit" variant="contained" color="primary">
            {id ? "Update" : "Submit"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/employees")}>
            Cancel
          </Button>
        </form>
      )}
    </Container>
  );
};

export default EmployeeFormPage;
