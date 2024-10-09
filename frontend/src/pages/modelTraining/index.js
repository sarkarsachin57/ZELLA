//  ** import styles classes
import CGroups from '../../../styles/pages/settings.module.scss'

// ** React Imports

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MovieFilterIcon from '@mui/icons-material/MovieFilter'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import OutlinedInput from '@mui/material/OutlinedInput'
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TablePagination from '@mui/material/TablePagination'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import FileInput from 'src/views/commons/FileInput'
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
  useGetDataSetListMutation,
  useTrainObjectDetectionModelMutation
} from 'src/pages/redux/apis/baseApi'

const ModelTraining = () => {
  const model_family_list = {
    'Image Classification': ['ResNet','VGGNet','DenseNet','MobileNet','EfficientNet','ShuffleNet','MNasNet','SqueezeNet','Others'],
    'Object Detection': ['YOLOv3','YOLOv5','YOLOv8','YOLOv9','YOLOv10','YOLOv11','RT-DETR']
  }
  const model_name_list = {
    'Image Classification': {
      'ResNet': ['resnet18', 'resnet34', 'resnet50', 'resnet101', 'resnet152'],
      'VGGNet': ['vgg11', 'vgg13', 'vgg16', 'vgg19'],
      'DenseNet': ['densenet121', 'densenet169', 'densenet201'],
      'MobileNet': ['mobilenet_v2', 'mobilenet_v3_large', 'mobilenet_v3_small'],
      'EfficientNet': ['efficientnet_b0', 'efficientnet_b1', 'efficientnet_b2', 'efficientnet_b3', 
                       'efficientnet_b4', 'efficientnet_b5', 'efficientnet_b6', 'efficientnet_b7'],
      'ShuffleNet': ['shufflenet_v2_x0_5', 'shufflenet_v2_x1_0'],
      'MNasNet': ['mnasnet0_5', 'mnasnet0_75', 'mnasnet1_0', 'mnasnet1_3'],
      'SqueezeNet': ['squeezenet1_0', 'squeezenet1_1'],
      'Others': ['googlenet', 'alexnet']
    },
    'Object Detection': {
      'YOLOv3': ['yolov3', 'yolov3-ultralytics', 'yolov3u'],
      'YOLOv5': ['yolov5nu', 'yolov5su', 'yolov5mu', 'yolov5lu', 'yolov5xu', 
                 'yolov5n6u', 'yolov5s6u', 'yolov5m6u', 'yolov5l6u', 'yolov5x6u'],
      'YOLOv8': ['yolov8n', 'yolov8s', 'yolov8m', 'yolov8l', 'yolov8x'],
      'YOLOv9': ['yolov9t', 'yolov9s', 'yolov9m', 'yolov9c', 'yolov9e'],
      'YOLOv10': ['yolov10n', 'yolov10s', 'yolov10m', 'yolov10b', 'yolov10l', 'yolov10x'],
      'YOLOv11': ['yolov11n', 'yolov11s', 'yolov11m', 'yolov11l', 'yolov11x'],
      'RT-DETR': ['rtdetr-l', 'rtdetr-x']
    }
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
      label: 'Training Status',
      minWidth: 190
    },
    {
      id: 'detail',
      numeric: true,
      disablePadding: false,
      label: 'Detail'
    },
    {
      id: 'download',
      numeric: true,
      disablePadding: false,
      label: 'Download'
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
  const [project_type, setProjectType] = useState(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_type: null)
  const [train_data_name, setTrainDataName] = useState('')
  const [val_data_name, setValDataName] = useState('')
  const [run_name, setRunName] = useState('')
  const [model_family, setModelFamily] = useState('')
  const [model_name, setModelName] = useState('')
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



  const [ trainImageClassificationModel ] = useTrainImageClassificationModelMutation()
  const [ getDataSetList ] = useGetDataSetListMutation()
  const [ getRunLogs ] = useGetRunLogsMutation()
  const [ getTrainingViewDetail ] = useGetTrainingViewDetailMutation()
  const [ trainObjectDetectionModel ] = useTrainObjectDetectionModelMutation()

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
  useEffect(() => {
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
      const res = {}
      if( project_type === 'Image Classification'){
        res = await trainImageClassificationModel(formData)
      }
      else{
        res = await trainObjectDetectionModel(formData)
      }
      setIsLoading(false)
      console.log(res.data)
      if(res.data.status === "fail"){
        toast.error(res.data.message)
      }
      else{
        toast.success(res.data.message)
        setTrainDataName('')
        setValDataName('')
        setRunName('')
        setModelFamily('')
        setModelName('')
        setTrainingMode('')
        setNumEpochs('10')
        setBatchSize('32')
        setLearningRate('0.01')
        onGetRunLogs()
      }
    }
  }
  const viewDetailHandler = async (data) => {

    const formData = new FormData()
    formData.append('email', email)
    formData.append('project_name', project_name)
    formData.append('run_name', data)

    const res = await getTrainingViewDetail(formData)
    console.log(res)
    setTrainingDetailInfor(res.data)
    console.log('training_detail_infor: ', training_detail_infor)

    if(res.data.status === "fail"){
      toast.error(res.data.message)
    }
    handleTrainDetailModalOpen()
  }


  return (
    <Box className={CGroups.settings_layout}>
      <SettingPanelLayout
        btnTitle={'Start'}
        btnAction={onInsertSubmitHandler}
        schema={connectSchema}
        headerIcon={<PlayArrowIcon />}
        isLoading={isLoading}
        headerTitle='Model Training'
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
                {
                  project_type && model_family_list[project_type] ? model_family_list[project_type].map(item =>{
                    return (<MenuItem value={item}> {item} </MenuItem>)
                  }) : null
                }
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
                {
                  project_type && model_family && model_name_list[project_type] && model_name_list[project_type][model_family] ?
                  model_name_list[project_type][model_family].map(item => (
                    <MenuItem value={item} key={item}> {item} </MenuItem>
                  )) : null
                }
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

export default ModelTraining
