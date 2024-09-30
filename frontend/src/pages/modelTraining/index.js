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
  useGetTrainingViewDetailMutation
} from 'src/pages/redux/apis/baseApi'

const ModelTraining = () => {
  const arch_name_list = ['resnet18', 'resnet34', 'resnet50', 'resnet101', 'resnet152', 'vgg11', 'vgg13', 'vgg16', 'vgg19', 'densenet121', 'densenet169', 'densenet201','mobilenet_v2', 'mobilenet_v3_large', 'mobilenet_v3_small', 'efficientnet_b0', 'efficientnet_b1', 'efficientnet_b2', 'efficientnet_b3', 'efficientnet_b4', 'efficientnet_b5', 'efficientnet_b6', 'efficientnet_b7','shufflenet_v2_x0_5', 'shufflenet_v2_x1_0','mnasnet0_5', 'mnasnet0_75', 'mnasnet1_0', 'mnasnet1_3', 'squeezenet1_0', 'squeezenet1_1', 'googlenet', 'alexnet']
  const training_mode_list = ['scratch', 'finetune', 'transfer']
  const headCells = [
    {
      id: 'no',
      numeric: false,
      disablePadding: true,
      label: 'No'
    },
    {
      id: 'data_name',
      numeric: true,
      disablePadding: false,
      label: 'Data Name'
    },
    {
        id: 'run_name',
        numeric: true,
        disablePadding: false,
        label: 'Run Name'
    },
    {
      id: 'arch_name',
      numeric: true,
      disablePadding: false,
      label: 'Arch Name'
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
  const project_list = useSelector((state) => {
    return state.baseState.projectList
  })
  const latest_project_url = useSelector((state) => {
    return state.baseState.latestProjectUrl
  })
  console.log("latest_project_url: ", latest_project_url)

  const run_logs_list = useSelector((state) => {
    return state.baseState.run_logs_list
  })
  console.log('run_logs_list: ', run_logs_list)

  const [email, setEmail] = useState(user.email)
  const [project_name, setsetProjectList] = useState(project_list.find(obj => obj._id === latest_project_url).project_name)
  const [data_name, setDataName] = useState('')
  const [run_name, setRunName] = useState('')
  const [arch_name, setArchName] = useState('')
  const [training_mode, setTrainingMode] = useState('')
  const [num_epochs, setNumEpochs] = useState('10')
  const [batch_size, setBatchSize] = useState('32')
  const [learning_rate, setLearningRate] = useState('0.01')
  const [dataset_list, setDatasetList] = useState(useSelector(state => state.baseState.dataSetList))
  const [isLoading, setIsLoading] = useState(false)
  const [isTrainModalOpen, setTrainModalSwitch] = useState(false)
  const [training_detail_infor, setTrainingDetailInfor] = useState(undefined)



  const [ TrainImageClassificationModel ] = useTrainImageClassificationModelMutation()
  const [ getRunLogs ] = useGetRunLogsMutation()
  const [ getTrainingViewDetail ] = useGetTrainingViewDetailMutation()


  useEffect(() => {
    const onGetRunLogs = async () => {
      if (user && user?.email) {
        const formData = new FormData()
        formData.append('email', user.email)
        formData.append('project_name', project_name)
        try {
          await getRunLogs(formData)
        } catch (error) {
          toast.error('Something went wrong!');
        }
      }
    }

    onGetRunLogs()
  }, []);

  // Check the connection validation ** QmQ
  const validate = () => {
    if (!data_name) {
      toast.error('Please select the data name')

      return false
    }
    if (!run_name) {
      toast.error('Please input the run name')

      return false
    }
    if (!arch_name) {
      toast.error('Please select the arch name')

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
      formData.append('data_name', data_name)
      formData.append('run_name', run_name)
      formData.append('arch_name', arch_name)
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
        headerIcon={<PlayArrowIcon />}
        isLoading={isLoading}
        headerTitle='Model Training'
        select_tracking_mode={true}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='data_name'> {'Select Data Name'} </InputLabel>
              <Select
                value={data_name}
                onChange={e => setDataName(e.target.value)}
                id='data_name'
                labelId='data_name'
                input={<OutlinedInput label='Data Name' id='data_name' />}
              >
                {dataset_list.map(item =>{
                  return (<MenuItem value={item.data_name}> {item.data_name} </MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
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
              <InputLabel id='arch_name'> {'Arch Name'} </InputLabel>
              <Select
                value={arch_name}
                onChange={e => setArchName(e.target.value)}
                id='arch_name'
                labelId='arch_name'
                input={<OutlinedInput label='Arch Name' id='Arch Name' />}
              >
                {arch_name_list.map(item =>{
                  return (<MenuItem value={item}> {item} </MenuItem>)
                })}
              </Select>
            </FormControl>
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
        </Grid>
        <Grid container spacing={6} sx={{marginTop:'5px'}} >
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type='text'
              label='Num Epochs'
              placeholder='Please input Num Epochs'
              value={num_epochs}
              onChange={e => setNumEpochs(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type='text'
              label='Batch Size'
              placeholder='Please input Batch Size'
              value={batch_size}
              onChange={e => setBatchSize(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
