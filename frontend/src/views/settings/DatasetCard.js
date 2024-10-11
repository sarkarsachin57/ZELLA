//  ** import style classes
import CGroups from '../../../styles/pages/settings.module.scss'

import {useState, useEffect, useRef, useMemo} from 'react'
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

export default function DatasetCard (props) {
  const [ simpleImageUrl, setSimpleImageUrl ] = useState('');
  const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/`;
  const { 
    url,
    email,
    project_name,
    getSimpleImageUrl,
    handleSimpleImageOpen
  } = props
  const handleGetSimpleImageUrl = async () => {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('project_name', project_name)
    formData.append('sample_path', url)
    try {
      const res = await getSimpleImageUrl(formData)
      console.log(res)
      setSimpleImageUrl(res.data.show_path)
      handleSimpleImageOpen()
    } catch (error) {
      toast.error('Something went wrong!');
    }
  }

  return (
    <Card className={CGroups.setting_panel}>
      <Box>
        {/* <CardContent sx={{ padding: '0px' }}> */}
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} sx={{ height: '100%' }}>
              <CardImage 
                src = {baseUrl + url} 
                alt='pic' 
                onClick={handleGetSimpleImageUrl}
              />
            </Grid>
          </Grid>
        {/* </CardContent> */}
      </Box>
    </Card>
  )
}