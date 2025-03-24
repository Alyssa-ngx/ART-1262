import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const TextInput = ({ control, name, label, rules }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    label={label}
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error ? error.message : ""}
                />
            )}
        />
    );
};

export default TextInput;
