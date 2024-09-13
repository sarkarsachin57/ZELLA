//  ** import styles classes
import CGroups from '../../styles/pages/settings.module.scss'

// ** React Imports

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MovieFilterIcon from '@mui/icons-material/MovieFilter'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import OutlinedInput from '@mui/material/OutlinedInput'
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import FileInput from 'src/views/commons/FileInput'
import InitializeVideoModal from 'src/views/modals/dynamicVideoInitModal'
import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'

import DatasetCard from 'src/views/settings/DatasetCard'

// import BasicModal from 'src/views/modals/CustomModalLayout'
import { connectSchema } from 'src/@core/schema'
import {
  configApi,
  useCreateConfigMutation,
  useGetAllConfigsQuery,
  useUpdateConfigMutation,
  useDeleteConfigMutation
} from 'src/pages/redux/apis/configApi'
import { useCreateLogMutation } from 'src/pages/redux/apis/logApi'

import { useUpdateUserMutation } from 'src/pages/redux/apis/userApi'

import { handleErrorResponse, trimedStr } from 'src/helpers/utils'
import {
  useConnect_cameraMutation,
  useShow_framesMutation,
  useShow_messagesMutation,
  useMessagesMutation,
  useTerminate_cameraMutation,
  useShow_threadsMutation,
  useUploadVideoMutation,
  useIndexQuery,
  useInitialize_cameraMutation,
  useInitialize_offline_videoMutation
} from 'src/pages/redux/apis/streamApi'

import { getFileExtension } from 'src/helpers/utils'
import { TRUST_METHOD, TRUST_MODE } from 'src/constants'

const DataUpload = () => {
  // ============ Define the states <start> ============= **QmQ
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

  // ============ Define actions <end> ==================== **QmQ

  const configs = useSelector(state => {
    return state.configState.configs.filter(conn => conn.mode == 'offline')
  })

  // ============= Define the actions related with modal open and close <start> ======== ** QmQ

  const handleInitModalOpen = () => {
    setInitModalSwitch(true)
  }

  const handleInitModalClose = () => {
    setInitModalSwitch(false)
  }

  // ============= Define the actions related with modal open and close <end> ======== ** QmQ

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

    // const isExist = configs.find((conn)=> {
    //   const substr = trimedStr(conn.camera_name, 8)
    //   return (substr == conValues.camera_name && conValues.tracking_mode == conn.tracking_mode)
    // }
    // )
    // if( isExist ) {
    //   toast.error("Please use another video name.")
    //   return false;
    // }

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
      // send the camere connection request to flask api ** QmQ
      const formData = new FormData()
      formData.append('file', conValues.video_file)
      const vid_ext = getFileExtension(conValues.video_file?.name)

      const payload = {
        tracking_mode: conValues.tracking_mode,
        vid_ext: vid_ext,
        vid_name: conValues.camera_name,
        formData: formData
      }

      const res = await uploadVideo(payload)

      try {
        if (conValues.tracking_mode == 'sot' && res.data?.status == 'success') {
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
          const res_node = await createConfig(_config)

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
          const res_node = await createConfig(_config)
          toast.success(res.data?.message)
          setConValues({ camera_name: '', video_file: undefined, tracking_mode: 'sot' })
        } else {
          toast.error('Something went wrong')
        }
      } catch (error) {
        // toast.error('Something went wrong!');
      }
    }
  }

  /**
   * @autor QmQ
   * @function handles to open the initialization modal
   */
  const onHandleInitialize = () => {
    if (initEl == '') {
      toast.error('Please select the video to initialize.')
    } else {
      const selected_camera = configs.find(el => el._id == initEl)
      if (selected_camera) {
        handleInitModalOpen()
      } else {
        toast.error('Please select another video. Something went wrong.')
      }
    }
  }

  /**
   * @author QmQ
   * @function sends the tracker info
   * @param {object} data - {hase the tracker info : width, height, postion}
   */
  const handleInitSubmit = async data => {
    const sel_camera = configs.find(el => el._id == initEl)
    const res = await initialize_offline_video({ initEl: sel_camera, trackerInfo: data })

    try {
      if (res.data?.status == 'success') {
        // after receive the 'success' response, update the configuration file and print the log **QmQ
        await updateConfig({ id: initEl, update: { status: 1, active: 1, video_path: res.data.data.vid_path } })

        // await createLog({content: res.data.message})
        toast.success(res.data.message)
        setInitEl('')
      } else {
        toast.error('Something went wrong.')
      }
      handleInitModalClose()
    } catch (error) {
      toast.error('Something went wrong.')
    }
  }

  /**
   * @author QmQ
   * @function sends the termination request to flask api and delete the corresponding configuration.
   */

  return (
    <Box className={CGroups.settings_layout}>
      {/* video insertion **QmQ */}
      <SettingPanelLayout
        btnTitle={'Start'}
        btnAction={onInsertSubmitHandler}
        schema={connectSchema}
        headerIcon={<CloudUploadIcon />}
        isLoading={isLoading}
        headerTitle='Data Upload'
        select_tracking_mode={true}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <FileInput label='Input File' video_file={conValues.video_file} onChange={handleFileOnChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type='text'
              label='Label'
              placeholder='Please input Label'
              value={conValues.camera_name}
              onChange={e => {
                setConValues({
                  ...conValues,
                  camera_name: e.target.value
                })
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type='text'
              label='Description'
              placeholder='Please input description'
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
      </SettingPanelLayout>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={3}>
          <DatasetCard />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DatasetCard />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DatasetCard />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DatasetCard />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DatasetCard />
        </Grid>
      </Grid>

      {/* show the modal to select tracker to be initialized **QmQ */}
      <InitializeVideoModal
        width={800}
        isOpen={isInitModalOpen}
        isLoading={init_camera_loading}
        onHandleSubmit={handleInitSubmit}
        onHandleModalClose={handleInitModalClose}
        camera_info={configs.find(el => el._id == initEl)}
      />
    </Box>
  )
}

export default DataUpload
