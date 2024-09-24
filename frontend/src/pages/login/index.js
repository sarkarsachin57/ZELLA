// ** Import External Classes
import CGroups from '../../../styles/pages/login.module.scss'
import { handleErrorResponse } from 'src/helpers/utils'

// ** React Imports
import { useState, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FormInput from 'src/@core/components/form/FormInput'
import FormCheckBox from 'src/@core/components/form/FormCheckBox'
import { useLoginUserMutation } from 'src/pages/redux/apis/authApi'
import { toast } from 'react-toastify'
import { LoadingButton } from 'src/@core/components/button/LoadingButton'
import { loginSchema } from 'src/@core/schema'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '526px' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.QmQColors.grey
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

/**
 * @component shows the logo
 */
const LogoImage = styled('img')(({ theme }) => ({
  marginTop: '82px'
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })

  // 👇 methods to handle the login form
  const methods = useForm({
    resolver: zodResolver(loginSchema)
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful }
  } = methods

  const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation()

  // ** Hook
  const theme = useTheme()
  const router = useRouter()



  useEffect(() => {
    if (isSuccess) {
      toast.success('You successfully logged in')
      router.push('/')
    }
    if (isError) {
      handleErrorResponse(error, "");
    }
  }, [isLoading])

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful])

  const onSubmitHandler = values => {
    const formData = new FormData();

    localStorage.setItem("email", values.email);

    formData.append('email', values.email);
    formData.append('password', values.password);
    
    loginUser(formData)
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  return (
    <Box className={CGroups.login} sx={{marginBottom: '120px'}}>
      <Box className={CGroups.login__logo} sx={{ mb: 8 }}>
        <LogoImage alt='logo image' src='/images/logo.png' />
      </Box>

      <Box className={CGroups.login__content}>
        <Card className={CGroups.card} sx={{ zIndex: 1 }}>
          <CardContent className={CGroups.cardContent}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant='h5'
                sx={{ fontWeight: 600, marginBottom: 1.5, color: 'white', fontSize: '36px', lineHeight: '42px' }}
              >
                Login
              </Typography>
              <Typography variant='body2'>Please Enter Your Username & Password</Typography>
            </Box>
            <FormProvider {...methods}>
              <Box
                component='form'
                onSubmit={handleSubmit(onSubmitHandler)}
                noValidate
                autoComplete='off'
                width='100%'
              >
                <FormInput className={CGroups.form_input} autoFocus={true} name='email' label='Email:' type='email' sx={{ borderRadius: '0.75rem' }} />
                <FormInput
                  name='password'
                  label='Password:'
                  type = { values.showPassword ? 'text': 'password'}
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
                <FormCheckBox
                   name='remember_me'
                   label='Remember Me'
                   type="checkbox"
                   value={false}
                />
                {/* <Box
                  sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                  }}
                >
                  <FormControlLabel control={<RoundedCheckBox name="remember_me"/>} label='Remember Me' />
                </Box> */}
                <LoadingButton
                  variant='contained'
                  sx={{ mt: 1 }}
                  fullWidth
                  disableElevation
                  type='submit'
                  loading={isLoading}
                >
                  Login
                </LoadingButton>
              </Box>
            </FormProvider>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', mt: 3 }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Need an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/register'>
                  <LinkStyled>Sign Up Here</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* <Box className={ CGroups.login__forgetPassword }>
        <Typography variant='body2'>
          <Link passHref href='/register'>
            <LinkStyled>Forgot Password ?</LinkStyled>
          </Link>
        </Typography>
      </Box> */}
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
