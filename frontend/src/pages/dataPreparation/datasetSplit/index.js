//  ** import styles classes
import CGroups from '../../../../styles/pages/settings.module.scss'

// ** React Imports

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'
import CardBox from 'src/views/settings/CardBox'
import SplitDatasetTable from 'src/@core/components/table/split-dataset-table'

import { connectSchema } from 'src/@core/schema'
import {
  useSplitDatasetMutation,
  useGetSplitDatasetMutation,
  useGetDataSetListMutation,
} from 'src/pages/redux/apis/baseApi'

const DatasetSplit = () => {
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
      id: 'split_data_name_1',
      numeric: true,
      disablePadding: false,
      label: 'Split Data Name 1',
      minWidth: 150
    },
    {
      id: 'split_data_name_2',
      numeric: true,
      disablePadding: false,
      label: 'Split Data Name 2',
      minWidth: 150
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
      minWidth: 130
    },
  ]
  const user = useSelector(state => {
    return state.userState.user
  })
  const project_list = useSelector((state) => {
    return state.baseState.projectList
  })

  const [email, setEmail] = useState(localStorage.getItem('email'))
  const [project_name, setProjectList] = useState(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_name: null)
  const [data_name, setDataName] = useState('')
  const [splitDataname1, setSplitDataname1] = useState('')
  const [splitDataname2, setSplitDataname2] = useState('')
  const [splitRatio, setSplitRatio] = useState('')
  const [dataset_list, setDatasetList] = useState(useSelector(state => state.baseState.dataSetList))
  const [isLoading, setIsLoading] = useState(false)
  const [splitDataLogs, setSplitHistory] = useState(useSelector(state => state.baseState.splitDataLogs))

  const [ SplitDataset ] = useSplitDatasetMutation()
  const [ getDataSetList ] = useGetDataSetListMutation()
  const [ getSplitDataset ] = useGetSplitDatasetMutation()
  
  const onGetNoiseRunFilteringLogs = async () => {
    if (user && user?.email) {
      const formData = new FormData()
      formData.append('email', user.email)
      formData.append('project_name', project_name)
      try {
        const data =  await getSplitDataset(formData)
        setSplitHistory(data.data.run_history)
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

    onGetNoiseRunFilteringLogs()
    onGetDataSetList()
  }, [project_name]);
  useEffect(() => {
    setProjectList(project_list.length > 0 ? project_list.find(obj => obj._id === localStorage.getItem('project_id')).project_name: null)
  }, [project_list]);

  const validate = () => {
    if (!data_name) {
      toast.error('Please select the data name')

      return false
    }
    if (!splitDataname1) {
      toast.error('Please input the Split Data Name 1')

      return false
    }
    if (!splitDataname2) {
        toast.error('Please input the Split Data Name 2')
  
        return false
    }
    if (!splitRatio) {
        toast.error('Please input the Split Ratio')
  
        return false
    }
    return true
  }

  const onInsertSubmitHandler = async () => {
    if (validate()) {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('project_name', project_name)
      formData.append('data_name', data_name)
      formData.append('split_data_name_1', splitDataname1)
      formData.append('split_data_name_2', splitDataname2)
      formData.append('split_ratio', splitRatio)
      setIsLoading(true)
      const res = await SplitDataset(formData)
      setIsLoading(false)
      console.log('split data: ', res.data)
      if(res.data.status === "fail"){
        toast.error(res.data.message)
      }
      else{
        toast.success(res.data.status)
        setDataName('')
        setSplitDataname1('')
        setSplitDataname2('')
        setSplitRatio('')
        onGetNoiseRunFilteringLogs()
      }
    }
  }

  return (
    <Box className={CGroups.settings_layout}>
      <SettingPanelLayout
        btnTitle={'Start'}
        btnAction={onInsertSubmitHandler}
        schema={connectSchema}
        headerIcon={<CallSplitIcon />}
        isLoading={isLoading}
        headerTitle='Noise Filtering'
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
              label='Split Name 1'
              placeholder='Please input Split Name 1'
              value={splitDataname1}
              onChange={e => setSplitDataname1(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type='text'
              label='Split Name 2'
              placeholder='Please input Split Name 2'
              value={splitDataname2}
              onChange={e => setSplitDataname2(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type='text'
              label='Split Ratio'
              placeholder='Please input Split Ratio'
              value={splitRatio}
              onChange={e => setSplitRatio(e.target.value)}
            />
          </Grid>
        </Grid>
      </SettingPanelLayout>
      <CardBox>
        <SplitDatasetTable
          headCells = {headCells}
          rows = {splitDataLogs}
        />
      </CardBox>
    </Box>
  )
}

export default DatasetSplit
