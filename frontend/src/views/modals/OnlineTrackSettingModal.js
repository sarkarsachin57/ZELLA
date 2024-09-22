import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material'
import CustomModalLayout from './CustomModalLayout'
import {
  configApi,
  useCreateConfigMutation,
  useUpdateConfigMutation,
  useDeleteConfigMutation
} from 'src/pages/redux/apis/configApi'
import { useCreateLogMutation } from 'src/pages/redux/apis/logApi'

import { useUpdateUserMutation } from 'src/pages/redux/apis/userApi'

import { trimedStr } from 'src/helpers/utils'
import {
  useConnect_cameraMutation,
  useTerminate_cameraMutation,
  useUploadVideoMutation,
  useInitialize_offline_videoMutation
} from 'src/pages/redux/apis/edfsdf'

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
  borderRadius: '10px',
  marginBottom: '20px'
})

export default function SearchModal(props) {
  const { isOpen, onClose } = props

  const [isInitModalOpen, setInitModalSwitch] = useState(false)
  const [initEl, setInitEl] = useState('')
  const [termEl, setTermEl] = useState('')
  const [isEmailSMSModalOpen, setEmailSMSModalSwitch] = useState(false)
  const [isAudio, setAudio] = useState(user?.audio ? user.audio : false)
  const [isVisual, setVisual] = useState(user?.visual ? user.visual : false)
  const [isEmail_SMS, setEmailSMS] = useState(user?.email_sms ? user.email_sms : false)

  const [conValues, setConValues] = useState({
    camera_name: '',
    video_path: '',
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
  const [createLog] = useCreateLogMutation()

  const [updateUser, { isLoading: update_user_isLoading }] = useUpdateUserMutation()

  // ============ Define actions <end> ==================== **QmQ

  const configs = useSelector(state => {
    return state.configState.configs.filter(conn => conn.mode == 'offline')
  })

  // Check the connection validation ** QmQ
  const validate = () => {
    if (!conValues.camera_name.length || !conValues.video_path.length) {
      toast.error('Please input the Camera Name and URL', {
        position: 'top-right'
      })

      return false
    }

    const isExist = configs.find((conn)=> {
      const substr = trimedStr(conn.camera_name, 8)

      return substr == conValues.camera_name
    }
    )
    if(isExist) {
      toast.error("Please use another camera name.")

      return false;
    }

    return true
  }
  /**
   * @author QmQ
   *
   */

  const [connect_camera] = useConnect_cameraMutation();

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

  const onConnectSubmitHandler = async () => {
    if (validate()) {
      const res = await connect_camera({
        camera_name: conValues.camera_name,
        tracking_mode: conValues.tracking_mode,
        video_path: encodeURIComponent(conValues.video_path)
      });

      try {
        if (res.data?.status == "success") {
          // After receive the success msg, create the configuration file and log **QmQ
          const res_node = await createConfig({
            camera_name: conValues.camera_name,
            video_path: conValues.video_path,
            tracking_mode: conValues.tracking_mode,
            method: TRUST_METHOD.tracking,
            mode: "online",
            active: 0,
          });
          await createLog({
            content: `${conValues.camera_name} - Camera Connected`,
            camera_name: conValues.camera_name,
            mode: 'online',
            tracking_mode: conValues.tracking_mode,
            _timestamp: new Date().getTime(),
            timestamp: Math.floor(new Date().getTime()/1000)

          })
          toast.success(`${conValues.camera_name} - Camera Connected`)
          setConValues({ camera_name: '', video_path: '', tracking_mode: 'sot'});
        } else {
          toast.error('Connection failed!');
        }
      } catch (error) {
        // toast.error('Something went wrong!');
      }
    }
    onClose();
  }


  /**
   * @autor QmQ
   * @function handles to open the initialization modal
   */
  return (
    <div>
      <CustomModalLayout
        width={'600px'}
        isOpen={isOpen}
        title={'Connect New Camera'}
        onHandleModalClose={onClose}
        btnName="Connect"
        onHandleSubmit={onConnectSubmitHandler}
      >
        <Box sx={style}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} sx={{ textAlign: 'left' }}>
              <FormControl fullWidth>
                <InputLabel id='tracking_mode_setting'> {'Tracking Mode'} </InputLabel>
                <Select
                  value={conValues.tracking_mode}
                  onChange={e =>
                    setConValues({
                      ...conValues,
                      tracking_mode: e.target.value
                    })
                  }
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
                type='url'
                label='URL'
                placeholder='Please input the URL'
                value={conValues.video_path}
                onChange={e => {
                  setConValues({
                    ...conValues,
                    video_path: e.target.value
                  })
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                type='text'
                label='Camera Name'
                placeholder='Please input Camera Name'
                value={conValues.camera_name}
                onChange={e => {
                  setConValues({
                    ...conValues,
                    camera_name: e.target.value
                  })
                }}
              />
            </Grid>

          </Grid>
        </Box>
      </CustomModalLayout>
    </div>
  )
}
