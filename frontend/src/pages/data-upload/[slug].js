import CGroups from '../../../styles/pages/settings.module.scss'

// ** React Imports

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRouter } from "next/router"

import FileInput from 'src/views/commons/FileInput'
import InitializeVideoModal from 'src/views/modals/dynamicVideoInitModal'
import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'

import DatasetCard from 'src/views/settings/DatasetCard'

// import BasicModal from 'src/views/modals/CustomModalLayout'
import { connectSchema } from 'src/@core/schema'
import { useGetDataSetListMutation, useUploadDataMutation } from 'src/pages/redux/apis/baseApi'
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
  useTerminate_cameraMutation,
  useUploadVideoMutation,
  useInitialize_offline_videoMutation
} from 'src/pages/redux/apis/edfsdf'

export default function Page({params}) {
    const router = useRouter();
    const { slug } = router.query;
    const user = useSelector(state => {
        return state.userState.user
    })
    console.log("user: ", user)

    const projectList = useSelector((state) => {
        return state.baseState.projectList
    })
    console.log('projectList: ', projectList)
    const dataSetList = useSelector((state) => {
        return state.baseState.dataSetList
    })

    console.log('dataSetList: ', dataSetList)
    
      const [email, setEmail] = useState(localStorage.getItem('email'))
      const [projectName, setProjectName] = useState(projectList.find(obj => obj._id === slug).project_name)
      console.log(projectName)
      const [dataName, setDataName] = useState('')
      const [dataType, setDataType] = useState('')
      const [dataDriveId, setDataDriveId] = useState('')
      const [dataFile, setDataFile] = useState(undefined)

      const [ getDataSetList ] = useGetDataSetListMutation()
      const [ uploadData ] = useUploadDataMutation()
      
    
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
        if (!email) {
          toast.error('Please input the Email')
    
          return false
        }
        if (!projectName) {
          toast.error('Please select the Project Name')
    
          return false
        }
        if (!dataName) {
          toast.error('Please input the Data Name')
    
          return false
        }
        if (!dataType) {
          toast.error('Please select the Data Type')
    
          return false
        }
        if (!dataDriveId) {
          toast.error('Please select the Data Drive ID')
    
          return false
        }
        if (dataFile == undefined) {
          toast.error('Please Upload the File')
    
          return false
        }
    
        return true
      }
    
      useEffect(() => {
        const onGetDataSetList = async () => {
          if (user && user?.email) {
            const formData = new FormData()
            formData.append('email', user.email)
            formData.append('project_name', projectList.find(obj => obj._id === slug).project_name)
            try {
              await getDataSetList(formData)
            } catch (error) {
              toast.error('Something went wrong!');
            }
          }
        }
    
        onGetDataSetList()
      }, [user]);

      const handleFileOnChange = data => {
        setDataFile(data.file)
      }

      const onInsertSubmitHandler = async () => {
    
        if (validate()) {
          // send the camere connection request to flask api ** QmQ
          const formData = new FormData()
          formData.append('email', email)
          formData.append('project_name', projectName)
          formData.append('data_name', dataName)
          formData.append('data-type', dataType)
          formData.append('data_drive_id', dataDriveId)
          formData.append('file', dataFile)
    
    
          try {
                const res = await uploadData(formData)
                console.log(res)

            // if (conValues.tracking_mode == 'sot' && res.data?.status == 'success') {
            //   // After receive the success msg, create the configuration file and log **QmQ
            //   const _config = {
            //     camera_name: conValues.camera_name,
            //     video_path_track: res.data.data.vid_path,
            //     video_path_detect: 'none',
            //     video_path_correct: 'none',
            //     mode: 'offline',
            //     method: TRUST_METHOD.tracking,
            //     tracking_mode: conValues.tracking_mode,
            //     active: 0
            //   }
            //   const res_node = await createConfig(_config)
    
            //   //  there is no need to show inserting and terminating log in the case of offline ** QmQ
            //   const _timestamp = new Date().getTime()
            //   const timestamp = Math.floor(new Date().getTime() / 1000)
            //   await createLog({
            //     content: `${conValues.camera_name} - Video Inserted`,
            //     camera_name: conValues.camera_name,
            //     mode: 'offline',
            //     tracking_mode: conValues.tracking_mode,
            //     _timestamp: _timestamp,
            //     timestamp: timestamp
            //   })
            //   toast.success(res.data?.message)
            //   setConValues({ camera_name: '', video_file: undefined, tracking_mode: 'sot' })
            // } else if (conValues.tracking_mode == 'mot' && res.data?.status == 'success') {
            //   const _config = {
            //     camera_name: conValues.camera_name,
            //     video_path_track: res.data.data.vid_path,
            //     mode: 'offline',
            //     method: TRUST_METHOD.tracking,
            //     active: 1,
            //     tracking_mode: conValues.tracking_mode
            //   }
            //   const res_node = await createConfig(_config)
            //   toast.success(res.data?.message)
            //   setConValues({ camera_name: '', video_file: undefined, tracking_mode: 'sot' })
            // } else {
            //   toast.error('Something went wrong')
            // }
          } catch (error) {
            toast.error('Something went wrong!');
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
            <Grid container spacing={6} sx={{marginBottom:'15px'}}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type='text'
                  label='Email'
                  placeholder='Please input Email'
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    <TextField
                        fullWidth
                        type='text'
                        label='projectName'
                        placeholder='Please input project Name'
                        value={projectName}
                        onChange={e => {
                        setProjectName( e.target.value )
                        }}
                    />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type='text'
                  label='Data Name'
                  placeholder='Please input Data Name'
                  value={dataName}
                  onChange={e => {
                    setDataName(e.target.value)
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='dataType'> {'Data Type'} </InputLabel>
                  <Select
                    value={dataType}
                    onChange={e =>
                      setDataType( e.target.value )
                    }
                    id='dataType'
                    labelId='dataType'
                    input={<OutlinedInput label='Data Type' id='Data Type' />}
                  >
                    <MenuItem value={'Labeled'}> {'Labeled'} </MenuItem>
                    <MenuItem value={'Unlabeled'}> {'Unlabeled'} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    <TextField
                        fullWidth
                        type='text'
                        label='Data Drive Id'
                        placeholder='Please input Data Drive Id'
                        value={dataDriveId}
                        onChange={e => {
                            setDataDriveId( e.target.value )
                        }}
                    />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                {
                    dataDriveId === '' ? (<FileInput label='Input Data File' video_file={dataFile} onChange={handleFileOnChange} />) : ''
                }
                
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
        </Box>
      )
}