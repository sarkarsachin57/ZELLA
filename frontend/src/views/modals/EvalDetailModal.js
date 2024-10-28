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
import DescriptionIcon from '@mui/icons-material/Description';

import ClassificationTable from 'src/@core/components/table/classification-table'

import ObjectClassificationTable from 'src/@core/components/table/object-detection-classification-table'

import EvalCalssReportTable from 'src/@core/components/table/eval-class-report-table'

import InstanceClassificationTable from 'src/@core/components/table/instance-classification-table'

import SettingPanelHeader from 'src/views/settings/SettingPanelHeader'
import ClassificationBarChart from 'src/@core/components/chart/customChart'

export default function EvalDetailModal (props) {
  const {
    width,
    isOpen,
    isLoading,
    onHandleModalClose,
    data,
    projectType,
    ...rest
  } = props
  console.log("data: ", data)

  const ClassificationType = {
    "Image Classification":<ClassificationTable data =  {data === undefined ? [] : data}/>,
    "Object Detection":<ObjectClassificationTable data =  {data === undefined ? [] : data}/>,
    "Semantic Segmentation":<EvalCalssReportTable data =  {data === undefined ? [] : data}/>,
    "Instance Segmentation":<InstanceClassificationTable basicData =  {data === undefined ? [] : data}/>,
  }
  const selectData = {
    "Instance Segmentation":['MAP','Precision','Recall','number_images','number_instances'],
    "Semantic Segmentation":['FN','FP','IOU','TP','precision','recall'],
    "Object Detection":['MAP','Precision','Recall','number_images','number_instances'],
    "Image Classification":['n_sample','TP','FP','FN','Precision','Recall','Accuracy'],
  }
  const [ barChartData, setBrChartData] = useState({})
  const [ currentClassification, setCurrentClassification] = useState(selectData?.[projectType]?.[0] || '')
  useEffect(() => {
    if (data) {
      if(projectType){
        if(projectType === 'Semantic Segmentation' ){
          const semanticChartData = {
            class_name: [],
            FN: [],
            FP: [],
            IOU: [],
            TP: [],
            precision: [],
            recall: [],
          }
          data !== undefined ?data.map((item, index)=>{
              semanticChartData.class_name[index]= data[index].class_name
              semanticChartData.FN[index]= data[index].FN
              semanticChartData.FP[index]= data[index].FP
              semanticChartData.IOU[index]= data[index].IoU
              semanticChartData.TP[index]= data[index].TP
              semanticChartData.precision[index]= data[index].precision
              semanticChartData.recall[index]= data[index].recall
          }):[]
          
          const classesChartData3 = {
            title: 'Classification Report Chart',
            x: data === undefined ? [] : semanticChartData.class_name,
            xtitle: 'Classes',
            y: data === undefined ? [] : semanticChartData[currentClassification],
            ytitle: currentClassification
          }
          setBrChartData(classesChartData3)
        }
        else if( projectType === 'Image Classification' ){
          const classesChartData3 = {
            title: 'Classification Report Chart',
            x: data === undefined ? [] : data.class_name,
            xtitle: 'Classes',
            y: data === undefined ? [] : data[currentClassification],
            ytitle: currentClassification
          }
          console.log("classesChartData3: ", classesChartData3)
          setBrChartData(classesChartData3)
        }
        else if(projectType === 'Object Detection') {
          const classesChartData3 = {
            title: 'Classification Report Chart',
            x: data === undefined ? [] : data.Classes,
            xtitle: 'Classes',
            y: data === undefined ? [] : data[currentClassification],
            ytitle: currentClassification
          }
          setBrChartData(classesChartData3)
        }
        else if(projectType === 'Instance Segmentation') {
          const classesChartData3 = {
            title: 'Classification Report Chart',
            x: data === undefined ? [] : data.Classes,
            xtitle: 'Classes',
            y: data === undefined ? [] : data[currentClassification],
            ytitle: currentClassification
          }
          setBrChartData(classesChartData3)
          console.log('classesChartData3: ',classesChartData3)
        }
      }
      
    }
  }, [data, currentClassification])

  return (
    <CustomModalLayout
      width = {width}
      isOpen={isOpen}
      title={'Training Result Information'}
      onHandleModalClose={()=>{ onHandleModalClose()}}
    >

      <DialogContent
        sx={{
          overflowY: 'auto',
          maxHeight: '80vh'
        }}    
      >
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
                  selectData[projectType]?.map(item =>{
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
