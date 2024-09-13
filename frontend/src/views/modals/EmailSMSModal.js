import { useState } from 'react'

import TextField from '@mui/material/TextField'
import DialogContent from '@mui/material/DialogContent'
import CustomModalLayout from './CustomModalLayout'
import { toast } from 'react-toastify'

export default function EmailSMSModal(props) {
  const {
    width,
    height,
    onHandleSubmit,
    onHandleModalClose,
    onHandleModalOpen,
    isOpen,
    isLoading = false,
    email = '',
    sms = ''
  } = props

  const [_email, setEmail] = useState(email)
  const [_sms, setSMS] = useState(sms)

  const validateData = () => {
    if (!_email || !_sms) {
      toast.error('Please input the Email and SMS', {
        position: 'top-right'
      })

      return false
    }

    return true
  }

  const handleSubmitWithData = () => {
    if (validateData()) {
      const data = { alert_email: _email, sms: _sms }
      onHandleSubmit(data)
    }
  }

  return (
    <CustomModalLayout
      width = {width}
      height = {height}
      isOpen={isOpen}
      isLoading={isLoading}
      title={'Add Email/SMS Details'}
      btnName={'Done'}
      onHandleModalClose={onHandleModalClose}
      onHandleModalOpen={onHandleModalOpen}
      onHandleSubmit={handleSubmitWithData}
    >
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          id='email'
          label='Email Address'
          type='email'
          fullWidth
          variant='standard'
          value={_email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          autoFocus
          value={_sms}
          onChange={e => setSMS(e.target.value)}
          margin='dense'
          id='sms'
          label='SMS'
          type='text'
          fullWidth
          variant='standard'
        />
      </DialogContent>
    </CustomModalLayout>
  )
}
