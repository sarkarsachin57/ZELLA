// ** React Imports
import CGroups from '../../../styles/pages/login.module.scss'

import { useState, useEffect} from 'react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

import { useRegisterUserMutation } from 'src/pages/redux/apis/authApi';

//  import @core components
import {registerSchema} from 'src/@core/schema';
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { LoadingButton } from 'src/@core/components/button/LoadingButton';
import FormInput from 'src/@core/components/form/FormInput'
import { handleErrorResponse} from 'src/helpers/utils'
import { useSelector } from 'react-redux'
import EmailVerifyModal from 'src/views/modals/EmailVerifyModal'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '526px' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.QmQColors.grey
}))

//  ** Image comp for logo **QmQ
const LogoImage = styled('img')(({ theme}) => ({
  marginTop: '82px'
}))

const RegisterPage = () => {
  // ** States
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    email: ''
  })

  const methods = useForm({
    resolver: zodResolver(registerSchema)
  });

  const [registerUser, {
    isLoading, isError, error, isSuccess
  }] = useRegisterUserMutation();

  // ** Hook
  const theme = useTheme()
  const router = useRouter();

  const {
    reset,
    handleSubmit,
    formState: {
      isSubmitSuccessful
    }
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      toast.success('You are successfully Registered');

      router.back() || router.push('/');
    }
    if ( isError ) {
      handleErrorResponse(error, "", router);
    }
  }, [isLoading]);

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const onSubmitHandler = formValues => {
    // 👇 Executing the registerUser Mutation **QmQ

    const formData = new FormData();
    formData.append('first_name', formValues.first_name);
    formData.append('last_name', formValues.last_name);
    formData.append('email', formValues.email);
    formData.append('phone_number', formValues.phone_number);
    formData.append('password', formValues.password);
    console.log(formData)

    registerUser(formData)

    setValues({...values, email: formValues.email})
  };

  const [isEmailModalOpen, setEmailModalSwitch] = useState(false)

  const handleModalClose = () => {
    setEmailModalSwitch(false)
  }

  const handleModalOpen = () => {
    setEmailModalSwitch(true)
  }

  return (
    <Box className={CGroups.login} sx={{marginBottom: '30px'}}>
      <Box className={CGroups.login__logo} sx={{ mb: 8 }}>
        <LogoImage alt="logo image" src='/images/logo.png' />
      </Box>
      <Box className={CGroups.login__content}>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ padding: "20px 100px", marginBottom: '0px' }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, color: 'white', fontSize: '36px', lineHeight: '42px'}}>
                Register
              </Typography>
              <Typography variant='body2'>Please Enter User Data</Typography>
            </Box>
            <FormProvider {...methods }>
              <Box
                component='form'
                onSubmit={handleSubmit(onSubmitHandler)}
                noValidate
                autoComplete='off'
                width='100%'
              >
                <FormInput autoFocus={true} name='first_name' label='First Name:' type='text' sx={{borderRadius: '0.75rem'}}/>
                <FormInput name='last_name' label='Last Name:' type='text' sx={{borderRadius: '0.75rem'}}/>
                <FormInput name='email' label='Email:' type='email' sx={{borderRadius: '0.75rem'}}/>
                <FormInput name='phone_number' label='Phone Number:' type='text' sx={{borderRadius: '0.75rem'}}/>
                <FormInput name='password' label='Password:' type={ values.showPassword ? 'text': 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {/* <FormInput name='passwordConfirm' label='Confirm password:' type={ values.showPassword ? 'text': 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                /> */}
                <LoadingButton
                  variant='contained'
                  sx={{ mt: '1rem' }}
                  fullWidth
                  disableElevation
                  type='submit'
                  loading={isLoading}
                >
                  Sign Up
                </LoadingButton>
              </Box>
            </FormProvider>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/login'>
                  <LinkStyled>Sign in</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
