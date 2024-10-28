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
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'
import CardBox from 'src/views/settings/CardBox'
import ModelEvaluationTable from 'src/@core/components/table/model-evaluation-table'
import FileInput from 'src/views/commons/FileInput'
import EvalDetailModal from 'src/views/modals/EvalDetailModal'
import { styled,Theme } from '@mui/system';
import SettingPanelHeader from 'src/views/settings/SettingPanelHeader'
import ClassWise from 'src/@core/components/class-wise/class-wise'
import { connectSchema } from 'src/@core/schema'
import {
    useModelInferenceMutation,
    useGetRunLogsMutation
} from 'src/pages/redux/apis/baseApi'
const CardImage = styled('img')(({ theme }) => ({
    padding: '0px',
    margin: '0px',
    borderRadius: '10px',
    width: '100%',
    height: '85%',
  }))
const ModelInference = () => {
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
  const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/`;

  const [email, setEmail] = useState(localStorage.getItem('email'))
  const [project_name, setProjectList] = useState(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_name: null)
  const [project_type, setProjectType] = useState(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_type: null)
  const [evalRunName, setEvalRunName] = useState('')
  const [trainRunName, setTrainRunName] = useState('')
  const [save_path, setSavePath] = useState('')
  const [otherRlt, setOtherRlt] = useState('')
  const [dataset_list, setDatasetList] = useState(useSelector(state => state.baseState.dataSetList))
  const [isLoading, setIsLoading] = useState(false)
  const [isEvalModalOpen, setEvalModalSwitch] = useState(false)
  const [detailData, setDetailData] = useState([])
  const [dataFile, setDataFile] = useState(undefined)


  const [run_logs_list, setRunLosgList] = useState(useSelector(state => state.baseState.run_logs_list))
  const [ eval_run_logs_list, setEvalRunLosgList] = useState(useSelector(state => state.baseState.modelEvaluationLogs))
  const [ modelInference ] = useModelInferenceMutation()
  const [ getRunLogs ] = useGetRunLogsMutation()
  
  useEffect(() => {
    setProjectList(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_name: null)
  }, [project_list]);

  // Check the connection validation ** QmQ
  const validate = () => {
    if (!trainRunName) {
      toast.error('Please select the Train Run Name')

      return false
    }
    if (!dataFile) {
      toast.error('Please input the Image File')

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

  useEffect(() => {
    const onGetRunLogs = async () => {
        if (user && user?.email) {
          const formData = new FormData()
          formData.append('email', user.email)
          formData.append('project_name', project_name)
          try {
            const data =  await getRunLogs(formData)
            setRunLosgList(data.data.run_history)
          } catch (error) {
            toast.error('Something went wrong!');
          }
        }
      }

    onGetRunLogs()
  }, [project_name]);
  const onInsertSubmitHandler = async () => {
    if (validate()) {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('project_name', project_name)
      formData.append('image_file', dataFile)
      formData.append('run_name', trainRunName)
      setIsLoading(true)
      const res = await modelInference(formData)
      setIsLoading(false)
      console.log(res.data)
      if(res.data.status === "fail"){
        toast.error(res.data.message)
      }
      else{
        toast.success(res.data.message)
        setDataFile(undefined)
        setTrainRunName('')
        setSavePath(res.data.data.save_path)
        if(project_type === 'Image Classification'){
            setOtherRlt(res.data.data.predicted_class)
        }else{
            setOtherRlt(res.data.data.classwise_colors)
        }
      }
    }
  }
  const handleFileOnChange = data => {
    setDataFile(data.file)
  }
  const viewDetailHandler = (data) => {
    setDetailData(data)
    setEvalModalSwitch(true);
  }
//   console.log(otherRlt?JSON.parse(otherRlt))

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
            <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
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
            <Grid item xs={12} sm={6}>
                <FileInput label='Input Image File' video_file={dataFile} onChange={handleFileOnChange} />
            </Grid>
        </Grid>
      </SettingPanelLayout>

      <CardBox>
        {
            project_type === "Image Classification"?(
                <Box sx={{display: 'flex', justifyContent: 'flex-center'}}>
                    <Typography sx={{padding: '10px', width: '100%', fontSize: '22px'}}>
                        {otherRlt}
                    </Typography>
                </Box>
            ):null
        }
        {
            save_path?(
                <CardImage 
                    src = {baseUrl + save_path} 
                    alt='pic'
                />
            ):"No Data"
        }
        {
            otherRlt && project_type  === "Image Classification"?null:(
                <ClassWise data = {otherRlt} />
            )
        }
      </CardBox>
    </Box>
  )
}

export default ModelInference
