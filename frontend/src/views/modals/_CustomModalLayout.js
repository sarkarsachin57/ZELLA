import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';

const BootstrapedDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),

    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}))

const BootstrapDialogTitle = (props)=> {
    const { children, btnName = "Accept", title="Title", onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }

const CustomModalLayout = (props) => {
    const { children } = props;
    const { isOpen, onHandleModalClose, onHandleModalOpen, onHandleSubmit, btnName, title} = props;

    return(
        <BootstrapedDialog
            onClose={onHandleModalClose}
            aria-labelledby="customized-dialog-title"
            open = {isOpen}

        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={onHandleModalClose}>
                {title}
            </BootstrapDialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onHandleSubmit}>
                    {btnName}
                </Button>
            </DialogActions>
        </BootstrapedDialog>
    )

}
export default CustomModalLayout;
