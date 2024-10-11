import React from 'react'
import {useState, useEffect, useRef, useMemo} from 'react'

import CustomModalLayout from './CustomModalLayout'

import DialogContent from '@mui/material/DialogContent'
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import DescriptionIcon from '@mui/icons-material/Description';

import HistoryTable from 'src/@core/components/table/history-table'
import ClassificationTable from 'src/@core/components/table/classification-table'
import SettingPanelHeader from 'src/views/settings/SettingPanelHeader'

export default function ImageClassModal (props) {
  const {
    width,
    isOpen,
    isLoading,
    onHandleModalClose,
    data,
    ...rest
  } = props
  console.log('data: ', data)
  
  
  const ref = useRef(null)
  const videoRef = useRef(null)

  const [ points, setPoints ] = useState([]);
  const [ trackerRect, setTrackerRec ] = useState({})
  const [dim, setDim] = useState({width: 500, height: 281});
  const [targetName, setTargetName] = useState('');
  const [frame, setFrame ] = useState(null)
  const [captureTime, setCaptureTime] = useState(-1)
  const [ROIList, setROIList] = useState([])

  return (
    <CustomModalLayout
      width = {width}
      isOpen={isOpen}
      // isLoading={isLoading}
      title={'Training Result Information'}
      // btnName={'Done'}
      onHandleModalClose={()=>{ onHandleModalClose()}}
      // onHandleSubmit={ onHandleSubmitWithData }
    >

      <DialogContent>
        <SettingPanelHeader icon={<WorkHistoryIcon />} title={'History'} />
        <CardContent
        sx = {{
          // margin: '6px',
          textAlign:'center',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <HistoryTable
            data = { data === undefined ? [] : data.history }
          />
        </CardContent>
        <SettingPanelHeader icon={<DescriptionIcon />} title={'Classification Report'} />
        <CardContent
        sx = {{
          // margin: '6px',
          textAlign:'center',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <Box sx={{textAlign: 'center'}}>
            <ClassificationTable 
              data =  {data === undefined ? [] : data.classification_report}
            />
          </Box>
        </CardContent>
      </DialogContent>
    </CustomModalLayout>
  )
}
