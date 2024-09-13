import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';

const LanguageToggler = props => {
  // ** Props
  const { settings, saveSettings } = props

  const handleModeChange = mode => {
    saveSettings({ ...settings, mode })
  }

  const handleLanguageToggle = () => {

  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleLanguageToggle} sx={{fontSize: '14px'}}>
      {settings.mode === 'dark' ? 
      <>
        <LanguageRoundedIcon/> EN
      </> : 
      <>
        <LanguageRoundedIcon/> SB
      </>
      }
    </IconButton>
  )
}

export default LanguageToggler
