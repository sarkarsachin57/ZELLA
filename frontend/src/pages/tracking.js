//  ** import styles classes
import CGroups from '../../styles/pages/live-view.module.scss';
import { styled } from '@mui/material/styles'

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import Button from '@mui/material/Button'

// ** Components Imports
import CardMainCamera from 'src/views/live-view/CardMainCamera';
import OnlineTrackSettingModal from '../views/modals/OnlineTrackSettingModal'
import InitializeModal from 'src/views/modals/dynamicInitModal';
import { CustomButton } from 'src/@core/components/button/CustomButton';

// ** import toast
import {toast} from 'react-toastify'
import { TRUST_METHOD, TRUST_MODE } from 'src/constants';
import {
  configApi,
  useCreateConfigMutation,
  useGetAllConfigsQuery,
  useUpdateConfigMutation,
  useDeleteConfigMutation
} from './redux/apis/configApi'

import { trimedStr  } from 'src/helpers/utils';
import { useCreateLogMutation } from './redux/apis/logApi'
import { useUpdateUserMutation } from './redux/apis/userApi'

import {
  useInitialize_cameraMutation,
  useTerminate_cameraMutation,
} from './redux/apis/edfsdf'


// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

/**
 * @author QmQ
 * @file shows the main page-live view page
 * @returns
 */

const LiveView = () => {

  // ** states
  // const configs = useSelector(state => state.configState.configs);
  const configs = useSelector((state) => {
    return state.configState.configs.filter((conn)=>conn.mode === "online")
  });
  const user = useSelector(state => state.userState.user);
  const [activeCam, setActiveCam] = useState(configs[0]);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isInitModalOpen, setInitModalSwitch] = useState(false)
  const [initEl, setInitEl] = useState('')
  const [termEl, setTermEl] = useState('')
  const [initCameraInfo, setInitCameraInfo] = useState({});

  const [initialize_camera, {isSuccess: init_success, isLoading: init_camera_loading, data: init_data}]= useInitialize_cameraMutation();
  const [updateConfig, { isLoading: update_isLoading, error: init_error, isSuccess: init_isSuccess }] = useUpdateConfigMutation()
  const [deleteConfig ] = useDeleteConfigMutation();
  const [ createLog ] = useCreateLogMutation();

  const [terminate_camera] = useTerminate_cameraMutation();
  const handleInitModalOpen = (id) => {
    const updateData = configs.find(el => el._id == id);
    setInitCameraInfo(updateData);
    setInitEl(id)
    setInitModalSwitch(true)
  }
  const handleInitModalClose = () => {
    setInitModalSwitch(false);
  }
  const handleInitSubmit = async (data)=>{

    const sel_camera = configs.find( el => el._id == initEl)
    const res = await initialize_camera({initEl: sel_camera, trackerInfo: data});
    try {
      if(res.data?.status=='success'){
        // after receive the 'success' response, update the configuration file and print the log **QmQ
        await updateConfig({id: initEl, update: {status: 1}})
        setInitEl('')
      } else {
        toast.error('Something went wrong.')
      }
      handleInitModalClose();
    } catch (error) {
      toast.error('Something went wrong.')
    }
  }
  const handleActiveChange = (el) =>{
    if(el._id == activeCam?._id) return;
    setActiveCam(el);
  }

  const handleSettingModalOpen = () => {
    setIsSettingModalOpen(true);
  }

  const onHandleTerminate = async (id) => {
      const sel_camera = configs.find(el => el._id == id)

      const res = await terminate_camera(sel_camera)

      // after receive the response from flask, delete the configuration from DB **QmQ
      await deleteConfig(id);
      const _log = {
        content: `${trimedStr(sel_camera.camera_name, 8)} - Camera Terminated`,
        camera_name: sel_camera.camera_name,
        mode: sel_camera.mode,
        tracking_mode: sel_camera.tracking_mode,
        _timestamp: new Date().getTime(),
        timestamp: Math.floor(new Date().getTime()/1000)

      }
      if(res?.data?.status == 'success') await createLog(_log)
      if(res?.data?.status == 'fail') await createLog(_log)
      toast.success(`${trimedStr(sel_camera.camera_name, 8)} - Camera Terminated`);
      setActiveCam({})
  }

  const onClose = () => {
    setIsSettingModalOpen(false);
  }

  useEffect(()=>{
    if (!activeCam) {
      setActiveCam(configs[0])
    }
    configs.map((el)=>{
      if(el._id == activeCam?._id) {
        setActiveCam(el)
      }
    })
  }, [configs])

  return (
    <Box sx={{ textAlign: 'center', margin: 'auto', height: '100%'}}>
      {
        isSettingModalOpen &&
        <OnlineTrackSettingModal
          isOpen={isSettingModalOpen}
          onClose={onClose}
        />
      }
      { configs.length == 0 ?
      <div>
        <Box className='content-center' sx={{border: '1px solid #804BDF'}}>
          <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <BoxWrapper>
              <Typography variant='h1'>{`No Sensor`}</Typography>
              <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
                Connected ⚠️
              </Typography>
              <Typography variant='body2'>Please connect the camera from settings.</Typography>
            </BoxWrapper>
          </Box>
        </Box>
        <CustomButton
          variant='contained'
          sx={{ mt: 1 }}
          disableElevation
          onClick={handleSettingModalOpen}
          loading={false}
        >
            {`Connect Camera`}
        </CustomButton>
      </div>
        :
        <div>

          <Grid sm={12} sx={{textAlign:"end"}}>
            <CustomButton
              variant='contained'
              sx={{ mt: 1 }}
              disableElevation
              onClick={handleSettingModalOpen}
              loading={false}
            >
              Connecte Camera
            </CustomButton>
          </Grid>
          <Grid container spacing={6}
            sx={{ textAlign: 'center', margin: 'auto', height: '100%'}}
          >
            <Grid item xs={12} md = {8} sm = {12} sx={{borderRadius: '3%', margin: 'auto'}}>
                {
                  activeCam &&
                  <CardMainCamera
                    handleActiveChange={f => f}
                    handleRemoveCamera={() => onHandleTerminate(activeCam._id)}
                    cam_info = {activeCam}
                    isActive = {true}
                    user = {user}
                    onInitModalOpen={() => handleInitModalOpen(activeCam._id)}
                  />
                }
            </Grid>
            <Grid item xs={12} md = {4} sm = {12} sx={{margin: 'auto', borderRadius: '3%'}} >
                <List
                      sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        height: '100%',
                        maxHeight: '80vh',
                        '& ul': { padding: 0 },
                      }}
                >
                    { configs &&
                        configs.map(( el, idx) => {
                            return <CardMainCamera
                              handleActiveChange = {handleActiveChange}
                              handleRemoveCamera={() => onHandleTerminate(el._id)}
                              cam_info = {el}
                              height={"50%"}
                              key={el._id}
                              isActive = {activeCam?._id == el._id}
                              onInitModalOpen={() => handleInitModalOpen(el._id)}
                            />
                        })
                    }
                </List>
            </Grid>
          </Grid>
        </div>
      }

      <InitializeModal
        width = {800}
        isOpen={isInitModalOpen}
        isLoading={init_camera_loading}
        onHandleSubmit={handleInitSubmit}
        onHandleModalClose={handleInitModalClose}
        camera_info = {initCameraInfo}
      />
    </Box>
  )
}

export default LiveView
