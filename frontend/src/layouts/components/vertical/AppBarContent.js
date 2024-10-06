// ** MUI Imports
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'

const AppBarContent = props => {
  const projectList = useSelector((state) => {
    return state.baseState.projectList
  })
  console.log("projectList in app: ", projectList)
  const project_ID = useSelector((state) => {
    return state.baseState.latestProjectUrl
  })
  const [projectName, setProjectName] = useState(projectList.length > 0 ? projectList.find(obj => obj._id === localStorage.getItem('project_id')).project_name:'')
  const [projectType, setProjectType] = useState(projectList.length > 0 ? projectList.find(obj => obj._id === localStorage.getItem('project_id')).project_type:'')
  useEffect(() => {
    setProjectName(projectList.length > 0 ? projectList.find(obj => obj._id === localStorage.getItem('project_id')).project_name:'')
    setProjectType(projectList.length > 0 ? projectList.find(obj => obj._id === localStorage.getItem('project_id')).project_type:'')
  }, [project_ID]);
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'end !important',
        justifyContent: 'space-between'
      }}
    >
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{padding: '0 8px'}}>
            Project Name: {projectName}
        </Typography>
        <Typography sx={{padding: '0 8px'}}>
            Project Type: {projectType}
        </Typography>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <NotificationDropdown /> */}
        <UserDropdown />
      </Box>
    </Box>
  )
}

export default AppBarContent
