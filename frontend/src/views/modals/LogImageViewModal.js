import * as React from 'react';
import clsx from 'clsx';
import { styled, Box } from '@mui/system'
import ModalUnstyled from '@mui/base/ModalUnstyled'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'

const BackdropUnstyled = React.forwardRef((props, ref) => {
  const { open = false, className, ...other } = props;

  return (
    <div
      className={clsx({ 'MuiBackdrop-open': open }, className)}
      ref={ref}
      {...other}
    />
  );
});

const Modal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled(BackdropUnstyled)`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(100, 100, 100, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

export default function LogImageViewModal(props) {
  const {
    isOpen = false,
    onHandleModalClose,
    logInfo = {},
  } = props;

  const style = (theme) => ({
    bgcolor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
    border: '2px solid currentColor',
    padding: '16px 24px 24px 24px',
    position: 'relative',
    textAlign: 'center',
    borderRadius: '10px'
  });

  const style_list = theme => ({
    margin: '2px 0px',
    '&:hover': {
      opacity: 0.3
    }
  })

  const classwise_fp_data_keys = Object.keys(logInfo.classwise_fp || {})
  const classwise_fp_data_values = Object.values(logInfo.classwise_fp || {})

  const classwise_fn_data_keys = Object.keys(logInfo.classwise_fn || {})
  const classwise_fn_data_values = Object.values(logInfo.classwise_fn || {})
  return (
    <div>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isOpen}
        onClose={onHandleModalClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <Box sx={{textAlign: 'center'}}>
              <Typography sx={{color: 'white'}}>
                  { logInfo.content }
              </Typography>
              <IconButton aria-label="close"
                  onClick={onHandleModalClose}
                  sx={{ position: 'absolute', right: 8, top: 8,}}
              >
              <CloseIcon />
              </IconButton>
          </Box>
          <Typography
            variant='body2' 
            sx={{ fontSize: '1.5rem'}}
          >
            Media Name: { logInfo.media_name }
          </Typography>
          <img
              style= {{padding: '10px'}}
              src={`http://localhost:5000/${logInfo.error_frame_path}`} 
              className="App-logo" 
              alt="logo" 
          />
          <List sx={{ width: '100%', marginTop: '5px', overflowX: 'auto' }}> 
              <ListSubheader sx={{ display: 'flex', justifyContent: 'left', style }}>
                {/* Header Labels */}
                <ListItemText
                  primary="Total Instances"
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <ListItemText
                  primary="Total False Positives"
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <ListItemText
                  primary="Total False Negatives"
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <ListItemText
                  primary="False Positive Classes"
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <ListItemText
                  primary="False Positive Classes Count"
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <ListItemText
                  primary="False Negative Classes"
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <ListItemText
                  primary="False Negative Classes Count"
                  sx={{ width: '16%', textAlign: 'center'}}
                />
              </ListSubheader>
              
              <ListItem
                sx={style_list}
                disablePadding
              >
                <ListItemText
                  primary={ logInfo.n_fp + logInfo.n_fn }
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <ListItemText
                  primary={ logInfo.n_fp }
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <ListItemText
                  primary={ logInfo.n_fn }
                  sx={{ width: '14%', textAlign: 'center'}}
                />
                <div style={{ width: '14%', textAlign: 'center' }}>
                  { classwise_fp_data_keys.map( classwise_fp_data_key => (
                        <ListItemText primary={ classwise_fp_data_key } />))}   
                </div>
                <div style={{ width: '14%', textAlign: 'center' }}>
                  { classwise_fp_data_values.map( classwise_fp_data_value => (
                        <ListItemText primary={ classwise_fp_data_value } />))}   
                </div>
                <div style={{ width: '14%', textAlign: 'center' }}>
                  { classwise_fn_data_keys.length? classwise_fn_data_keys.map( classwise_fn_data_key => (
                        <ListItemText primary={ classwise_fn_data_key } />)): <ListItemText primary='none'/> }   
                </div>
                <div style={{ width: '16%', textAlign: 'center' }}>
                  { classwise_fn_data_values.length? classwise_fn_data_values.map( classwise_fn_data_value => (
                        <ListItemText primary={ classwise_fn_data_value } />)): <ListItemText primary='none'/>}   
                </div>
                
                {/* <div style={{ width: '20%', textAlign: 'center' }}>
                  { classwise_fp_dataArr.map( classwise_fp_data => (
                        <ListItemText primary={ classwise_fp_data } />) ) }   
                </div>                                
                <div style={{ width: '20%', textAlign: 'center' }}>
                  { classwise_fn_dataArr.map( classwise_fn_data => (
                        <ListItemText primary={ classwise_fn_data } />) ) }   
                </div> */}
              </ListItem>
            </List>
        </Box>
      </Modal>
    </div>
  );
}
