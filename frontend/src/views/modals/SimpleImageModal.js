import CGroups from '../../../styles/pages/settings.module.scss'

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
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
const CardImage = styled('img')(({ theme }) => ({
  padding: '0px',
  margin: '0px',
  borderRadius: '10px',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center'
}))

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



export default function SimpleImageModal(props) {
    const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/`;
    const simpleImageUrl = useSelector((state) => {
      return state.baseState.simpleImageUrl
    })
    const {
      isOpen = false,
      onHandleModalClose,
    } = props;
    const style = (theme) => ({
      width: '90%',
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
                  <CardImage 
                    src = {baseUrl + simpleImageUrl} 
                    alt='pic' 
                  />
              </Box>
          </Modal>
        </div>
    );
}
