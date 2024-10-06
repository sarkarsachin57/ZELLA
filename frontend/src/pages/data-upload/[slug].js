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
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRouter } from "next/router"

import FileInput from 'src/views/commons/FileInput'
import InitializeVideoModal from 'src/views/modals/dynamicVideoInitModal'
import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'
import CardBox from 'src/views/settings/CardBox'
import DatasetTable from 'src/@core/components/table/DatasetTable'


// import BasicModal from 'src/views/modals/CustomModalLayout'
import { connectSchema } from 'src/@core/schema'
import { useGetDataSetListMutation, useUploadDataMutation, useUpdateLatestUrlMutation } from 'src/pages/redux/apis/baseApi'

export default function Page({params}) {
    const router = useRouter();
    const { slug } = router.query;
    
    const [ updateLatestUrl ] = useUpdateLatestUrlMutation()
    
    useEffect(() => {
      updateLatestUrl(slug)
      localStorage.setItem('project_id', slug)
    }, [])
    const user = useSelector(state => {
        return state.userState.user
    })

    const projectList = useSelector((state) => {
        return state.baseState.projectList
    })
    const dataSetList = useSelector((state) => {
        return state.baseState.dataSetList
    })

    
      const [email, setEmail] = useState(localStorage.getItem('email'))
      const [projectName, setProjectName] = useState(projectList.length > 0 ? projectList.find(obj => obj._id === slug).project_name:'')
      const [dataName, setDataName] = useState('')
      const [dataType, setDataType] = useState('')
      const [dataDriveId, setDataDriveId] = useState('')
      const [dataFile, setDataFile] = useState(undefined)
      const [isLoading, setIsLoading] = useState(false)

      const [ getDataSetList ] = useGetDataSetListMutation()
      const [ uploadData ] = useUploadDataMutation()
        
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

      const headCells = [
        {
          id: 'no',
          numeric: false,
          disablePadding: true,
          label: 'No'
        },
        {
          id: 'dataName',
          numeric: true,
          disablePadding: false,
          label: 'Data Name'
        },
        {
            id: 'projectType',
            numeric: true,
            disablePadding: false,
            label: 'ProjectType'
        },
        {
          id: 'dataType',
          numeric: true,
          disablePadding: false,
          label: 'Data Type'
        },
        {
            id: 'dataCreationTime',
            numeric: true,
            disablePadding: false,
            label: 'Data Creation Time'
          },
        {
          id: 'detail',
          numeric: true,
          disablePadding: false,
          label: 'Detail'
        },
      ]
    
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
        
        return true
      }
    
      useEffect(() => {
        const onGetDataSetList = async () => {
          if (user && user?.email) {
            const formData = new FormData()
            formData.append('email', user.email)
            formData.append('project_name', projectList.length > 0 ? projectList.find(obj => obj._id === slug).project_name:'')
            try {
              await getDataSetList(formData)
            } catch (error) {
              toast.error('Something went wrong!');
            }
          }
        }
    
        onGetDataSetList()
      }, [projectList]);

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
          formData.append('data_type', dataType)
          formData.append('data_drive_id', dataDriveId)
          if(dataDriveId !== ''){
            setDataFile('')
          }
          formData.append('data_zip_file', dataFile)
          setIsLoading(true)
          try {
            const res = await uploadData(formData)
            setIsLoading(false)
            if(res.error){
              toast.error("Something went wrong!")
            }
            else{
              toast.success("successfully data uploaded!")
              setDataName('')
              setDataType('')
              setDataDriveId('')
              setDataFile(undefined)
            }
          } catch (error) {
            toast.error('Something went wrong!');
          }
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
            headerTitle={projectName}
            select_tracking_mode={true}
          >
            <Grid container spacing={6} sx={{marginBottom:'15px'}}>
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
                {
                    dataDriveId === '' ? (<FileInput label='Input Data File' video_file={dataFile} onChange={handleFileOnChange} />) : ''
                }
                
              </Grid>
            </Grid>
          </SettingPanelLayout>
          <CardBox>
            <DatasetTable
                headCells = {headCells}
                rows = {dataSetList}
            />
          </CardBox>
        </Box>
      )
}