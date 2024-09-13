import React from 'react'
import {useState, useEffect, useRef, useMemo} from 'react'

import CGroups from '../../../styles/pages/live-view.module.scss'

import {Layer, Rect, Stage, Group, Image, Circle, Star} from 'react-konva';
import Konva from 'konva';
import { toast } from 'react-toastify';

import CustomModalLayout from './CustomModalLayout'

import DialogContent from '@mui/material/DialogContent'
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField'
import { ROI_THRESHOLD } from 'src/constants';
import { abs } from 'src/@core/helpers/utils'

export default function InitializeModal (props) {
  const {
    width,
    isOpen,
    isLoading,
    onHandleModalClose,
    onHandleSubmit,
    stream_url,
    camera_info,
    ...rest
  } = props

  const ref = useRef(null)
  const [ points, setPoints ] = useState([]);
  const [ trackerRect, setTrackerRec ] = useState({})
  const [dim, setDim] = useState({width: 800, height: 500});
  const [targetName, setTargetName] = useState('');

  const validate = () => {
    if ( targetName === '' ) { toast.error('Please enter the target name'); return false;}
    if ( trackerRect === {} || points == []) {toast.error('Please draw target Box aronnd the target'); return false }
    if ( abs(trackerRect?.width ?? 0) < ROI_THRESHOLD || abs(trackerRect?.height ?? 0) < ROI_THRESHOLD) {toast.error('Please draw a valid size of the bounding box'); return false }
    return true;
  }

  const onHandleSubmitWithData = ()=>{
    if ( !validate() ) return; 

    console.log("onHandleSubmit with data===>")
    console.log(trackerRect);

    onHandleSubmit({
      targetName: targetName,
      frame_w: dim.width,
      frame_h: dim.height,
      bbox: trackerRect,
    })
    setPoints([]);
    setTrackerRec({});
  }

  const memoizedValue = useMemo(() => {
    if(ref.current != undefined) {
      console.log(ref.current.width, ref.current.height)
      setDim({
        width: ref.current.width ?? 800,
        height: ref.current.height ?? 500
      })
    }
  }
, [ref.current?.width, ref.current?.width]);

  const handleMouseDown = event => {
    const {x, y} = event.target.getStage().getPointerPosition();
    setTrackerRec({
      x, y, width: 0, height: 0,
    })
    if (points?.length > 1) {
      setPoints([]);
    }
    points.push({x, y})

  }

  const handleMouseUp = event => {
    if (points?.length == 1) {
      const sx = points[0].x;
      const sy = points[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      setTrackerRec({
        x: sx, y: sy, width: x-sx, height: y-sy
      })
      setPoints([]);
    }
  }

  const handleMouseMove = event => {
    if (points?.length == 1) {
      const sx = points[0].x;
      const sy = points[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      setTrackerRec({
        x: sx, y: sy, width: x-sx, height: y-sy
      })
    }
  }

  return (
    <CustomModalLayout
      width = {width}
      isOpen={isOpen}
      isLoading={isLoading}
      title={'Draw a Bounding box to initialize the Target'}
      btnName={'Done'}
      onHandleModalClose={onHandleModalClose}
      onHandleSubmit={onHandleSubmitWithData}
    >
      { camera_info ?
        <DialogContent>
          <CardContent
          sx = {{
            margin: '6px',
            textAlign:'center',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            minHeight: '281px',
          }}>
            { 1 == 0 ? (
              <Skeleton sx={{ height: height, borderRadius: '20px'}} animation="wave" variant="rectangular" />
            ) : (

              <img
                ref = {ref}
                style= {{position: 'absolute', left: 0, top: '16px', width: '100%'}}
                src={`http://localhost:5000/python-app/will-initialize/${camera_info.camera_name}`} className="App-logo" alt="logo" />
            )}
            <Stage
              onMouseDown = { handleMouseDown }
              onMouseUp = { handleMouseUp }
              onMOuseMove = { handleMouseMove }
              width={dim.width}
              height={dim.height}
            >
              <Layer>
                <Rect
                  x={trackerRect?.x}
                  y={trackerRect?.y}
                  width={trackerRect?.width}
                  height={trackerRect?.height}
                  fill="transparent"
                  stroke="red"
                />
              </Layer>
            </Stage>

          </CardContent>
          <Box sx={{textAlign: 'center'}}>
            <TextField
                autoFocus
                value={targetName}
                onChange={e => setTargetName(e.target.value)}
                margin='dense'
                id='target_name'
                label='Target Name'
                type='text'
                sx={{width: '60%'}}
                variant='standard'
              />
          </Box>
        </DialogContent>
        :
        <></>
      }
    </CustomModalLayout>
  )
}
