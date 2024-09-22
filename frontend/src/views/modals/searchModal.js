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
import Autocomplete from '@mui/material/Autocomplete'
import Chip from  '@mui/material/Chip'
import DeleteIcon from '@mui/icons-material/Delete'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardHeader from '@mui/material/CardHeader'
import AddTargetModal from 'src/views/modals/AddTargetModal'
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
    cameraNameList,
    filterData,
    isOpen = false,
    logInfo = {},
    onHandleModalClose,
    onHandleSetFilter,
    onHandleSearch,
  } = props

  const [isAddTargetModalOpen, setAddTargetModalOpen] = useState(false)
  const [addTarget, setAddTarget] = useState([])

  const handleSearchButton = () => {
    onHandleSearch()
  }

  const onHandleAddTarget = (target
  ) => {
    setAddTarget([...addTarget, target])
    onHandleSetFilter({ targetClassesArr: [...addTarget, target] })
    console.log('addTargetVal ====>', addTarget)
  }

  const handleTargetsDelete = (index) => {
    const updatedTarget = [...addTarget]
    updatedTarget.splice(index, 1)
    setAddTarget(updatedTarget)
    onHandleSetFilter({ targetClassesArr: updatedTarget })
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
          <Box>
            <Typography sx={{ color: 'white' }}>{logInfo.content}</Typography>
            <IconButton aria-label='close' onClick={onHandleModalClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ fontSize: '2.5rem' }}>
            Advance Error Search
          </Typography>
          <DialogContent style={{ padding: '48px'}}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={filterData.useCase}
                  type='text'
                  label='Use Case'
                  placeholder='Please input use case'
                  onChange={ e => onHandleSetFilter({ useCaseVal: e.target.value }) }
                  />
              </Grid>
              <Grid item xs={12} sm={6} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Autocomplete
                  style={{ width: '100%' }}
                  disablePortal
                  id='combo-box-demo'
                  options={cameraNameList}
                  value={filterData.sensorVideoName}
                  onChange={(e, val) => {
                    onHandleSetFilter({ sensorVideoNameVal: val })

                  }}
                  renderInput={params => {
                    return <TextField {...params} label='Media Name' />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    style = {{ width: '100%' }}
                    value={filterData.falseInstances}
                    type='number'
                    label='Number Of False Instances'
                    placeholder='Please input number of false instances'
                    onChange={ e => onHandleSetFilter({ falseInstancesVal: e.target.value }) }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    style = {{ width: '100%' }}
                    value={filterData.falsePositives}
                    type='number'
                    label='Number Of False Positives'
                    placeholder='Please input number of false positives'
                    onChange={ e => onHandleSetFilter({ falsePositivesVal: e.target.value }) }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    style = {{ width: '100%' }}
                    value={filterData.falseNegatives}
                    type='number'
                    label='Number Of False Negatives'
                    placeholder='Please input number of false negatives'
                    onChange={ e => onHandleSetFilter({ falseNegativesVal: e.target.value }) }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  sx={{ fontSize: '1.5rem', width: '100%', color: 'white', fontSize: '1.25em', border: '1px Groove rgba(231, 227, 252, 0.25)' }}
                  onClick={() => setAddTargetModalOpen(true)}
                >
                  Add Target Classes
                </Button>
              </Grid>

                {filterData.targetClasses &&
                  filterData.targetClasses.map((targetElement, index) => {
                    return (
                      <Grid item xs={6} sm={3} >
                        <Card style={{
                            background:'#0A1929',
                            borderStyle: 'Groove',
                            borderWidth: '2px',
                            borderColor: 'rgba(231, 227, 252, 0.25)',
                            borderRadius: '10px',
                          }}
                          key={index}
                          >
                          <CardContent style={{ position: 'relative' }}>
                            <CardActions style={{
                                position: 'absolute',
                                left: '75%',
                                top: '-10%'
                              }}>
                                <IconButton
                                  aria-label="Delete"
                                  onClick={() => handleTargetsDelete(index)}
                                >
                                  <DeleteIcon/>
                                </IconButton>
                            </CardActions>
                            <Typography component="div" mb={'10px'}>
                              Target: {targetElement['target']}
                            </Typography>
                            <Typography color="textSecondary">
                              False Instances: {targetElement['falseInstances']}
                            </Typography>
                            <Typography color="textSecondary" >
                              False Positives: {targetElement['falsePositives']}
                            </Typography>
                            <Typography color="textSecondary">
                              False Negatives: {targetElement['falseNegatives']}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}

              <Grid item xs={12} sm={12}>
                <Button
                  sx={{
                    fontSize: '1.5rem',
                    width: '30%',
                    border: '1px Groove rgba(231, 227, 252, 0.25)',
                    backgroundColor: 'rgba(82, 222, 140)',
                    marginTop: '100px',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(82, 222, 140, 0.3)',
                    }
                  }}
                  onClick={handleSearchButton}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Box>
      </Modal>

      { isAddTargetModalOpen &&
          <AddTargetModal
            isOpen={isAddTargetModalOpen}
            onHandleModalClose={() => setAddTargetModalOpen(false)}
            onHandleSetFilter={onHandleSetFilter}
            onHandleAddTarget={onHandleAddTarget}
            // onHandleAddTarget={setTargetClasses}
            // cameraNameList={cameraNameList}
          />}
    </div>
  )
}
