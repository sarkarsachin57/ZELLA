import {
  FormHelperText,
  Typography,
  FormControl,
  Input as _Input,
  Checkbox as _Checkbox,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Controller, useFormContext } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import RoundedCheckBox from './RoundedCheckBox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

  const Input = styled(_Input)`
  &:-internal-autofill-selected {
    background-color: rgb(255, 255, 255) !important;
    background-image: none !important;
    color: rgb(0, 0, 0) !important;
  }
  background-color: #212D52;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.2rem 0.2rem;
`;

const Checkbox = styled(_Checkbox)`
&:-internal-autofill-selected {
  background-color: rgb(255, 255, 255) !important;
  background-image: none !important;
  color: rgb(0, 0, 0) !important;
}
background-color: #212D52;
width: 1.5rem;
height: 1.5rem;
padding: 0.2rem 0.2rem;
`;

const FormCheckBox = ({ name, label, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control = {control}
      defaultValue = {true}
      name={name}
      render={({ field }) => (
        <FormControl  sx={{ mb: 2}}>
          {/* <FormControlLabel control={<RoundedCheckBox name="remember_me"/>} label='Remember Me' /> */}
          <Box
            sx={{
              mt: 4,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
          <Checkbox
            {...field}
            disableUnderline
            sx={{borderRadius: '0.2rem'}}
            {...otherProps}
            defaultChecked
          />
          {/* <Input
            {...field}
            disableUnderline
            sx={{borderRadius: '0.2rem'}}
            {...otherProps}

          /> */}
          <Typography
            variant='body2'
            sx={{ paddingLeft: 2, color: '#FFFFFF', mb: 1, fontWeight: 500 }}
          >
            {label}
          </Typography>

          </Box>
        </FormControl>
      )}
    />
  );
};

export default FormCheckBox;
