import React, { useState } from 'react'
import { styled, Box, Theme } from '@mui/system'
import ModalUnstyled from '@mui/base/ModalUnstyled'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import Grid from '@mui/material/Grid'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const BackdropUnstyled = React.forwardRef((props, ref) => {
  const { open = false, className, ...other } = props

  return <div className={clsx({ 'MuiBackdrop-open': open }, className)} ref={ref} {...other} />
})

const Modal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Backdrop = styled(BackdropUnstyled)`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(100, 100, 100, 0.5);
  -webkit-tap-highlight-color: transparent;
`

export default function SearchForm(props) {
  const { isOpen = false, onHandleModalClose, onHandleSetFilter, formType, logInfo = {} } = props
  const [inputText, setInputText] = useState('')
  //   const[inputModalFlag, toggleInputModalFlag] = useState(isOpen);
  const handleSubmitButton = () => {
    switch(formType) {
      case 'UseCase':
        onHandleSetFilter({ useCaseVal: inputText })
        break;    
      case 'SensorVideoName':
        onHandleSetFilter({ sensorVideoNameVal: inputText })
        break;    
      case 'AddTarget':
        onHandleSetFilter({ targetClassesVal: inputText })
        break;    
      case 'FalseInstances':
        onHandleSetFilter({ falseInstancesVal: inputText })
        break;    
      case 'FalsePositives':
        onHandleSetFilter({ falsePositivesVal: inputText })
        break;    
      case 'FalseNegatives':
        onHandleSetFilter({ falseNegativesVal: inputText })
        break;
      default: break;
    }
    onHandleModalClose()
  }

  const style = theme => ({
    //   width: width,
    bgcolor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
    border: '2px solid currentColor',
    padding: '16px 24px 24px 24px',
    position: 'relative',
    textAlign: 'center',
    borderRadius: '10px',
  })

  return (
    <div>
      <Modal
        aria-labelledby='unstyled-modal-title'
        aria-describedby='unstyled-modal-description'
        open={isOpen}
        onClose={onHandleModalClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'white' }}>{logInfo.content}</Typography>
            <IconButton aria-label='close' onClick={onHandleModalClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant='body2' sx={{ fontSize: '2.5rem' }}>
            Input Value
          </Typography>
          <DialogContent>
            <Grid container spacing={2}>
              { formType && (formType === 'UseCase' | formType === 'SensorVideoName' | formType === 'AddTarget') ?
                <Grid item xs={12} sm={6}>
                  <TextField
                    full
                    width
                    type='text'
                    label='InputValue'
                    plaseHoler='please input filter value'
                    onChange={e => {
                      setInputText(e.target.value)
                      console.log('input text in search form===>❤❤❤', e.target.value);
                    }}
                  ></TextField>
                </Grid>
                : <Grid item xs={12} sm={6}>
                <TextField
                  full
                  width
                  type='number'
                  label='InputValue'
                  plaseHoler='please input filter value'
                  onChange={e => {
                    setInputText(e.target.value)
                  }}
                ></TextField>
              </Grid>
              }
              <Grid item xs={12} sm={6}>
                <Button sx={{ fontSize: '1.5rem', width: '100%' }} onClick={handleSubmitButton}>
                  OK
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}
