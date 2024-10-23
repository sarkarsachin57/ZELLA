import React from 'react'
import {useState, useEffect, useRef, useMemo} from 'react'

import CustomModalLayout from './CustomModalLayout'

import DialogContent from '@mui/material/DialogContent'
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
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
import ClassificationBarChart from 'src/@core/components/chart/customChart'
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
  const selectData = {
    "Instance Segmentation":['MAP','Precision','Recall','number_images','number_instances'],
    "Semantic Segmentation":['FN','FP','IOU','TP','precision','recall'],
    "Object Detection":['MAP','Precision','Recall','number_images','number_instances'],
    "Image Classification":['MAP','Precision','Recall','number_images','number_instances'],
  }
  
  const [ historyChartData1, setHistoryChartData1] = useState({})
  const [ historyChartData2, setHistoryChartData2] = useState({})
  const [ barChartData, setBrChartData] = useState({})
  const [ currentClassification, setCurrentClassification] = useState(selectData?.[projectType]?.[0] || '')
  useEffect(() => {
    if (data) {
      if(projectType) {
        const xAxis1 = []
        const series1 = []
        const xAxis2 = []
        const series2 = []
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
          setHistoryChartData1({
            xAxis: xAxis1,
            series: series1,
          })
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
          setHistoryChartData2({
            xAxis: xAxis2,
            series: series2,
          })
          const classesChartData3 = {
            title: 'Classification Report Chart',
            x: data === undefined ? [] : data.classification_report.Classes,
            xtitle: 'Classes',
            y: data === undefined ? [] : data.classification_report[currentClassification],
            ytitle: currentClassification
          }
          setBrChartData(classesChartData3)
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
          setHistoryChartData1({
            xAxis: xAxis1,
            series: series1,
          })
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
          setHistoryChartData2({
            xAxis: xAxis2,
            series: series2,
          })
          const classesChartData3 = {
            title: 'Classification Report Chart',
            x: data === undefined ? [] : semanticChartData.class_name,
            xtitle: 'Classes',
            y: data === undefined ? [] : semanticChartData[currentClassification],
            ytitle: currentClassification
          }
          setBrChartData(classesChartData3)
          console.log('classesChartData3: ',classesChartData3)
          console.log('barChartData: ', barChartData)
        }
        else if(projectType === 'Object Detection') {
          series1 = [
            {
              data: data === undefined ? [] : data.history.class_loss,
              label: "Class Loss"
            },
            {
              data: data === undefined ? [] : data.history.box_loss,
              label: "Box Loss"
            }
          ]
          xAxis1 = [
            {
              scaleType: 'point',
              data: data === undefined ? [] : data.history.epochs,
            }
          ]
          setHistoryChartData1({
            xAxis: xAxis1,
            series: series1,
          })
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
          setHistoryChartData2({
            xAxis: xAxis2,
            series: series2,
          })
          const classesChartData3 = {
            title: 'Classification Report Chart',
            x: data === undefined ? [] : data.classification_report.Classes,
            xtitle: 'Classes',
            y: data === undefined ? [] : data.classification_report[currentClassification],
            ytitle: currentClassification
          }
          setBrChartData(classesChartData3)
        }
        else if(projectType === 'Image Classification') {
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
          setHistoryChartData1({
            xAxis: xAxis1,
            series: series1,
          })
          series2 = [
            {
              data: data === undefined ? [] : data.history.train_acc,
              label: "Train ACC"
            },
            {
              data: data === undefined ? [] : data.history.val_acc,
              label: "Vall ACC"
            },
          ]
          xAxis2 = [
            {
              scaleType: 'point',
              data: data === undefined ? [] : data.history.epochs,
            }
          ]
          setHistoryChartData2({
            xAxis: xAxis2,
            series: series2,
          })
          const classesChartData3 = {
            title: 'Classification Report Chart',
            x: data === undefined ? [] : data.classification_report.Classes,
            xtitle: 'Classes',
            y: data === undefined ? [] : data.classification_report[currentClassification],
            ytitle: currentClassification
          }
          setBrChartData(classesChartData3)
        }
      }
    }
  }, [data, currentClassification])

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
          <Grid container spacing={12}>
            <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
              <InputLabel id='currentClassification'> {'Select View Data'} </InputLabel>
              <Select
                value={currentClassification}
                onChange={e => setCurrentClassification(e.target.value)}
                id='currentClassification'
                labelId='currentClassification'
                input={<OutlinedInput label='View Data' id='currentClassification' />}
              >
                {
                  selectData[projectType].map(item =>{
                    return (<MenuItem value={item}> {item} </MenuItem>)
                  })
                }
              </Select>
            </Grid>
            <Grid item xs={12} sm={12} sx={{ textAlign: 'left' }}>
              { Object.keys(barChartData).length > 0 ?
                  <ClassificationBarChart
                      chartData = {barChartData}
                  />
                  :<Typography variant="button" gutterBottom sx={{ display: 'block',}}>
                        No Data
                  </Typography>
              }
            </Grid>
          </Grid>
        </CardContent>
      </DialogContent>
    </CustomModalLayout>
  )
}
