import { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import CardBox from 'src/views/settings/CardBox'
import CustomChart from 'src/@core/components/chart/customChart'
import { LoadingButton } from 'src/@core/components/button/LoadingButton'
import ViewSampleModal from 'src/views/modals/viewSampleModal'

import { useGetDataSetInfoMutation, useGetViewSampleMutation } from 'src/pages/redux/apis/baseApi'
import CGroups from '../../../styles/pages/settings.module.scss'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundImage: 'linear-gradient(to right, #1a90ff, #308fe8)',
    },
}));

export default function Page({params}) {
    const [dataset_info, setDatasetInfor] = useState(undefined)
    const [isViewSampleOpen, setViewSampleSwitch] = useState(false)

    const [ getDataSetInfo ] = useGetDataSetInfoMutation()
    const [ getViewSample ] = useGetViewSampleMutation()
    
    const router = useRouter();
    const { slug } = router.query;
    const user = useSelector(state => {
        return state.userState.user
    })
    console.log("user: ", user)

    const projectList = useSelector((state) => {
        return state.baseState.projectList
    })
    console.log('projectList: ', projectList)

    const latestProjectUrl = useSelector(state => state.baseState.latestProjectUrl)
    console.log('latestProjectUrl: ', latestProjectUrl)

    const dataSetList = useSelector(state => state.baseState.dataSetList)
    console.log('dataSetList: ', dataSetList)

    useEffect(() => {
        const onGetDataSetInfo = async () => {
          if (user && user?.email) {
            const formData = new FormData()
            formData.append('email', user.email)
            formData.append('project_name', projectList.find(obj => obj._id === latestProjectUrl).project_name)
            formData.append('data_name', dataSetList.find(obj => obj._id === slug).data_name)
            formData.append('show_samples', '0')
            try {
              const res = await getDataSetInfo(formData)
              console.log(res.data.data_info)
              setDatasetInfor(res.data.data_info)
            } catch (error) {
              toast.error('Something went wrong!');
            }
          }
        }
    
        onGetDataSetInfo()
    }, []);
    const handleViewSampleOpen = () => {
        setViewSampleSwitch(true);
    }

    const handleViewSampleClose = () => {
        setViewSampleSwitch(false);
    }
    return (
        <Box className={CGroups.settings_layout}>
            <CardBox>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                    <Grid item xs={12} sm={3}>
                        <Typography variant="button" gutterBottom sx={{ display: 'block', marginTop: '2px' }}>
                            Train Sample: {dataset_info === undefined ? null : dataset_info.total_samples}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                             Class Balance
                        </Typography>
                        <BorderLinearProgress variant="determinate" value={dataset_info === undefined ? null : dataset_info.class_balance_score} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <LoadingButton
                            variant='contained'
                            className={CGroups.setting_button}
                            sx={{ mt: 1, padding: '8px' }}
                            disableElevation
                            onClick={handleViewSampleOpen}
                        >
                            View Samples
                        </LoadingButton>
                    </Grid>
                </Grid>
            </CardBox>
            <CardBox>
                <Typography variant="button" gutterBottom sx={{ display: 'block', marginTop: '20px'  }}>
                    {dataset_info === undefined ? null : dataset_info.dist_fig.title}
                </Typography>
                {
                    dataset_info === undefined ?
                        <Typography variant="button" gutterBottom sx={{ display: 'block',}}>
                             No Data
                        </Typography>
                        :<CustomChart
                            chartData = {dataset_info === undefined ? null : dataset_info.dist_fig}
                        />
                }
            </CardBox>
            <ViewSampleModal
                width={1200}
                isOpen={isViewSampleOpen}
                onHandleModalClose = {handleViewSampleClose}
                email = {user.email}
                project_name = {projectList.find(obj => obj._id === latestProjectUrl).project_name}
                data_name = {dataSetList.find(obj => obj._id === slug).data_name}
                class_data = {dataset_info === undefined ? null : dataset_info.class_list}
                getViewSample = {getViewSample}
            />
        </Box>
    )
}