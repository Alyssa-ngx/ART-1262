import { Controller } from 'react-hook-form';
import { Button } from '@mui/material';

const FileUpload = ({ control, name, label, rules }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange }, fieldState: { error } }) => (
                <div>
                    <Button variant="contained" component="label">
                        {label}
                        <input type="file" hidden onChange={(e) => onChange(e.target.files[0])} />
                    </Button>
                    {error && <p style={{ color: 'red' }}>{error.message}</p>}
                </div>
            )}
        />
    );
};

export default FileUpload;
