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

import ObjectHistoryTable from 'src/@core/components/table/object-detection-history-table'
import ObjectClassificationTable from 'src/@core/components/table/object-detection-classification-table'

import SegmentationHistoryTable from 'src/@core/components/table/segmentation-history-table'
import SegmentationClassificationTable from 'src/@core/components/table/segmentation-classification-table'

import InstanceHistoryTable from 'src/@core/components/table/instance-history-table'
import InstanceClassificationTable from 'src/@core/components/table/instance-classification-table'

import SettingPanelHeader from 'src/views/settings/SettingPanelHeader'

export default function ImageClassModal (props) {
  const {
    width,
    isOpen,
    isLoading,
    onHandleModalClose,
    data,
    projectType,
    ...rest
  } = props
  console.log('project_type: ', projectType)
  const HistoryType = {
    "Image Classification":<HistoryTable data = { data === undefined ? [] : data.history } />,
    "Object Detection":<ObjectHistoryTable data = { data === undefined ? [] : data.history } />,
    "Semantic Segmentation":<SegmentationHistoryTable data = { data === undefined ? [] : data.history } />,
    "Instance Segmentation":<InstanceHistoryTable data = { data === undefined ? [] : data.history } />,
  }
  const ClassificationType = {
    "Image Classification":<ClassificationTable data =  {data === undefined ? [] : data.classification_report}/>,
    "Object Detection":<ObjectClassificationTable data =  {data === undefined ? [] : data.classification_report}/>,
    "Semantic Segmentation":<SegmentationClassificationTable data =  {data === undefined ? [] : data.classification_report}/>,
    "Instance Segmentation":<InstanceClassificationTable basicData =  {data === undefined ? [] : data.classification_report}/>,
  }
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
          {
            projectType??HistoryType[projectType]?
            (HistoryType[projectType]): null
          }
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
          {
            projectType??ClassificationTable[projectType]?
            (ClassificationType[projectType]): null
          }
        </CardContent>
      </DialogContent>
    </CustomModalLayout>
  )
}
