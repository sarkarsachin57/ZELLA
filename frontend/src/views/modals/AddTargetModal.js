import React, { useState, useEffect } from 'react'
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
import { TagHeart } from 'mdi-material-ui'

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
  .MuiBox-root {
    width: 1100px;
  }
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

export default function SearchModal(props) {
  const {
    isOpen = false,
    onHandleModalClose,
    logInfo = {},
    onHandleSetFilter,
    onHandleAddTarget,
    
    title,
    cameraNameList
    //   width = 500,
  } = props

  const [targetSetting, setTargetSetting] = useState({
    target: '',
    falseInstances: -1,
    falsePositives: -1,
    falseNegatives: -1
  })

  const handleAddButton = () => {
    onHandleAddTarget(targetSetting)
    console.log('🚕=>handleAddButton', targetSetting)
    onHandleModalClose()
  }

  const style = theme => ({
    //   width: width,
    bgcolor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
    border: '2px solid currentColor',
    padding: '16px 24px 24px 24px',
    position: 'relative',
    textAlign: 'center',
    borderRadius: '10px'
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
            Add Target Class
          </Typography>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <TextField
                  style = {{ width: '80%' }}
                  type='text'
                  label='Add Target'
                  placeholder='Target Class'
                  onChange={ e => {
                    // onHandleSetFilter({ targetClasses_targetVal: e.target.value })
                    setTargetSetting({ 
                      ...targetSetting,
                      target: e.target.value,
                      falseInstances: targetSetting.falseInstances,
                      falsePositives: targetSetting.falsePositives,
                      falseNegatives: targetSetting.falseNegatives  
                    })
                  }}
                  />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style = {{ width: '80%' }}
                  type='number'
                  label='Number Of False Instances'
                  placeholder='Please input number of false instances'
                  onChange={ e => {
                    // onHandleSetFilter({ targetClasses_n_inVal: e.target.value })
                    setTargetSetting({ 
                      ...targetSetting,
                      target: targetSetting.target,
                      falseInstances: e.target.value,
                      falsePositives: targetSetting.falsePositives,
                      falseNegatives: targetSetting.falseNegatives  
                    })
                  } }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style = {{ width: '80%' }}
                  type='number'
                  label='Number Of False Positives'
                  placeholder='Please input number of false positives'
                  onChange={ e => {
                    // onHandleSetFilter({ targetClasses_n_fpVal: e.target.value })
                    setTargetSetting({ 
                      ...targetSetting,
                      target: targetSetting.target,
                      falseInstances: targetSetting.falseInstances,
                      falsePositives: e.target.value,
                      falseNegatives: targetSetting.falseNegatives  
                    })
                  } }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style = {{ width: '80%' }}
                  type='number'
                  label='Number Of False negatives'
                  placeholder='Please input number of false negatives'
                  onChange={ e => {
                    // onHandleSetFilter({ targetClasses_n_fnVal: e.target.value })
                    setTargetSetting({ 
                      ...targetSetting,
                      target: targetSetting.target,
                      falseInstances: targetSetting.falseInstances,
                      falsePositives: targetSetting.falsePositives,
                      falseNegatives: e.target.value 
                    })
                  } }
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button
                  sx={{
                    fontSize: '1.5rem',
                    width: '15%',
                    border: '1px Groove rgba(231, 227, 252, 0.25)',
                    backgroundColor: 'rgba(82, 222, 140)',
                    marginTop: '100px',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(82, 222, 140, 0.3)',
                    }
                  }}
                  onClick={() => {
                    handleAddButton()
                  }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}
