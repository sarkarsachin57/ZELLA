// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import WideFooter from 'src/views/pages/auth/WideFooter'

// Styled component for Blank Layout component
const BlankLayoutWrapper = styled(Box)(({ theme }) => ({
  overflowY: 'scroll',
  height: '100%',
  minHeight: '100vh',
  backgroundColor: '#0C1543',

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5)
  },

}))

const BlankLayout = ({ children }) => {
  return (
    <BlankLayoutWrapper className='layout-wrapper' sx={{position :'relative'}}>
      <Box className='app-content' sx={{ minHeight: '100%' }}>
        {children}
      </Box>
      <WideFooter />
    </BlankLayoutWrapper>
  )
}

export default BlankLayout
