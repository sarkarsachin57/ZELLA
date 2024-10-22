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
  console.log('data: ', data)
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
  const classesChartData3 = {}
  const classesChartData4 = {}
  if(projectType) {
    const xAxis1 = []
    const series1 = []
    const xAxis2 = []
    const series2 = []
    const xAxis3 = []
    const series3 = []
    const xAxis4 = []
    const series4 = []
    if(projectType === 'Instance Segmentation') {
      series1 = [
        {
          data: data === undefined ? [] : data.history.class_loss,
          label: "Class Loss"
        },
        {
          data: data === undefined ? [] : data.history.seg_loss,
          label: "Seg Loss"
        }
      ]
      xAxis1 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : data.history.epochs,
        }
      ]
      series2 = [
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
      xAxis2 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : data.history.epochs,
        }
      ]
      series3 = [
        {
          data: data === undefined ? [] : data.classification_report.number_images,
          label: "Number Images"
        },
        {
          data: data === undefined ? [] : data.classification_report.number_instances,
          label: "Number Instances"
        },
      ]
      xAxis3 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : data.classification_report.Classes,
        }
      ]
      series4 = [
        {
          data: data === undefined ? [] : data.classification_report.Precision,
          label: "Precision"
        },
        {
          data: data === undefined ? [] : data.classification_report.Recall,
          label: "Recall"
        },
        {
          data: data === undefined ? [] : data.classification_report.MAP,
          label: "MAP"
        }
      ]
      xAxis4 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : data.classification_report.Classes,
        }
      ]
    }
    else if(projectType === 'Semantic Segmentation'){
      const semanticChartData = {
        class_name: [],
        FN: [],
        FP: [],
        IOU: [],
        TP: [],
        precision: [],
        recall: [],
      }
      data !== undefined ?data.classification_report.map((item, index)=>{
          semanticChartData.class_name[index]= data.classification_report[index].class_name
          semanticChartData.FN[index]= data.classification_report[index].FN
          semanticChartData.FP[index]= data.classification_report[index].FP
          semanticChartData.IOU[index]= data.classification_report[index].IoU
          semanticChartData.TP[index]= data.classification_report[index].TP
          semanticChartData.precision[index]= data.classification_report[index].precision
          semanticChartData.recall[index]= data.classification_report[index].recall
      }):[]
      series1 = [
        {
          data: data === undefined ? [] : data.history.train_loss,
          label: "Train Loss"
        },
        {
          data: data === undefined ? [] : data.history.val_loss,
          label: "Val Loss"
        }
      ]
      xAxis1 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : data.history.epochs,
        }
      ]
      series2 = [
        {
          data: data === undefined ? [] : data.history.train_iou,
          label: "Train IOU"
        },
        {
          data: data === undefined ? [] : data.history.val_iou,
          label: "Val IOU"
        },
        {
          data: data === undefined ? [] : data.history.val_class_average_iou,
          label: "Average IOU"
        }
      ]
      xAxis2 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : data.history.epochs,
        }
      ]
      series3 = [
        {
          data: data === undefined ? [] : semanticChartData.FN,
          label: "FN"
        },
        {
          data: data === undefined ? [] : semanticChartData.FP,
          label: "FP"
        },
        {
          data: data === undefined ? [] : semanticChartData.TP,
          label: "TP"
        },
        {
          data: data === undefined ? [] : semanticChartData.TP,
          label: "IOU"
        },
      ]
      xAxis3 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : semanticChartData.class_name,
        }
      ]
      series4 = [
        {
          data: data === undefined ? [] : semanticChartData.precision,
          label: "Precision"
        },
        {
          data: data === undefined ? [] : semanticChartData.recall,
          label: "Recall"
        },
      ]
      xAxis4 = [
        {
          scaleType: 'point',
          data: data === undefined ? [] : semanticChartData.class_name,
        }
      ]
    }
    
    historyChartData1 = {
      xAxis: xAxis1,
      series: series1,
    }
    historyChartData2 = {
      xAxis: xAxis2,
      series: series2,
    }
    classesChartData3 = {
      xAxis: xAxis3,
      series: series3,
    }
    classesChartData4 = {
      xAxis: xAxis4,
      series: series4,
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
            <TrainingResultChart 
              historyChartData={historyChartData1} 
              width = {1000}
            />
          ) : (
            "No Data"
          )}
          {Array.isArray(historyChartData2.xAxis) && historyChartData2.xAxis.length > 0 ? (
            <TrainingResultChart 
              historyChartData={historyChartData2} 
              width = {1000}
            />
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
        <CardContent
        sx = {{
          // margin: '6px',
          textAlign:'center',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {Array.isArray(classesChartData3.xAxis) && classesChartData3.xAxis.length > 0 ? (
            <TrainingResultChart 
              historyChartData={classesChartData3} 
              width = {500}
            />
          ) : (
            "No Data"
          )}
          {Array.isArray(classesChartData4.xAxis) && classesChartData4.xAxis.length > 0 ? (
            <TrainingResultChart 
              historyChartData={classesChartData4} 
              width = {500}
            />
          ) : (
            "No Data"
          )}
        </CardContent>
      </DialogContent>
    </CustomModalLayout>
  )
}
