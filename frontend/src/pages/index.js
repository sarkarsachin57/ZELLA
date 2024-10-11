import CGroups from '../../styles/pages/settings.module.scss'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
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

import { projectSchema } from 'src/@core/schema'
import {
  useCreateConfigMutation,
} from 'src/pages/redux/apis/configApi'
import { useCreateProjectMutation, useGetProjectListMutation } from 'src/pages/redux/apis/baseApi';
import { setProjectList } from './redux/features/baseSlice'

const CreateProject = () => {
  const user = useSelector(state => {
    return state.userState.user
  })
  console.log("projectList: ", useSelector(state => state.baseState.projectList))
  // const [projectList, setProjectList] = useState(useSelector(state => state.baseState.projectList))
  const [projectList, setProjectList] = useState([]);

  const tmpProjectList= useSelector(state => {
    return state.baseState.projectList
  })
  console.log("user: ", user)
  console.log("projectList: ", tmpProjectList)

  const [createProject] = useCreateProjectMutation()
  const [getProjectList] = useGetProjectListMutation()
  const [createConfig, { isLoading, isError, error, isSuccess }] = useCreateConfigMutation()

  const [email, setEmail] = useState(user && user.email)

  useEffect(() => {
    setEmail(user && user.email)

  }, user);

  useEffect(() => {
    const onGetProjectList = async () => {
      if (user && user?.email) {
        const formData = new FormData()
        formData.append('email', user.email)
        try {
          console.log("formdata")
          await getProjectList(formData)
        } catch (error) {
          toast.error('Something went wrong!');
        }
      }
    }

    onGetProjectList()
  }, [user]);

  useEffect(() => {
    if(tmpProjectList && tmpProjectList.length > 0) {
      setProjectList(tmpProjectList)
    }
  }, [tmpProjectList])


  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('')

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


  useEffect(() => {
    setEmail(user && user.email)

  }, user);
  // ============ Define actions <start> ================== **QmQ

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
        await createProject(formData)
        toast.success('Successfully project created!');
        
      } catch (error) {
        toast.error('Something went wrong!');
      }
    }
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
            <FormControl fullWidth>
              <InputLabel id='projectType'> {'Select Project Type'} </InputLabel>
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
                <MenuItem value={'Semantic Segmentation'}> {'Semantic Segmentation'} </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </SettingPanelLayout>

      <CardBox>
        <CustomTable
          headCells = {headCells}
          rows = {projectList}
        />
      </CardBox>
    </Box>
  )
}

CreateProject.getLayout = page => <LogoLayout>{page}</LogoLayout>

export default CreateProject
