import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'


import {
  Box,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material'
import FileInput from 'src/views/commons/FileInput'
import CustomModalLayout from './CustomModalLayout'
import {
  configApi,
  useCreateConfigMutation,
  useUpdateConfigMutation,
  useDeleteConfigMutation
} from 'src/pages/redux/apis/configApi'
import { useCreateLogMutation } from 'src/pages/redux/apis/logApi'

import { useUpdateUserMutation } from 'src/pages/redux/apis/userApi'

import {
  useTerminate_cameraMutation,
  useUploadVideoMutation,
  useInitialize_offline_videoMutation,
  uploadChunkedVideo
} from 'src/pages/redux/apis/edfsdf'

import { getFileExtension } from 'src/helpers/utils'
import { TRUST_METHOD, TRUST_MODE } from 'src/constants'

const BackdropUnstyled = React.forwardRef((props, ref) => {
  const { open = false, className, ...other } = props
  return <div className={clsx({ 'MuiBackdrop-open': open }, className)} ref={ref} {...other} />
})

const style = theme => ({
  //   width: width,
  bgcolor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  padding: '16px 24px 24px 24px',
  position: 'relative',
  textAlign: 'center',
  borderRadius: '10px'
})

export default function SearchModal(props) {
  const { isOpen, onClose } = props

  const [isInitModalOpen, setInitModalSwitch] = useState(false)
  const [initEl, setInitEl] = useState('')
  const [termEl, setTermEl] = useState('')

  const [conValues, setConValues] = useState({
    video_file: undefined,
    camera_name: '',
    tracking_mode: 'sot'
  })

  // ============ Define the states <end> ================ **QmQ

  const user = useSelector(state => {
    return state.userState.user
  })

  configApi.endpoints.getAllConfigs.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true
  })

  // ============ Define actions <start> ================== **QmQ
  const [createConfig, { isLoading, isError, error, isSuccess }] = useCreateConfigMutation()
  const [uploadVideo] = useUploadVideoMutation()
  const [initialize_offline_video, { isSuccess: init_success, isLoading: init_camera_loading, data: init_data }] =
    useInitialize_offline_videoMutation()
  const [terminate_camera, { isLoading: term_isLoading }] = useTerminate_cameraMutation()

  const [updateConfig, { isLoading: update_isLoading, error: init_error, isSuccess: init_isSuccess }] =
    useUpdateConfigMutation()
  const [deleteConfig] = useDeleteConfigMutation()
  const [createLog] = useCreateLogMutation()

  const [updateUser, { isLoading: update_user_isLoading }] = useUpdateUserMutation()
  const [isAddLoading, setIsAddLoading] = useState(false);

  // ============ Define actions <end> ==================== **QmQ

  const configs = useSelector(state => {
    return state.configState.configs.filter(conn => conn.mode == 'offline')
  })

   // Check the connection validation ** QmQ
  const validate = () => {
    if (!conValues.camera_name.length) {
      toast.error('Please input the video name')
      return false
    }
    if (!conValues.video_file) {
      toast.error('Please select the video file')
      return false
    }

    return true
  }

  /**
   * @author QmQ
   *
   */

  const handleFileOnChange = data => {
    setConValues({
      ...conValues,
      video_file: data.file
    })
  }

  /**
   * @author QmQ
   * ============================================================================================
   * ================= handle the stream part start ** QmQ =======================================
   */
  const onInsertSubmitHandler = async () => {
    if (validate()) {
      setIsAddLoading(true)
      // send the camere connection request to flask api ** QmQ
      // const formData = new FormData()
      // formData.append('file', conValues.video_file)
      const vid_ext = getFileExtension(conValues.video_file?.name)

      const payload = {
        tracking_mode: conValues.tracking_mode,
        filename: conValues.camera_name,
        file: conValues.video_file
      }

      const res = await uploadChunkedVideo(payload)
      try {
        if (conValues.tracking_mode == 'sot' && res.statusText == 'OK') {
          // After receive the success msg, create the configuration file and log **QmQ
          const _config = {
            camera_name: conValues.camera_name,
            video_path_track: res.data.data.vid_path,
            video_path_detect: 'none',
            video_path_correct: 'none',
            mode: 'offline',
            method: TRUST_METHOD.tracking,
            tracking_mode: conValues.tracking_mode,
            active: 0
          }
          await createConfig(_config)
          //  there is no need to show inserting and terminating log in the case of offline ** QmQ
          const _timestamp = new Date().getTime()
          const timestamp = Math.floor(new Date().getTime() / 1000)
          await createLog({
            content: `${conValues.camera_name} - Video Inserted`,
            camera_name: conValues.camera_name,
            mode: 'offline',
            tracking_mode: conValues.tracking_mode,
            _timestamp: _timestamp,
            timestamp: timestamp
          })
          toast.success(res.data?.message)
          setConValues({ camera_name: '', video_file: undefined, tracking_mode: 'sot' })
        } else if (conValues.tracking_mode == 'mot' && res.data?.status == 'success') {
          const _config = {
            camera_name: conValues.camera_name,
            video_path_track: res.data.data.vid_path,
            mode: 'offline',
            method: TRUST_METHOD.tracking,
            active: 1,
            tracking_mode: conValues.tracking_mode
          }
          await createConfig(_config)
          toast.success(res.data?.message)
          setConValues({ camera_name: '', video_file: undefined, tracking_mode: 'sot' })
        } else {
          toast.error('Something went wrong')
        }
      } catch (error) {
        // toast.error('Something went wrong!');
      }
    }
    setIsAddLoading(false);
    onClose();
  }


  return (
    <div>
      <CustomModalLayout
        width={'600px'}
        isOpen={isOpen}
        isLoading={isAddLoading}
        title={'Add New Video'}
        onHandleModalClose={onClose}
        //  onHandleModalOpen={onHandleModalOpen}
         onHandleSubmit={onInsertSubmitHandler}
      >
        <Box sx={style}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} sx={{ textAlign: 'left' }}>
              <FormControl fullWidth>
                <InputLabel id='tracking_mode_setting'> {'Tracking Mode'} </InputLabel>
                <Select
                  value={ conValues.tracking_mode }
                  onChange={ (e) => setConValues({
                    ...conValues,
                    tracking_mode: e.target.value
                  }) }
                  id='tracking_mode_setting'
                  labelId='tracking_mode_setting'
                  input={<OutlinedInput label='Tracking Mode' id='Tracking Mode' />}
                >
                  <MenuItem value={'sot'}> {'Track Specific Targets'} </MenuItem>
                  <MenuItem value={'mot'}> {'Detect and Track All Objects'} </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                type='text'
                label='Video Name'
                placeholder='Please input video Name'
                value={conValues.camera_name}
                onChange={e => {
                  setConValues({
                    ...conValues,
                    camera_name: e.target.value
                  })
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FileInput
                label='Input File'
                video_file={conValues.video_file}
                onChange={handleFileOnChange}
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModalLayout>
    </div>
  )
}
