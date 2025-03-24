import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '../components/TextInput';
import FileUpload from '../components/FileUpload';
import { getCafes, addCafe, updateCafe } from '../api/api';

const schema = yup.object({
    name: yup.string().min(6, "Must be at least 6 characters").max(10, "Must be at most 10 characters").required("Name is required"),
    description: yup.string().max(256, "Max 256 characters").required("Description is required"),
    logo: yup.mixed().test("fileSize", "File size too large (max 2MB)", (value) => !value || (value.size && value.size <= 2000000)),
    location: yup.string().required("Location is required"),
});

const CafeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { name: "", description: "", location: "", logo: "" }
    });

    useEffect(() => {
        if (id) {
            setLoading(true);
            getCafes().then((data) => {
                const cafe = data.find(c => c.id === id);
                if (cafe) {
                    reset({
                        name: cafe.name || "",
                        description: cafe.description || "",
                        location: cafe.location || "",
                        logo: cafe.logo || "",
                    });
                }
            }).finally(() => setLoading(false));
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            id ? await updateCafe(id, data) : await addCafe(data);
            navigate("/cafes");
        } catch (error) {
            console.error("Error saving café:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4">{id ? "Edit Café" : "Add New Café"}</Typography>
            {loading ? <Typography>Loading...</Typography> : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput control={control} name="name" label="Café Name" />
                    <TextInput control={control} name="description" label="Description" />
                    <FileUpload control={control} name="logo" label="Upload Logo (Max 2MB)" />
                    <TextInput control={control} name="location" label="Location" />
                    <Button type="submit" variant="contained" color="primary">{id ? "Update" : "Submit"}</Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate("/cafes")}>Cancel</Button>
                </form>
            )}
        </Container>
    );
};

export default CafeFormPage;
