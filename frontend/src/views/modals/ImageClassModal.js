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
import TrainingResultChart from 'src/@core/components/chart/trainingResultChart'
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
  const historyChartData1 = {}
  const historyChartData2 = {}
  if(projectType) {
    if(projectType === 'Instance Segmentation') {
      const series1 = [
        {
          data: data === undefined ? [] : data.history.class_loss,
          label: "Class Loss"
        },
        {
          data: data === undefined ? [] : data.history.seg_loss,
          label: "Seg Loss"
        }
      ]
      
      const xAxis1 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : data.history.epochs,
        }
      ]
      const series2 = [
        {
          data: data === undefined ? [] : data.history.precision,
          label: "Precision"
        },
        {
          data: data === undefined ? [] : data.history.recall,
          label: "Recall"
        },
        {
          data: data === undefined ? [] : data.history.MAP,
          label: "MAP"
        }
      ]
      
      const xAxis2 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : data.history.epochs,
        }
      ]
    }
    else {
      const xAxis1 = []
      const series1 = []
      const xAxis2 = []
      const series2 = []
    }
    
    historyChartData1 = {
      xAxis: xAxis1,
      series: series1,
    }
    historyChartData2 = {
      xAxis: xAxis2,
      series: series2,
    }
  }
  console.log("historyChartData: ", historyChartData1)
  console.log("historyChartData: ", historyChartData2)
  

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

      <DialogContent
        sx={{
          overflowY: 'auto',
          maxHeight: '80vh'
        }}    
      >
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
        <CardContent
        sx = {{
          // margin: '6px',
          textAlign:'center',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {Array.isArray(historyChartData1.xAxis) && historyChartData1.xAxis.length > 0 ? (
            <TrainingResultChart historyChartData={historyChartData1} />
          ) : (
            "No Data"
          )}
          {Array.isArray(historyChartData2.xAxis) && historyChartData2.xAxis.length > 0 ? (
            <TrainingResultChart historyChartData={historyChartData2} />
          ) : (
            "No Data"
          )}
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
