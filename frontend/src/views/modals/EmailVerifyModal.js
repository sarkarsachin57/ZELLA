import { useEffect, useState } from 'react'

import TextField from '@mui/material/TextField'
import DialogContent from '@mui/material/DialogContent'
import { toast } from 'react-toastify'

// import { useRouter } from 'next/router'
import { useVerifyEmailMutation, useVerifyUserMutation } from '../../pages/redux/apis/authApi'
import { userApi } from 'src/pages/redux/apis/userApi'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { handleErrorResponse } from 'src/helpers/utils'
import { MuiOtpInput } from 'mui-one-time-password-input'
import CustomModal from './CustomModal'
import { CosineWave } from 'mdi-material-ui'

export default function EmailVerifyModal(props) {
  const {
    width,
    height,

    // onHandleSubmit,
    onHandleModalClose,
    onHandleModalOpen,
    isOpen,
    email,
    isLoading = false,
    verifyCode = ''
  } = props


  const router = useRouter()

  const [_verifyCode, setVerifyCode] = useState(verifyCode)

  const [verifyEmail, { isError, error, isSuccess }] = useVerifyEmailMutation()

  const handleChange = _verifyCode => {
    setVerifyCode(_verifyCode)

  }

  const methods = useForm({
    // resolver: zodResolver(VerifySchema)
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors }
  } = methods

  const onSubmitHandler = ( {email, _verifyCode} ) => {

    // 👇 Executing the verifyEmail Mutation **QmQ

    verifyEmail( {email, _verifyCode} )
  }

  console.log('0-0-0-0-Email-0-00-0-0', email)
  console.log('0-0-0-0-_verifyCode-0-00-0-0', _verifyCode)

  useEffect(() => {
    if (isSuccess) {
      router.back() || router.push('/')
    }
    if (isError) {
      handleErrorResponse(error)
    }
  }, [error, isError, isSuccess, router])

  return (
    <CustomModal
      {...methods}
      width={width}
      height={height}
      isOpen={isOpen}
      isLoading={isLoading}
      title={'Add VerifyCode'}
      btnName={'Verify Code'}
      onHandleModalClose={onHandleModalClose}
      onHandleModalOpen={onHandleModalOpen}
      onHandleSubmit={handleSubmit(onSubmitHandler)}
      type='submit'
    >
      <DialogContent>
        <MuiOtpInput
          length={5}
          autoFocus
          value={_verifyCode}
          onChange={handleChange}
          margin='dense'
          id='verifycode'
          label='Verify Code'
          type='text'
          fullWidth
          variant='standard'
        />
      </DialogContent>
    </CustomModal>
  )
}
