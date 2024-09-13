import CGroups from '../../../styles/pages/settings.module.scss'

import * as React from 'react';
import clsx from 'clsx';
import { styled, Box, Theme } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from 'src/@core/components/button/LoadingButton';

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



export default function VideoModal(props) {

    const {
      isOpen = false,
      onHandleModalClose,
      videoInfo = {},
      // onHandleModalOpen,
      onHandleSubmit,
      btnName="DONE",
      title,
    //   width = 500,
    } = props;
    const style = (theme) => ({
    //   width: width,
      bgcolor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
      border: '2px solid currentColor',
      padding: '16px 24px 24px 24px',
      position: 'relative',
      textAlign: 'center',
      borderRadius: '10px'
    });

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
                        { videoInfo.file_name }
                    </Typography>
                    <IconButton aria-label="close"
                        onClick={onHandleModalClose}
                        sx={{ position: 'absolute', right: 8, top: 8,}}
                    >
                    <CloseIcon />
                    </IconButton>
                </Box>
                <CardMedia
                    sx={{ marginTop: '32px', borderRadius: '8px'}}
                    component="video"
                    // className={ CGroups.cardMedia }
                    src={`http://localhost:5000/${videoInfo.file_path}`}
                    // src="http://localhost:5000/saved-videos/343473f346da/343473f346da_22-02-2023_16-52-18.avi"
                    autoPlay
                    allow="autoPlay"
                    controls
                    // image={"/videos/222.webm?autoplay=1&mute"}
                    alt="camera video stream"
                />
            </Box>
        </Modal>
        </div>
    );
}
