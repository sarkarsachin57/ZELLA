//  ** import style classes
import CGroups from '../../../styles/pages/settings.module.scss'

// ** import mui elements
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import Typography from '@mui/material/Typography'
import SettingPanelHeader from 'src/views/settings/SettingPanelHeader'
import WifiRoundedIcon from '@mui/icons-material/WifiRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import { LoadingButton } from 'src/@core/components/button/LoadingButton'

const SettingPanelLayout = props => {
  const { children } = props

  const _props = {
    btnTitle: 'button',
    btnAction: f => f,
    isLoading: false,
    headerIcon: <StarBorderRoundedIcon />,
    headerTitle: 'title',
    ...props
  }

  return (
    <Card className={CGroups.setting_panel}>
      <SettingPanelHeader icon={_props.headerIcon} title={_props.headerTitle} />
      <Box>
        <CardContent sx={{}}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={10}>
              {children}
            </Grid>
            <Grid item xs={12} sm={2}>
              <LoadingButton
                variant='contained'
                className={CGroups.setting_button}
                sx={{ mt: 1, padding: '8px' }}
                disableElevation
                onClick={_props.btnAction}
                loading={_props.isLoading}
              >
                {_props.btnTitle}
              </LoadingButton>
            </Grid>
          </Grid>
        </CardContent>
      </Box>
    </Card>
  )
}

export default SettingPanelLayout
