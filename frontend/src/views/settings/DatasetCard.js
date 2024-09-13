//  ** import style classes
import CGroups from '../../../styles/pages/settings.module.scss'

// ** import mui elements
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const CardImage = styled('img')(({ theme }) => ({
  padding: '0px',
  margin: '0px',
  borderRadius: '10px',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center'
}))

const DatasetCard = props => {
  const { children } = props

  return (
    <Card className={CGroups.setting_panel}>
      <Box>
        <CardContent sx={{ padding: '0px' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} sx={{ height: '80%' }}>
              <CardImage src='/images/avatars/1.png' alt='pic' />
            </Grid>
          </Grid>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ padding: '0 8px' }}>class name</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ padding: '0 8px' }}>file name</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Box>
    </Card>
  )
}

export default DatasetCard
