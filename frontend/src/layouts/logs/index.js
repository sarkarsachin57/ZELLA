//  ** import styles classes
import CGroups from '../../../styles/pages/logs.module.scss'

// ** React Imports
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import OutlinedInput from '@mui/material/OutlinedInput'
import Grid from '@mui/material/Grid'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useGetFilteredLogsMutation, useGetAllLogsQuery } from '../redux/apis/logApi'
import { handleErrorResponse } from 'src/helpers/utils'
import { isInTimeRange, makeReadableTime } from 'src/@core/helpers/utils'
import { useSelector } from 'react-redux'
import { trimedStr } from 'src/helpers/utils'
import LogImageViewModal from 'src/views/modals/LogImageViewModal'
import { configApi } from '../redux/apis/configApi'
import Pagination from '@mui/material/Pagination'
import usePagination from 'src/views/commons/pagination'

const style = theme => ({
  '&:hover': {
    opacity: 0.3
  }
})

const Logs = () => {
  configApi.endpoints.getAllConfigs.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true
  })

  const configs = useSelector(state => {
    return state.configState.configs
  })

  const [getFilteredLogs, { isLoading, isError, error, isSuccess }] = useGetFilteredLogsMutation()

  const [timeRange, setTimeRange] = useState(1)
  const [filteredLogs, setFilteredLogs] = useState([])
  const [cameraName, setCameraName] = useState('ALL')
  const [trackingMode, setTrackingMode] = useState('sot')
  const [cameraNameList, setCameraNameList] = useState(['ALL'])
  const [modalOpenFlag, toggleModal] = useState(false)
  const [selLog, setSelLog] = useState({})
  const [page, setPage] = useState(1)
  const [PER_PAGE, SET_PER_PAGE] = useState(10)
  const [pageCnt, setPageCnt] = useState(1)

  const paginationController = usePagination(filteredLogs, PER_PAGE)

  const handleChange = (e, p) => {
    setPage(p)
    paginationController.jump(p)
  }

  useEffect(() => {
    const camera_name_list = (
      configs.filter(conn => conn.mode === 'online' && conn.tracking_mode === trackingMode) ?? []
    ).map(el => trimedStr(el.camera_name, 8))
    camera_name_list.unshift('ALL')

    // let camera_name_list = [...new Set(camera_names)]
    if (cameraNameList != camera_name_list) setCameraNameList(camera_name_list)
    setCameraName('ALL')
  }, [configs, trackingMode])

  useEffect(async () => {
    const filter = {
      camera_name: cameraName,
      tracking_mode: trackingMode,
      mode: 'online',
      time_range: timeRange
    }
    const _filteredLogs = await getFilteredLogs(filter)
    const _count = Math.ceil(_filteredLogs.data.length / PER_PAGE)
    if (filteredLogs != _filteredLogs.data) {
      setPageCnt(_count)
      setFilteredLogs(_filteredLogs.data)
    }
  }, [cameraName, trackingMode, timeRange])

  useEffect(() => {
    const _count = Math.ceil(filteredLogs.length / PER_PAGE)
    setPageCnt(_count)
    paginationController.jump(1)
    setPage(1)
  }, [PER_PAGE])

  const handleTimeRangeChange = e => {
    setTimeRange(e.target.value)
  }

  const handleCameraNameOnChange = (e, val) => {
    setCameraName(val)
  }

  // const checkFilterConstraint = (log)=>{
  //   if (isInTimeRange(log.createdAt, timeRange) && (trimedStr(log.camera_name, 8) == cameraName || cameraName == 'ALL') && (log.tracking_mode == trackingMode )) return true;
  //   return false;
  // }

  const handleClickListItem = log => {
    if (log.target_file_path === '') return
    toggleModal(true)
    setSelLog(log)
  }

  const handleItemCountPerPage = e => {
    SET_PER_PAGE(e.target.value)
  }

  return (
    <Box className={CGroups.logs_layout}>
      <LogImageViewModal isOpen={modalOpenFlag} onHandleModalClose={() => toggleModal(false)} logInfo={selLog} />

      <Card className={CGroups.logs_panel}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', margin: '8px' }}>
          <HistoryRoundedIcon />
          <Typography sx={{ padding: '0 8px' }}>{'Log History'}</Typography>
        </Box>

        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'left' }}>
                <FormControl sx={{ minWidth: '240px' }}>
                  <InputLabel id='time_range'> TIME RANGE </InputLabel>
                  <Select
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    id='time_range'
                    labelId='pertime_rangeiod'
                    input={<OutlinedInput label='_time_range_' id='time_range' />}
                  >
                    <MenuItem value={1}> {'Last Hour'} </MenuItem>
                    <MenuItem value={24}> {'Last 24 hours'} </MenuItem>
                    <MenuItem value={24 * 7}> {'Last 7 days'} </MenuItem>
                    <MenuItem value={24 * 7 * 4}> {'Last 4 weeks'} </MenuItem>
                    <MenuItem value={-1}> {'All time'} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'left' }}>
                <FormControl fullWidth sx={{ minWidth: '240px' }}>
                  <InputLabel id='tracking_mode_setting'> {'Tracking Mode'} </InputLabel>
                  <Select
                    value={trackingMode}
                    onChange={e => setTrackingMode(e.target.value)}
                    id='tracking_mode_setting'
                    labelId='tracking_mode_setting'
                    input={<OutlinedInput label='Tracking Mode' id='Tracking Mode' />}
                  >
                    <MenuItem value={'sot'}> {'Track Specific Targets'} </MenuItem>
                    <MenuItem value={'mot'}> {'Detect and Track All Objects'} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'left' }}>
                <Autocomplete
                  disablePortal
                  value={cameraName}
                  sx={{ maxWidth: '240px' }}
                  id='combo-box-demo'
                  options={cameraNameList}
                  onChange={handleCameraNameOnChange}
                  renderInput={params => <TextField {...params} label='CAMERA NAME' value={cameraName} />}
                />
              </Grid>
            </Grid>
            {filteredLogs?.length == 0 ? (
              <Box className='content-center'>
                <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant='h1'>{`No Logs`}</Typography>
                  <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
                    No online-mode logs filtered
                  </Typography>
                </Box>
              </Box>
            ) : (
              <List sx={{ width: '100%', maxHeight: '100%', height: '60vh', marginTop: '48px', overflowX: 'auto' }}>
                {paginationController.currentData()?.map(log => {
                  const labelId = `checkbox-list-secondary-label-${log._id}`

                  // if (checkFilterConstraint(log))
                  return (
                    <ListItem sx={style} key={log._id} disablePadding onClick={() => handleClickListItem(log)}>
                      <ListItemText
                        id={labelId}
                        primary={`${makeReadableTime(log._timestamp)}`}
                        sx={{ width: '25%' }}
                      />
                      <ListItemText
                        id={labelId}
                        primary={`${log.content}`}
                        sx={{ width: '75%', textAlign: 'left', ml: 6 }}
                      />
                    </ListItem>
                  )
                })}
              </List>
            )}
          </Grid>
          <br />
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '8px' }}>
          <Pagination
            count={pageCnt}
            color='primary'
            size='large'
            page={page}
            variant='outlined'
            shape='rounded'
            onChange={handleChange}
          />
          <FormControl sx={{ marginLeft: '64px', minWidth: 40 }}>
            <InputLabel id='time_range'> Logs Per Page </InputLabel>
            <Select
              size='small'
              value={PER_PAGE}
              onChange={handleItemCountPerPage}
              id='time_range'
              labelId='pertime_rangeiod'
              input={<OutlinedInput label='_time_range_' id='time_range' />}
            >
              <MenuItem value={10}> {'10'} </MenuItem>
              <MenuItem value={20}> {'20'} </MenuItem>
              <MenuItem value={50}> {'50'} </MenuItem>
              <MenuItem value={100}> {'100'} </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>
    </Box>
  )
}

export default Logs
