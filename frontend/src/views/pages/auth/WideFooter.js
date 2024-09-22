// ** React Imports
import { Fragment } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

const FooterSection = styled('div')(()=>({
  // bottom: '50px',
  zIndex: 1,
  width: '100%',
  textAlign: 'center',
  position: 'absolute',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '15px',
  padding: '1rem',
  bottom: 0,
  width: '100%',
}))

const WideFooter = props => {
  // ** Hook
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  if (!hidden) {
    return (
      <Fragment>
        <FooterSection>
            ZELLA version 1.0
        </FooterSection>
      </Fragment>
    )
  } else {
    return null
  }
}

export default WideFooter
