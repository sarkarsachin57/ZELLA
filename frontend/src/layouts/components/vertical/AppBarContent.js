// ** MUI Imports
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'
import Magnify from 'mdi-material-ui/Magnify'

// ** Components
import LanguageToggler from 'src/@core/layouts/components/shared-components/LanguageToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import Button from '@mui/material/Button'
import ActionButton from 'src/views/commons/ActionButton'
import CustomSwitch from 'src/components/AntSwitch'
import { switchMode, switchMethod, switchViewMode } from 'src/pages/redux/features/siteSettingSlice'
import { TRUST_METHOD, TRUST_MODE, TRUST_VIEWMODE } from 'src/constants'
import { Truck } from 'mdi-material-ui'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { modeType, methodType, viewMode } = useSelector(state => state.siteSettingState)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleClick = value => {
    if (methodType === TRUST_METHOD.tracking && modeType !== value) {
      if (value === TRUST_MODE.offline) router.push('/offline')
      else router.push('/tracking')
      dispatch(switchMode(value))
    } else if (methodType === TRUST_METHOD.detection && modeType !== value) {
      if (value === TRUST_MODE.offline) router.push('/detection/offline')
      else router.push('/detection/online')
      dispatch(switchMode(value))
    }
  }

  const handleModeChange = () => {
    const updatedMode = modeType === TRUST_MODE.online ? TRUST_MODE.offline : TRUST_MODE.online
    if (methodType === TRUST_METHOD.tracking && modeType !== updatedMode) {
      if (updatedMode === TRUST_MODE.offline) router.push('/offline')
      else router.push('/tracking')
    } else if (methodType === TRUST_METHOD.detection && modeType !== updatedMode) {
      if (updatedMode === TRUST_MODE.offline) router.push('/detection/offline')
      else router.push('/detection/online')
    }
    dispatch(switchMode(updatedMode))
  }

  const handleMethodChange = () => {
    const updatedMethod = methodType === TRUST_METHOD.detection ? TRUST_METHOD.tracking : TRUST_METHOD.detection

    if (modeType === TRUST_MODE.online && methodType !== updatedMethod) {
      if (updatedMethod === TRUST_METHOD.detection) router.push('/detection/online')
      else router.push('/tracking')
    } else if (modeType === TRUST_MODE.offline && modeType !== updatedMethod) {
      if (updatedMethod === TRUST_METHOD.detection) router.push('/detection/offline')
      else router.push('/offline')
    }
    dispatch(switchMethod(updatedMethod))
  }

  const handleViewMode = () => {
    const updateViewMode = viewMode === TRUST_VIEWMODE.detect ? TRUST_VIEWMODE.correct : TRUST_VIEWMODE.detect
    dispatch(switchViewMode(updateViewMode))
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'end !important',
        justifyContent: 'space-between'
      }}
    >
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}></Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <NotificationDropdown /> */}
        <UserDropdown />
      </Box>
    </Box>
  )
}

export default AppBarContent
