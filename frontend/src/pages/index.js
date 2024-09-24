import CGroups from '../../styles/pages/settings.module.scss'

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
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import SettingPanelLayout from 'src/views/settings/SettingPanelLayout'
import LogoLayout from 'src/layouts/LogoLayout';
import CardBox from 'src/views/settings/CardBox'
import CustomTable from 'src/@core/components/table/CustomTable'

// import BasicModal from 'src/views/modals/CustomModalLayout'
import { projectSchema } from 'src/@core/schema'
import {
  configApi,
  useCreateConfigMutation,
  useGetAllConfigsQuery,
  useUpdateConfigMutation,
  useDeleteConfigMutation
} from 'src/pages/redux/apis/configApi'
import { useCreateLogMutation } from 'src/pages/redux/apis/logApi'
import { useUpdateUserMutation } from 'src/pages/redux/apis/userApi'
import { useCreateProjectMutation } from 'src/pages/redux/apis/baseApi';

import { handleErrorResponse, trimedStr } from 'src/helpers/utils'
import {
  useTerminate_cameraMutation,
  useUploadVideoMutation,
  useInitialize_offline_videoMutation
} from 'src/pages/redux/apis/edfsdf'

import { getFileExtension } from 'src/helpers/utils'
import { TRUST_METHOD, TRUST_MODE } from 'src/constants'

/**
 * @author QmQ
 * @file shows the main page-live view page
 * @returns
 */

const CreateProject = () => {

  const [email, setEmail] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('')

  const [isInitModalOpen, setInitModalSwitch] = useState(false)
  const [initEl, setInitEl] = useState('')
  const [termEl, setTermEl] = useState('')

  const [conValues, setConValues] = useState({
    video_file: undefined,
    camera_name: '',
    tracking_mode: 'sot'
  })


  const headCells = [
    {
      id: 'no',
      numeric: false,
      disablePadding: true,
      label: 'No'
    },
    {
      id: 'projectName',
      numeric: true,
      disablePadding: false,
      label: 'Project Name'
    },
    {
      id: 'projectType',
      numeric: true,
      disablePadding: false,
      label: 'Project Type'
    },
    {
      id: 'projectCreationTime',
      numeric: true,
      disablePadding: false,
      label: 'Project Creation Time'
    },
    {
      id: 'control',
      numeric: true,
      disablePadding: false,
      label: 'Control'
    },
  ]


  function createData(no, projectName, projectType, projectCreationTime) {
    return {
      no,
      projectName,
      projectType,
      projectCreationTime,
    }
  }

  const data = [
    createData(1, 'project1', 'Image Classification', '2.24.9.17'),
    createData(2, 'project2', 'Object Detection', '2.24.9.17'),
    createData(3, 'project3', 'Image Classification', '2.24.9.17'),
    createData(4, 'project4', 'Object Detection', '2.24.9.17'),
    createData(5, 'project5', 'Object Detection', '2.24.9.17'),
    createData(6, 'project6', 'Image Classification', '2.24.9.17'),
    createData(7, 'project7', 'Image Classification', '2.24.9.17'),
    createData(8, 'project8', 'Image Classification', '2.24.9.17'),
  ]

  // ============ Define the states <end> ================ **QmQ

  const user = useSelector(state => {
    return state.userState.user
  })

  configApi.endpoints.getAllConfigs.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true
  })

  // ============ Define actions <start> ================== **QmQ
  const [createProject] = useCreateProjectMutation()
  const [createConfig, { isLoading, isError, error, isSuccess }] = useCreateConfigMutation()

    useInitialize_offline_videoMutation()

    useUpdateConfigMutation()

  const validate = () => {
    if (!email) {
      toast.error('Please input the Email')

      return false
    }
    if (!projectName) {
      toast.error('Please input the Project Name')

      return false
    }
    if (!projectType) {
      toast.error('Please select the Project Type')

      return false
    }

    return true
  }

  const onInsertSubmitHandler = async () => {
    if (validate()) {
      // send the camere connection request to flask api ** QmQ
      const formData = new FormData()
      formData.append('email', email)
      formData.append('project_name', projectName)
      formData.append('project_type', projectType)

      try {
        const res = await createProject(formData)
      } catch (error) {
        toast.error('Something went wrong!');
      }
    }
  }

  const action = async () => {
    window.location.href = '/dataUpload'
  }

  return (
    <Box className={CGroups.settings_layout}>
      <SettingPanelLayout
        btnTitle={'Create'}
        btnAction={onInsertSubmitHandler}
        schema={projectSchema}
        headerIcon={<AddIcon />}
        isLoading={isLoading}
        headerTitle='Create Project'
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type='text'
              label='Email'
              placeholder='Please input Email'
              value={ email }
              onChange={e => {
                setEmail(e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type='text'
              label='Project Name'
              placeholder='Please input Project Name'
              value={ projectName }
              onChange={e => {
                setProjectName(e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='select_model'> {'Select Model'} </InputLabel>
              <Select
                value={projectType}
                onChange={e =>
                  setProjectType( e.target.value )
                }
                id='projectType'
                labelId='projectType'
                input={<OutlinedInput label='Project Type' id='Project Type' />}
              >
                <MenuItem value={'Image Classification'}> {'Image Classification'} </MenuItem>
                <MenuItem value={'Object Detection'}> {'Object Detection'} </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </SettingPanelLayout>

      <CardBox>
        <CustomTable
          headCells = {headCells}
          rows = {data}
          action = {action}
        />
      </CardBox>
    </Box>
  )
}

CreateProject.getLayout = page => <LogoLayout>{page}</LogoLayout>

export default CreateProject
