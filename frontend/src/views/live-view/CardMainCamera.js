//  ** import custom styles
import CGroups from '../../../styles/pages/live-view.module.scss'

import { useState } from 'react';

// ** MUI Imports
import { styled } from '@mui/material/styles'
import * as React from 'react';
import Button from '@mui/material/Button'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton'
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete'
import CustomSwitch from 'src/components/AntSwitch';

// import the mui icons

import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { trimedStr } from 'src/helpers/utils'
import {TRACKING_MODE, TRUST_METHOD, TRUST_VIEWMODE} from 'src/constants'

const SplitScreenIcon = styled('img')((theme)=>({
  height: '24px',
  width: '24px',
  marginRight: '2em',
  padding: '10px auto',
}))

/**
 * Assign the project to an employee.
 * @param {Object} props - properties
*/
const CardCamera = (props) => {
  const {
    handleActiveChange,
    handleRemoveCamera,
    cam_info,
    loading = false,
    height = '100%',
    isActive = true,
    user = null,
    isMute = false,
    isHD = false,
    isZoom = false,
    onInitModalOpen
  } = props;
  const [hash, setHash] = useState(Date.now())
  const [viewMode, setViewMode] = useState(TRUST_VIEWMODE.detect)

  const handleViewMode = () => {
    const updatedViewMode = viewMode === TRUST_VIEWMODE.detect ? TRUST_VIEWMODE.correct : TRUST_VIEWMODE.detect
    setViewMode(updatedViewMode)
  }
  console.log('===cam info===>', cam_info)  
  return (
    <Card className={ CGroups.cardCamera } sx={{ m: 2, padding: '10px', fontSize: isActive ? "16px": "12px", border: '1px solid #804BDF', borderRadius: '20px'}}>
        <Box sx = {{ display: "flex", justifyContent: "space-between",  alignItems: "center",}}  onClick = {()=> handleActiveChange(cam_info)}>
          <Box sx={{display: 'flex'}}>
              <VideocamOutlinedIcon sx={{ marginRight: '8px', fontSize: '2em'}}/>
              <Typography sx={{lineHeight: '36px', fontFamily: 'Inter',textAlign: "center",fontSize: "1em", lineHeight: "2em", color: "#FFFFFF"}}>
              { trimedStr(cam_info.camera_name,8) }
              </Typography>
          </Box>
          <Box sx={{display: 'flex', alignItems:'center'}}>

          {cam_info.method === TRUST_METHOD.detection?
              <CustomSwitch 
                rightLabel="detect" 
                leftLabel="correct" 
                handleSwitchToggle={handleViewMode} 
                value={viewMode} 
                checked={viewMode=== TRUST_VIEWMODE.detect}
              />  : null  
          }
          { cam_info.method === TRUST_METHOD.tracking && cam_info.tracking_mode === "sot" ?
            <Button 
              size="small"
              variant='contained'
              onClick={onInitModalOpen}
            >
              Initialize
            </Button>: null 
          }
          
              
            { isActive ? <RadioButtonCheckedIcon sx={{ marginRight: '8px', fontSize: '2em', color: '#804BDF'}}/>: <RadioButtonUncheckedIcon sx={{ marginRight: '8px', fontSize: '2em', color: '#804BDF'}}/>}
            <Typography sx={{lineHeight: '28px', textAlign: 'center', fontSize: '0.75em', marginRight: '8px', backgroundColor: '#804BDF', padding: '0px 4px', borderRadius: '8px', whiteSpace: 'nowrap', textOverflow:'hidden'}}>
                {cam_info.method === TRUST_METHOD.tracking? TRACKING_MODE[cam_info.tracking_mode]?.toUpperCase(): 'Detection'}
            </Typography>
            <IconButton aria-label='delete' onClick={handleRemoveCamera}><DeleteIcon/></IconButton> 
          </Box>
        </Box>
        {/* <Box className={ CGroups.card_header}>
          <Box sx={{display: 'flex'}}>
            <VideocamOutlinedIcon sx={{marginLeft: '24px', marginRight: '8px', fontSize: '2em'}}/>
            <Typography className={ CGroups.right_name } varient="h5">
                Backyard Camera
            </Typography>
          </Box>
          <Box sx = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography varient="h5" sx={{marginRight: '3em', color: '#FF0000', fontSize: '1em', lineHeight:'32px'}}>
                LIVE
            </Typography>
          </Box>
        </Box> */}
      <ButtonBase
        className = {CGroups.contentBase}
        onClick = {()=> handleActiveChange(cam_info)}
      >
        <CardContent
          sx = {{
            margin: '6px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: height,
            width: '100%'
            }}>
          { loading ? (
            <Skeleton sx={{ height: '40vh', borderRadius: '20px'}} animation="wave" variant="rectangular" />
          ) : (

            // <CardMedia
            //   component="video"
            //   className={ CGroups.cardMedia }

            //   // src="/videos/222.webm"
            //   // autoPlay
            //   controls
            //   image={"/videos/222.webm?autoplay=1&mute"}
            //   alt="camera video stream"
            // />
            <img
              width = {'100%'}
              height = {'100%'}

              // width = { isActive ? '500px': '250px'}
              // height = {isActive ? '281px': '125px'}
              // style= {{ objectFit: 'scale-down'}}
              // src={`http://localhost:5000/python-app/show-frames/${cam_info.camera_name}?`+ new Date().getTime()}
              // src={`http://localhost:5000/python-app/show-frames/${cam_info.camera_name}`}
              src = {
                cam_info.method === TRUST_METHOD.tracking ?
                  `http://localhost:5000/python-app/show-frames/object-tracking/${cam_info.camera_name}`: 
                (
                  viewMode === TRUST_VIEWMODE.detect ? 
                  `http://localhost:5000/python-app/show-frames/object-detection/${cam_info.camera_name}/detect` :
                  `http://localhost:5000/python-app/show-frames/object-detection/${cam_info.camera_name}/correct`
                )
                }
              alt="logo"
            />
          )}
        </CardContent>
        {/* <Box className = { CGroups.camera_status_box }
          sx={{backgroundColor: cam_info.status == 0 ? "#FFFFFF00": "#FF0000"}}
        >
          {
            cam_info.status == 0 ?
            <Box sx={{display: 'none'}}></Box> :
            cam_info.status == 1 ?
            <WarningAmberRoundedIcon className={ CGroups.camera_status_icon} /> :
            <HourglassEmptyRoundedIcon className={ CGroups.camera_status_icon} />
          }
        </Box> */}
      </ButtonBase>
    </Card>
  );
}

export default CardCamera;
