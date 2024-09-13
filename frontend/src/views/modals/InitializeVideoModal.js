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
import ReactPlayer from 'react-player';
import { captureVideoFrame } from 'src/helpers/utils';
import { ROI_THRESHOLD, ALWAYES_PROCESS_RAW} from 'src/constants';
import { abs } from 'src/@core/helpers/utils';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraIcon from '@mui/icons-material/Camera';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';


const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

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
  const videoRef = useRef(null)

  const [ points, setPoints ] = useState([]);
  const [ trackerRect, setTrackerRec ] = useState({})
  const [dim, setDim] = useState({width: 500, height: 281});
  const [targetName, setTargetName] = useState('');
  const [frame, setFrame ] = useState(null)
  const [captureTime, setCaptureTime] = useState(-1)
  const [ROIList, setROIList] = useState([])

  const modifyVideoPath = (vid_path)=>{
    if (ALWAYES_PROCESS_RAW ) {
      let _vid_path =  vid_path?.replace('/offline/', '/offline_raw/');
      _vid_path = _vid_path?.replace('\\offline\\', '\\offline_raw\\')
      console.log("---modify video path--", _vid_path)
      return _vid_path;
    }
    return vid_path;
  }

  const validate = () => {
    if ( targetName === '' ) { toast.error('Please enter the target name.'); return false;}
    if ( captureTime === -1 || frame == null ) { toast.error('Please captue the Frame.'); return false }
    if ( trackerRect === {} || points == []) { toast.error('Please draw target Box aronnd the target.'); return false }
    console.log("*********tracker rectanlge test", trackerRect?.width ?? 0,  abs(trackerRect?.width ?? 0), ROI_THRESHOLD, trackerRect?.height ?? 0, abs(trackerRect?.height ?? 0))
    if ( abs(trackerRect?.width ?? 0) < ROI_THRESHOLD || abs(trackerRect?.height ?? 0) < ROI_THRESHOLD) {toast.error('Please draw a valid size of the bounding box'); return false }
    return true;
  }

  const isNameDuplicated = () => {
    if (ROIList.length !==0 && ROIList.find(el => el.target_name === targetName) !== undefined) return true;
    return false
  }

  const onHandleSubmitWithData = ()=>{
    if (ROIList.length === 0) {
      toast.error('Please select at least one target.');
      return;
    } 
    console.log("********** onHandleSubmit with data===>")
    console.log(trackerRect);
    const _data = {
      frame_w: dim.width,
      frame_h: dim.height,
      init_info: {target_list: ROIList},
    }
    console.log('========> _data, before send the data', _data)
    onHandleSubmit(_data)
  }

  useEffect(()=>{
    setDim({
      width: ref.current?.width ?? 500,
      height: ref.current?.height ?? 281
    })
  }, [])

