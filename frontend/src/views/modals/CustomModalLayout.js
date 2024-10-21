import CGroups from '../../../styles/pages/settings.module.scss'

import * as React from 'react';
import clsx from 'clsx';
import { styled, Box, Theme } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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
  // max-height: 85%;
  
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

export default function CustomModalUnstyled(props) {
    const { children } = props;

    const {
      isOpen = false,
      onHandleModalClose,
      // onHandleModalOpen,
      onHandleSubmit,
      btnName="DONE",
      isLoading = false,
      title,
      width = 500,
    } = props;

    const style = (theme) => ({
      width: width,
      bgcolor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
      border: '2px solid currentColor',
      padding: '16px 24px 24px 24px',
      position: 'relative',
      textAlign: 'center',
      borderRadius: '10px'
    });

    return (

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
                      {title}
                  </Typography>
                  <IconButton aria-label="close"
                    onClick={onHandleModalClose}
                    sx={{ position: 'absolute', right: 8, top: 8,}}
                  >
                  <CloseIcon />
                  </IconButton>
                </Box>
                {children}
            </Box>
        </Modal>

    );
}
