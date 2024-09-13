import Box from '@mui/material/Box'
import VerticalNavHeader from 'src/@core/layouts/components/vertical/navigation/VerticalNavHeader'
import LanguageToggler from 'src/@core/layouts/components/shared-components/LanguageToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useSettings } from 'src/@core/hooks/useSettings'

const UserLayout = ({ children }) => {
  const { settings, saveSettings } = useSettings()

  return (
    <Box sx={{height: '100vh'}}
    >
      <Box sx={{ display: 'flex',flexDirection: 'row',marginRight: '100px', justifyContent: 'space-between' }}>
        <VerticalNavHeader />
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageToggler settings={settings} saveSettings={saveSettings} />
          <UserDropdown />
      </Box>
      </Box>
      {children}
    </Box>
  )
}

export default UserLayout