//   const memoizedValue = useMemo(() => {
//     if(ref.current != undefined) {
//       console.log('======> momoized value===>')
//       console.log(ref.current.width, ref.current.height)
//       setDim({
//         width: ref.current.width ?? 500,
//         height: ref.current.height ?? 281
//       })
//     }
//   }
// , [ref.current?.width, ref.current?.width]);

  useEffect(() => {
    if(ref.current != undefined) {
      console.log('======> momoized value===>')
      console.log(ref.current.width, ref.current.height)
      setDim({
        width: ref.current.width ?? 500,
        height: ref.current.height ?? 281
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

  const captureFrame = () =>{
    console.log('OK');
    const _time = videoRef.current?.getCurrentTime();
    console.log("current time=====>", _time, videoRef.current.props.height, videoRef.current.props.width);
    setCaptureTime(_time);
    const _frame = captureVideoFrame(videoRef.current.getInternalPlayer())
    let _height= videoRef.current.props.height;
    console.log('===>', _height)
    setDim({
      ...dim, height: parseFloat(_height)
    })
    _height = _height.match(/\d+/)[0]
    setFrame(_frame)
    console.log('=============> when clicking the capture button', _height, ref.current, videoRef.current.getAttributes())
    console.log('frame=====>', _frame)
  }

  const addROI = () => {
    if ( !validate() ) return; 
    if ( isNameDuplicated ()) {
      toast.error('Please use another target name. Already Used!')
      return;
    }
    console.log("********** onHandleSubmit with data===>")
    console.log(trackerRect);
    const _ROIData = {
      timestamp: captureTime,
      target_name: targetName,
      bbox: trackerRect,
    }
    const _ROIList = [...ROIList, _ROIData];
    setROIList(_ROIList)
    initializeForm();
    console.log('=============> capture data, _data:', _ROIList)
  }

  const handleDeleteROI = (roi) => {
    const _ROIList = ROIList.filter((el) => el.target_name !== roi.target_name);
    console.log('handle delete ROI =====> ', _ROIList, ROIList)
    setROIList(_ROIList)
  }

  const cancelFrame = () =>{
    setCaptureTime(-1);
    setFrame(null)
  }
  const initializeForm = ()=>{
    cancelFrame();
    setPoints([]);
    setCaptureTime(-1);
    setTargetName('');
    setTrackerRec({});
  }


  return (
    <CustomModalLayout
      width = {width}
      isOpen={isOpen}
      isLoading={isLoading}
      title={'Capture a frame and draw a box to initialize the Target.'}
      btnName={'Done'}
      onHandleModalClose={()=>{ initializeForm(); onHandleModalClose()}}
      onHandleSubmit={ onHandleSubmitWithData }
    >
      <DialogContent>
        <CardContent
        sx = {{
          // margin: '6px',
          textAlign:'center',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '281px',
        }}>
            {frame && 
              <img
                ref = {ref}
                style= {{position: 'absolute', left: '0px', top: '4px', padding: '1rem'}}
                width="100%"
                // height="100px"
                // src={`http://localhost:5000/python-app/will-initialize/${camera_info.camera_name}`} className="App-logo" alt="logo" 
                src={frame?.dataUri}
              />
            }
          
            {!frame && <ReactPlayer
              ref = {videoRef}
              sx={{ position: 'absolute', left:0, top: 0, borderRadius: '8px',}}
              // style={{marginTop: '15px', background:'#ccc'}}
              // showPortrait
              background={true}
              playing={false} 
              controls={true}
              width='100%'
              // height='500px'
              config={{ file: { attributes: {
                crossOrigin: 'anonymous'
              }}}}
              url={`http://localhost:5000/${modifyVideoPath(camera_info?.video_path_track)}`}
              // url={`https://cdnapisec.kaltura.com/p/2507381/sp/250738100/embedIframeJs/uiconf_id/44372392/partner_id/2507381?iframeembed=true&playerId=kaltura_player_1605622074&entry_id=1_jz404fbl`}
            />}
            
          {frame && <Stage
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
          </Stage>}

        </CardContent>
        {/* Add ROI and Capture Frame Button */}
        <Box sx={{display: 'flex', justifyContent: 'space-around', marginTop: '40px'}}>
          
          <TextField
            autoFocus
            value={targetName}
            onChange={e => setTargetName(e.target.value)}
            id='target_name'
            label='TARGET NAME'
            type='text'
            variant='standard'
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" endIcon={<AddIcon />} onClick = {()=> addROI()}>
              Add
            </Button>
            {frame == null ? 
            <Button variant="contained" color="error" endIcon = {<CameraIcon/>} onClick={() => captureFrame()}> {`Capture Frame`}</Button> :
            <Button variant="contained" color="error" endIcon = {<CameraIcon/>} onClick={() => cancelFrame()}> {`Cancel Frame`}</Button> 
          }
          </Stack>
        </Box>
        {/* ROI list */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
          }}
          component="ul"
        >
          {ROIList.map((roi, idx) => {
            return (
              <ListItem key={idx}>
                <Chip
                  label={roi.target_name}
                  onDelete={()=> handleDeleteROI(roi)}
                />
              </ListItem>
            );
          })}
        </Box>
      </DialogContent>
    </CustomModalLayout>
  )
}
