import CGroups from '../../../styles/pages/settings.module.scss'

// ** React Imports
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useGetDataSetListMutation } from 'src/pages/redux/apis/baseApi'

import CardBox from 'src/views/settings/CardBox'
import DatasetTable from 'src/@core/components/table/DatasetTable'

export default function Page() {
    const user = useSelector(state => state.userState.user)
    const projectList = useSelector(state => state.baseState.projectList)
    const dataSetListFromStore = useSelector(state => state.baseState.dataSetList) || []

    const [currentCategory, setCurrentCategory] = useState('All')
    const [dataSetList, setDataSetList] = useState(dataSetListFromStore)

    const [getDataSetList] = useGetDataSetListMutation()

    const headCells = [
        { id: 'no', numeric: false, disablePadding: true, label: 'No' },
        { id: 'dataName', numeric: true, disablePadding: false, label: 'Data Name' },
        { id: 'projectType', numeric: true, disablePadding: false, label: 'ProjectType' },
        { id: 'dataType', numeric: true, disablePadding: false, label: 'Data Type' },
        { id: 'dataCreationTime', numeric: true, disablePadding: false, label: 'Data Creation Time' },
        { id: 'detail', numeric: true, disablePadding: false, label: 'Detail' },
    ]

    const categories = ['All', 'Uploaded', 'Noise Filtered','Splitted Data']

    useEffect(() => {
        const filteredDataSetList = currentCategory === 'All' 
            ? dataSetListFromStore 
            : dataSetListFromStore.filter(obj => obj.data_type === currentCategory);

        setDataSetList(filteredDataSetList);
    }, [currentCategory, dataSetListFromStore]);

    useEffect(() => {
        const fetchDataSetList = async () => {
            if (user?.email) {
                const formData = new FormData();
                formData.append('email', user.email);
                formData.append('data_type', currentCategory)
                formData.append('project_name', projectList.length > 0 ? projectList.find(obj => obj._id === localStorage.getItem('project_id'))?.project_name : '');

                try {
                    await getDataSetList(formData).unwrap();
                } catch (error) {
                    toast.error('Something went wrong!');
                }
            }
        }

        fetchDataSetList();
    }, [user, projectList, getDataSetList, currentCategory]);

    return (
        <Box className={CGroups.settings_layout}>
            <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
                <FormControl fullWidth>
                    <InputLabel id='currentCategory'> {'Select Category'} </InputLabel>
                    <Select
                        value={currentCategory}
                        onChange={e => setCurrentCategory(e.target.value)}
                        id='currentCategory'
                        labelId='currentCategory'
                        input={<OutlinedInput label='Category' id='currentCategory' />}
                    >
                        {categories.map(item => (
                            <MenuItem key={item} value={item}> {item} </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <CardBox>
                <DatasetTable
                    headCells={headCells}
                    rows={dataSetList}
                />
            </CardBox>
        </Box>
    )
}