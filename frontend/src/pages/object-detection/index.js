//  ** import styles classes
import CGroups from '../../../styles/pages/settings.module.scss'

// ** React Imports

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import InitializeVideoModal from 'src/views/modals/dynamicVideoInitModal'
import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'
import CardBox from 'src/views/settings/CardBox'
import ModelTrainingTable from 'src/@core/components/table/model-training-table'

// import BasicModal from 'src/views/modals/CustomModalLayout'
import { connectSchema } from 'src/@core/schema'
import {
  useTrainImageClassificationModelMutation,
  useGetRunLogsMutation,
  useGetTrainingViewDetailMutation,
  useGetDataSetListMutation
} from 'src/pages/redux/apis/baseApi'

const ObjectDetection = () => {
  const yolo_dict_list = ['YOLOv3','YOLOv5','YOLOv8','YOLOv9','YOLOv10','YOLOv11','RT-DETR']
  const yolo_model_dict = {
    'YOLOv3': ['yolov3', 'yolov3-ultralytics', 'yolov3u'],
    'YOLOv5': ['yolov5nu', 'yolov5su', 'yolov5mu', 'yolov5lu', 'yolov5xu', 
               'yolov5n6u', 'yolov5s6u', 'yolov5m6u', 'yolov5l6u', 'yolov5x6u'],
    'YOLOv8': ['yolov8n', 'yolov8s', 'yolov8m', 'yolov8l', 'yolov8x'],
    'YOLOv9': ['yolov9t', 'yolov9s', 'yolov9m', 'yolov9c', 'yolov9e'],
    'YOLOv10': ['yolov10n', 'yolov10s', 'yolov10m', 'yolov10b', 'yolov10l', 'yolov10x'],
    'YOLOv11': ['yolov11n', 'yolov11s', 'yolov11m', 'yolov11l', 'yolov11x'],
    'RT-DETR': ['rtdetr-l', 'rtdetr-x']
}
  const training_mode_list = ['scratch', 'finetune', 'transfer']
  const headCells = [
    {
      id: 'no',
      numeric: false,
      disablePadding: true,
      label: 'No'
    },
    {
      id: 'train_data_name',
      numeric: true,
      disablePadding: false,
      label: 'Train Data Name',
      minWidth: 150
    },
    {
      id: 'val_data_name',
      numeric: true,
      disablePadding: false,
      label: 'Val Data Name',
      minWidth: 150
    },
    {
        id: 'run_name',
        numeric: true,
        disablePadding: false,
        label: 'Run Name'
    },
    {
      id: 'model_family',
      numeric: true,
      disablePadding: false,
      label: 'Model Family'
    },
    {
      id: 'model_name',
      numeric: true,
      disablePadding: false,
      label: 'Model Name'
    },
    {
        id: 'training_mode',
        numeric: true,
        disablePadding: false,
        label: 'Training Mode'
      },
    {
      id: 'num_epochs',
      numeric: true,
      disablePadding: false,
      label: 'Num epochs'
    },
    {
      id: 'batch_size',
      numeric: true,
      disablePadding: false,
      label: 'Batch Size'
    },
    {
      id: 'learning_rate',
      numeric: true,
      disablePadding: false,
      label: 'Learning Rate'
    },
    {
      id: 'start_time',
      numeric: true,
      disablePadding: false,
      label: 'Training Start Time',
      minWidth: 170
    },
    {
      id: 'training_status',
      numeric: true,
      disablePadding: false,
      label: 'Training Status'
    },
    {
      id: 'detail',
      numeric: true,
      disablePadding: false,
      label: 'Detail'
    },
  ]
  // ============ Define the states <start> ============= **QmQ
  const user = useSelector(state => {
    return state.userState.user
  })
  console.log('user=======> ', user)
  const project_list = useSelector((state) => {
    return state.baseState.projectList
  })
  console.log('project_list=======> ', project_list)
  const latest_project_url = useSelector((state) => {
    return state.baseState.latestProjectUrl
  })

  const [email, setEmail] = useState(localStorage.getItem('email'))
  const [project_name, setProjectList] = useState(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_name: null)
  const [train_data_name, setTrainDataName] = useState('')
  const [val_data_name, setValDataName] = useState('')
  const [run_name, setRunName] = useState('')
  const [model_family, setModelFamily] = useState('YOLOv8')
  const [model_name, setModelName] = useState('yolov8s')
  const [training_mode, setTrainingMode] = useState('')
  const [num_epochs, setNumEpochs] = useState('10')
  const [batch_size, setBatchSize] = useState('32')
  const [learning_rate, setLearningRate] = useState('0.01')
  const [dataset_list, setDatasetList] = useState(useSelector(state => state.baseState.dataSetList))
  const [isLoading, setIsLoading] = useState(false)
  const [isTrainModalOpen, setTrainModalSwitch] = useState(false)
  const [training_detail_infor, setTrainingDetailInfor] = useState(undefined)

  const [run_logs_list, setRunLosgList] = useState(useSelector(state => state.baseState.run_logs_list))
  console.log('run_logs_list: ', run_logs_list)
  console.log('project_name: ', project_name)



  const [ TrainImageClassificationModel ] = useTrainImageClassificationModelMutation()
  const [ getDataSetList ] = useGetDataSetListMutation()
  const [ getRunLogs ] = useGetRunLogsMutation()
  const [ getTrainingViewDetail ] = useGetTrainingViewDetailMutation()


  useEffect(() => {
    const onGetRunLogs = async () => {
      if (user && user?.email) {
        const formData = new FormData()
        formData.append('email', user.email)
        console.log('email: ',user.email)
        formData.append('project_name', project_name)
        console.log('project_name: ',project_name)
        try {
          const data =  await getRunLogs(formData)
          setRunLosgList(data.data.run_history)
          console.log('data: ',data.data)
        } catch (error) {
          toast.error('Something went wrong!');
        }
      }
    }
    const onGetDataSetList = async () => {
      if (user && user?.email) {
        const formData = new FormData()
        formData.append('email', user.email)
        formData.append('project_name', project_name)
        try {
          const data = await getDataSetList(formData)
          console.log('datalist: ', data)
          setDatasetList(data.data.dataset_list)
        } catch (error) {
          toast.error('Something went wrong!');
        }
      }
    }

    onGetRunLogs()
    onGetDataSetList()
  }, [project_name]);
  useEffect(() => {
    setProjectList(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_name: null)
  }, [project_list]);

  // Check the connection validation ** QmQ
  const validate = () => {
    if (!train_data_name) {
      toast.error('Please select the Train data name')

      return false
    }
    if (!val_data_name) {
      toast.error('Please select the Val data name')

      return false
    }
    if (!run_name) {
      toast.error('Please input the run name')

      return false
    }
    if (!model_family) {
      toast.error('Please select the Model Family')

      return false
    }
    if (!model_name) {
      toast.error('Please select the Model Name')

      return false
    }
    if (!training_mode) {
      toast.error('Please select the training mode')

      return false
    }
    return true
  }

  const handleTrainDetailModalOpen = () => {
    setTrainModalSwitch(true);
  }

  const handleTrainDetailModalClose = () => {
    setTrainModalSwitch(false);
  }


  const onInsertSubmitHandler = async () => {
    if (validate()) {
      // send the camere connection request to flask api ** QmQ
      const formData = new FormData()
      formData.append('email', email)
      formData.append('project_name', project_name)
      formData.append('train_data_name', train_data_name)
      formData.append('val_data_name', val_data_name)
      formData.append('run_name', run_name)
      formData.append('model_family', model_family)
      formData.append('model_name', model_name)
      formData.append('training_mode', training_mode)
      formData.append('num_epochs', num_epochs)
      formData.append('batch_size', batch_size)
      formData.append('learning_rate', learning_rate)
      setIsLoading(true)

      try {
        const res = await TrainImageClassificationModel(formData)
        setIsLoading(false)
        console.log(res)
        if(res.data.status === "fail"){
          toast.error(res.data.message)
        }
        else{
          toast.success(res.data.message)
          setDataName('')
          setRunName('')
          setArchName('')
          setTrainingMode('')
          setNumEpochs('10')
          setBatchSize('32')
          setLearningRate('0.01')
        }
      } catch (error) {
        toast.error('Something went wrong!');
      }
    }
  }
  const viewDetailHandler = async (data) => {

    const formData = new FormData()
    formData.append('email', email)
    formData.append('project_name', project_name)
    formData.append('run_name', data)

    try {
      const res = await getTrainingViewDetail(formData)
      console.log(res)
      setTrainingDetailInfor(res.data)
      console.log('training_detail_infor: ', training_detail_infor)

      if(res.data.status === "fail"){
        toast.error(res.data.message)
      }
      handleTrainDetailModalOpen()
      
    } catch (error) {
      toast.error('Something went wrong!');
    }
  }


  return (
    <Box className={CGroups.settings_layout}>
      <SettingPanelLayout
        btnTitle={'Start'}
        btnAction={onInsertSubmitHandler}
        schema={connectSchema}
        headerIcon={<ManageSearchIcon />}
        isLoading={isLoading}
        headerTitle='Object Detection'
        select_tracking_mode={true}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='train_data_name'> {'Select Train Data Name'} </InputLabel>
              <Select
                value={train_data_name}
                onChange={e => setTrainDataName(e.target.value)}
                id='train_data_name'
                labelId='train_data_name'
                input={<OutlinedInput label='Train Data Name' id='data_name' />}
              >
                {dataset_list.map(item =>{
                  return (<MenuItem value={item.data_name}> {item.data_name} </MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='val_data_name'> {'Select Val Data Name'} </InputLabel>
              <Select
                value={val_data_name}
                onChange={e => setValDataName(e.target.value)}
                id='val_data_name'
                labelId='val_data_name'
                input={<OutlinedInput label='Val Data Name' id='data_name' />}
              >
                {dataset_list.map(item =>{
                  return (<MenuItem value={item.data_name}> {item.data_name} </MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='model_family'> {'Model Family'} </InputLabel>
              <Select
                value={model_family}
                onChange={e => setModelFamily(e.target.value)}
                id='model_family'
                labelId='model_family'
                input={<OutlinedInput label='Model Family' id='Model Family' />}
              >
                {yolo_dict_list.map(item =>{
                  return (<MenuItem value={item}> {item} </MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='model_name'> {'Model Name'} </InputLabel>
              <Select
                value={model_name}
                onChange={e => setModelName(e.target.value)}
                id='model_name'
                labelId='model_name'
                input={<OutlinedInput label='Model Name' id='Model Name' />}
              >
                {model_family === ''? '': yolo_model_dict[model_family].map(item =>{
                  return (<MenuItem value={item}> {item} </MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{marginTop:'5px'}} >
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type='text'
              label='Run Name'
              placeholder='Please input Run Name'
              value={run_name}
              onChange={e => setRunName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='training_mode'> {'Training Mode'} </InputLabel>
              <Select
                value={training_mode}
                onChange={e => setTrainingMode(e.target.value)}
                id='training_mode'
                labelId='training_mode'
                input={<OutlinedInput label='Training Mode' id='Training Mode' />}
              >
                {training_mode_list.map(item =>{
                  return (<MenuItem value={item}> {item} </MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              type='text'
              label='Num Epochs'
              placeholder='Please input Num Epochs'
              value={num_epochs}
              onChange={e => setNumEpochs(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              type='text'
              label='Batch Size'
              placeholder='Please input Batch Size'
              value={batch_size}
              onChange={e => setBatchSize(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              type='text'
              label='Learning Rate'
              placeholder='Please input Learning Rate'
              value={learning_rate}
              onChange={e => setLearningRate(e.target.value)}
            />
          </Grid>
        </Grid>

      </SettingPanelLayout>

      <CardBox>
        <ModelTrainingTable
          headCells = {headCells}
          rows = {run_logs_list}
          viewDetailHandler = {viewDetailHandler}
        />
      </CardBox>
      <InitializeVideoModal
        width={1200}
        isOpen={isTrainModalOpen}
        onHandleModalClose = {handleTrainDetailModalClose}
        data = {training_detail_infor}
      />

    </Box>
  )
}

export default ObjectDetection
