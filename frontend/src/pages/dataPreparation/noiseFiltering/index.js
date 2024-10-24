//  ** import styles classes
import CGroups from '../../../../styles/pages/settings.module.scss'

// ** React Imports

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FilterIcon from '@mui/icons-material/Filter'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'
import CardBox from 'src/views/settings/CardBox'
import NoiseHistoryTable from 'src/@core/components/table/noise-history-table'
import ImageClassModal from 'src/views/modals/ImageClassModal'

import { connectSchema } from 'src/@core/schema'
import {
  useFilterNoiseSamplesMutation,
  useGetNoiseRunFilteringLogsMutation,
  useGetTrainingViewDetailMutation,
  useGetDataSetListMutation,
} from 'src/pages/redux/apis/baseApi'

const NoiseFiltering = () => {
  const headCells = [
    {
      id: 'no',
      numeric: false,
      disablePadding: true,
      label: 'No'
    },
    {
      id: 'data_name',
      numeric: false,
      disablePadding: true,
      label: 'Data Name',
      minWidth: 150
    },
    {
      id: 'filtered_data_name',
      numeric: true,
      disablePadding: false,
      label: 'Filtered Data Name',
      minWidth: 150
    },
    {
      id: 'project_name',
      numeric: true,
      disablePadding: false,
      label: 'Project Name',
      minWidth: 150
    },
    {
        id: 'project_type',
        numeric: true,
        disablePadding: false,
        label: 'Project Type'
    },
    {
      id: 'current_progress',
      numeric: true,
      disablePadding: false,
      label: 'Progress'
    },
    {
      id: 'process_start_time_str',
      numeric: true,
      disablePadding: false,
      label: 'Start Time',
      minWidth: 150
    },
    {
      id: 'process_status',
      numeric: true,
      disablePadding: false,
      label: 'Status',
      minWidth: 150
    },
    {
      id: 'total_number_of_samples',
      numeric: true,
      disablePadding: false,
      label: 'Total Number Samples',
      minWidth: 160
    },
    {
      id: 'noisy_samples_filtered',
      numeric: true,
      disablePadding: false,
      label: 'Noisy Sample Filtered',
      minWidth: 150
    },
    {
      id: 'download',
      numeric: true,
      disablePadding: false,
      label: 'Download'
    },
  ]
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
  const [data_name, setDataName] = useState('')
  const [filterDataName, setFilterDataName] = useState('')
  const [dataset_list, setDatasetList] = useState(useSelector(state => state.baseState.dataSetList))
  const [isLoading, setIsLoading] = useState(false)
  const [training_detail_infor, setTrainingDetailInfor] = useState(undefined)

  const [noiseHistory, setNoiseHistory] = useState(useSelector(state => state.baseState.noiseHistory))
  console.log('noiseHistory: ', noiseHistory)
  console.log('project_name: ', project_name)

  const [filterNoiseSamples ] = useFilterNoiseSamplesMutation()
  const [ getDataSetList ] = useGetDataSetListMutation()
  const [ getNoiseRunFilteringLogs ] = useGetNoiseRunFilteringLogsMutation()
  const [ getTrainingViewDetail ] = useGetTrainingViewDetailMutation()
  
  const onGetNoiseRunFilteringLogs = async () => {
    if (user && user?.email) {
      const formData = new FormData()
      formData.append('email', user.email)
      formData.append('project_name', project_name)
      try {
        const data =  await getNoiseRunFilteringLogs(formData)
        setNoiseHistory(data.data.run_history)
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

    onGetNoiseRunFilteringLogs()
    onGetDataSetList()
  }, [project_name]);
  useEffect(() => {
    setProjectList(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_name: null)
  }, [project_list]);

  // Check the connection validation ** QmQ
  const validate = () => {
    if (!data_name) {
      toast.error('Please select the Train data name')

      return false
    }
    if (!filterDataName) {
      toast.error('Please input the Filter data name')

      return false
    }
    return true
  }

  const onInsertSubmitHandler = async () => {
    if (validate()) {
      // send the camere connection request to flask api ** QmQ
      const formData = new FormData()
      formData.append('email', email)
      formData.append('project_name', project_name)
      formData.append('data_name', data_name)
      formData.append('filtered_data_name', filterDataName)
      setIsLoading(true)
      const res = await filterNoiseSamples(formData)
      setIsLoading(false)
      console.log('noise data: ', res.data)
      if(res.data.status === "fail"){
        toast.error(res.data.message)
      }
      else{
        toast.success(res.data.status)
        setDataName('')
        setFilterDataName('')
        onGetNoiseRunFilteringLogs()
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
        headerIcon={<FilterIcon />}
        isLoading={isLoading}
        headerTitle='Noise Filtering'
        select_tracking_mode={true}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label='Filter Data Name'
              placeholder='Please input Filter Data Name'
              value={filterDataName}
              onChange={e => setFilterDataName(e.target.value)}
            />
          </Grid>
        </Grid>
      </SettingPanelLayout>
      <CardBox>
        <NoiseHistoryTable
          headCells = {headCells}
          rows = {noiseHistory}
        />
      </CardBox>
    </Box>
  )
}

export default NoiseFiltering
