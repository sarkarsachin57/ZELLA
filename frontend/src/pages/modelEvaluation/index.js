//  ** import styles classes
import CGroups from '../../../styles/pages/settings.module.scss'

// ** React Imports

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'
import CardBox from 'src/views/settings/CardBox'
import ModelEvaluationTable from 'src/@core/components/table/model-evaluation-table'
import EvalDetailModal from 'src/views/modals/EvalDetailModal'

import { connectSchema } from 'src/@core/schema'
import {
  useModelEvaluationMutation,
  useGetEvalRunLogsMutation,
  useGetDataSetListMutation,
} from 'src/pages/redux/apis/baseApi'

const ModelEvaulation = () => {
  const headCells = [
    {
      id: 'no',
      numeric: false,
      disablePadding: true,
      label: 'No'
    },
    {
      id: 'eval_run_name',
      numeric: true,
      disablePadding: false,
      label: 'Eval Run Name',
      minWidth: 150
    },
    {
      id: 'train_run_name',
      numeric: true,
      disablePadding: false,
      label: 'Train Run Name',
      minWidth: 150
    },
    {
        id: 'eval_data_name',
        numeric: true,
        disablePadding: false,
        label: 'Eval Data Name'
    },
    {
      id: 'eval_run_time_str',
      numeric: true,
      disablePadding: false,
      label: 'Eval Run Time',
      minWidth: 170
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
  const [evalRunName, setEvalRunName] = useState('')
  const [trainRunName, setTrainRunName] = useState('')
  const [dataName, setDataName] = useState('')
  const [valBatchSize, setValBatchSize] = useState('')
  const [dataset_list, setDatasetList] = useState(useSelector(state => state.baseState.dataSetList))
  const [isLoading, setIsLoading] = useState(false)
  const [isEvalModalOpen, setEvalModalSwitch] = useState(false)
  const [detailData, setDetailData] = useState([])

  const [run_logs_list, setRunLosgList] = useState(useSelector(state => state.baseState.run_logs_list))
  const [ eval_run_logs_list, setEvalRunLosgList] = useState(useSelector(state => state.baseState.modelEvaluationLogs))
  const [ modelEvaluation ] = useModelEvaluationMutation()
  const [ getDataSetList ] = useGetDataSetListMutation()
  const [ GetEvalRunLogs ] = useGetEvalRunLogsMutation()
  
  const onGetEvalRunLogs = async () => {
    if (user && user?.email) {
      const formData = new FormData()
      formData.append('email', user.email)
      formData.append('project_name', project_name)
      try {
        const data =  await GetEvalRunLogs(formData)
        setEvalRunLosgList(data.data.run_history)
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
        formData.append('data_type', 'All')
      try {
          const data = await getDataSetList(formData)
          console.log('datalist: ', data)
          setDatasetList(data.data.dataset_list)
        } catch (error) {
          toast.error('Something went wrong!');
        }
      }
    }

    onGetEvalRunLogs()
    onGetDataSetList()
  }, [project_name]);
  useEffect(() => {
    setProjectList(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_name: null)
  }, [project_list]);

  // Check the connection validation ** QmQ
  const validate = () => {
    if (!evalRunName) {
      toast.error('Please input the Eval Run Name')

      return false
    }
    if (!trainRunName) {
      toast.error('Please select the Train Run Name')

      return false
    }
    if (!dataName) {
      toast.error('Please select the Data Name')

      return false
    }
    if (!valBatchSize) {
      toast.error('Please input the Val Batch Size')

      return false
    }

    return true
  }

  const handleEvalDetailModalOpen = () => {
    setEvalModalSwitch(true);
  }
  
  const handleEvalDetailModalClose = () => {
    setEvalModalSwitch(false);
  }


  const onInsertSubmitHandler = async () => {
    if (validate()) {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('project_name', project_name)
      formData.append('eval_run_name', evalRunName)
      formData.append('train_run_name', trainRunName)
      formData.append('data_name', dataName)
      formData.append('val_batch_size', valBatchSize)
      setIsLoading(true)
      const res = await modelEvaluation(formData)
      setIsLoading(false)
      console.log(res.data)
      if(res.data.status === "fail"){
        toast.error(res.data.message)
      }
      else{
        toast.success(res.data.message)
        setTrainRunName('')
        setEvalRunName('')
        setDataName('')
        setValBatchSize('')
        onGetEvalRunLogs()
      }
    }
  }

  const viewDetailHandler = (data) => {
    setDetailData(data)
    setEvalModalSwitch(true);
  }

  return (
    <Box className={CGroups.settings_layout}>
      <SettingPanelLayout
        btnTitle={'Start'}
        btnAction={onInsertSubmitHandler}
        schema={connectSchema}
        headerIcon={<PlayArrowIcon />}
        isLoading={isLoading}
        headerTitle='Model Evaluation'
        select_tracking_mode={true}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type='text'
              label='Eval Run Name'
              placeholder='Please Eval Run Name'
              value={evalRunName}
              onChange={e => setEvalRunName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='trainRunName'> {'Select Train Run Name'} </InputLabel>
              <Select
                value={trainRunName}
                onChange={e => setTrainRunName(e.target.value)}
                id='trainRunName'
                labelId='trainRunName'
                input={<OutlinedInput label='Train Run Name' id='trainRunName' />}
              >
                {run_logs_list?.map(item =>{
                  return (<MenuItem value={item.run_name}> {item.run_name} </MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='dataName'> {'Select Data Name'} </InputLabel>
              <Select
                value={dataName}
                onChange={e => setDataName(e.target.value)}
                id='dataName'
                labelId='dataName'
                input={<OutlinedInput label='Data Name' id='dataName' />}
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
              label='Batch Size'
              placeholder='Please Batch Size'
              value={valBatchSize}
              onChange={e => setValBatchSize(e.target.value)}
            />
          </Grid>
        </Grid>
      </SettingPanelLayout>

      <CardBox>
        <ModelEvaluationTable
          headCells = {headCells}
          rows = {eval_run_logs_list}
          viewDetailHandler = {viewDetailHandler}
        />
      </CardBox>
      <EvalDetailModal
        width={"80%"}
        isOpen={isEvalModalOpen}
        onHandleModalClose = {handleEvalDetailModalClose}
        data = {detailData}
      />
    </Box>
  )
}

export default ModelEvaulation
