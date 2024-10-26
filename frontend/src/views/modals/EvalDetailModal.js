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
import EvalCalssReportTable from 'src/@core/components/table/eval-class-report-table'

import SettingPanelHeader from 'src/views/settings/SettingPanelHeader'
import TrainingResultChart from 'src/@core/components/chart/trainingResultChart'
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
  
  const selectData = ['FN','FP','IOU','TP','precision','recall']
  
  const [ barChartData, setBrChartData] = useState({})
  const [ currentClassification, setCurrentClassification] = useState(selectData[0])
  useEffect(() => {
    if (data) {
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
          <EvalCalssReportTable data =  {data === undefined ? [] : data}/>
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
                  selectData.map(item =>{
                    return (<MenuItem value={item}> {item} </MenuItem>)
                  })
                }
              </Select>
            </Grid>
            <Grid item xs={12} sm={12} sx={{ textAlign: 'left' }}>
              { 
                Object.keys(barChartData).length > 0 ?
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
