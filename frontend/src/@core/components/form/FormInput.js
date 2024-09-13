import {
  FormHelperText,
  Typography,
  FormControl,
  Input as _Input,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Controller, useFormContext } from 'react-hook-form';

  const Input = styled(_Input)`
  &:-internal-autofill-selected {
    background-color: rgb(255, 255, 255) !important;
    background-image: none !important;
    color: rgb(0, 0, 0) !important;
  }
  background-color: #212D52;
  padding: 0.4rem 0.7rem;
`;


const FormInput = ({ name, label, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue=''
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography
            variant='body2'
            sx={{ color: '#FFFFFF', mb: 1, fontWeight: 500 }}
          >
            {label}
          </Typography>
          <Input
            {...field}
            fullWidth
            disableUnderline
            sx={{borderRadius: '0.75rem'}}
            error={!!errors[name]}
            {...otherProps}
          />
          <FormHelperText error={!!errors[name]}>
            {errors[name] ? errors[name].message : ''}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default FormInput;
