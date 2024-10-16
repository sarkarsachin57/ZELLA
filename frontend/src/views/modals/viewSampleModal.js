import React from 'react'
import {useState, useEffect, useRef, useMemo} from 'react'
import { toast } from 'react-toastify'

import CustomModalLayout from './CustomModalLayout'

import DialogContent from '@mui/material/DialogContent'
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import DatasetCard from 'src/views/settings/DatasetCard'
import { LoadingButton } from 'src/@core/components/button/LoadingButton'
import CGroups from '../../../styles/pages/settings.module.scss'
import SimpleImageModal from './SimpleImageModal'


export default function ViewSampleModal (props) {
  const {
    width,
    isOpen,
    isLoading,
    onHandleModalClose,
    email,
    project_name,
    data_name,
    class_data,
    getViewSample,
    getSimpleImageUrl
  } = props

  const [ isChildModalOpen, setIsChildModalOpen ] = useState(false);
  const [ class_name, setClassName ] = useState('');
  const [ sample_image_rul, setSampleImageUrl ] = useState([]);
  const [ total_img_num, setTotalImgNum ] = useState('');

  const [ page_num, setPageNum ] = useState(1);

  const validate = () => {
    if (!class_name) {
      toast.error('Please select the Class Name')

      return false
    }
    if (!page_num) {
      toast.error('Please input the page Number')

      return false
    }
    
    return true
  }
  const handleViewSample = async (value) => {
    if (validate()) {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('project_name', project_name)
      formData.append('data_name', data_name)
      formData.append('show_samples', '1')
      formData.append('class_name', class_name)
      formData.append('page_number', value)
      try {
        const res = await getViewSample(formData)
        setSampleImageUrl(res.data.sample_paths)
        setTotalImgNum(res.data.number_of_samples)
      } catch (error) {
        toast.error('Something went wrong!');
      }
    }
  }
  const handleChange = (event, value) => {
    setPageNum(value);
    handleViewSample(value);
  };
  const handleSimpleImageOpen = () => {
    setIsChildModalOpen(true);
  }

  const handleSimpleImageClose = () => {
    setIsChildModalOpen(false);
  }
  return (
    <CustomModalLayout
      width = {width}
      isOpen={isOpen}
      // isLoading={isLoading}
      title={'Training Result Information'}
      // btnName={'Done'}
      onHandleModalClose={()=>{ onHandleModalClose()}}
      // onHandleSubmit={ onHandleSubmitWithData }
    >
      <DialogContent>
        <CardContent
        sx = {{
          // margin: '6px',
          textAlign:'center',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          flexDirection:'column'
        }}>
          <Grid container spacing={6} sx={{marginBottom:'15px'}}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id='class_name'> {'Class Name'} </InputLabel>
                <Select
                  value={class_name}
                  onChange={e =>
                    setClassName( e.target.value )
                  }
                  id='class_name'
                  labelId='class_name'
                  input={<OutlinedInput label='Class Name' id='Class Name' />}
                >
                  {
                    class_data ===null? '' :class_data.map((item, index) =>{
                      return <MenuItem value={item}> {item} </MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            </Grid>
            <Grid item xs={12} sm={2}>
              <LoadingButton
                  variant='contained'
                  className={CGroups.setting_button}
                  sx={{ mt: 1, padding: '8px' }}
                  disableElevation
                  onClick={(e) => handleViewSample(1)}
              >
                  View Samples
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}
              sx = {{
                // margin: '6px',
                textAlign:'center',
                display: 'flex',
                justifyContent: 'right',
                position: 'relative',
              }}
            >
              {
                total_img_num?
                <Pagination count={Math.floor(Number(total_img_num)/24)+1} page={page_num} color="primary" onChange={handleChange}/>
                : null
              }
            </Grid>
          </Grid>
          <Grid container spacing={6}>
            {
              
              sample_image_rul.length ?
              sample_image_rul.map((item, index) => {
                console.log(item)
                return (<Grid item xs={12} sm={1.5}>
                          <DatasetCard 
                            url = {item} 
                            getSimpleImageUrl = {getSimpleImageUrl}
                            email={email}
                            project_name={project_name}
                            handleSimpleImageOpen={handleSimpleImageOpen}
                          />
                        </Grid>)
              })
              :null
            }
          </Grid>
          <SimpleImageModal 
            isOpen={isChildModalOpen}
            onHandleModalClose={handleSimpleImageClose}
          />
        </CardContent>
      </DialogContent>
    </CustomModalLayout>
  )
}
