//  ** import style classes
import CGroups from '../../../styles/pages/settings.module.scss'

// ** import mui elements
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

const CardBox = props => {
  const { children } = props

  return (
    <Card className={CGroups.setting_panel} >
      <Box>
        <CardContent sx={{ padding: '0px' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
            <Grid item xs={12} sm={12} sx={{ padding: '0px' }}>
              {children}
            </Grid>
          </Grid>
        </CardContent>
      </Box>
    </Card>
  )
}

export default CardBox
