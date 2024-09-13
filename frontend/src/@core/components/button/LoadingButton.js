import { LoadingButton as _LoadingButton } from '@mui/lab'
import { styled } from '@mui/material/styles'

export const LoadingButton = styled(_LoadingButton)`
  padding: 0.6rem 0;
  background-color: #3f51b5 !important;
  color: #ffffff;
  font-weight: 500;

  &:hover {
    background-color: #3d5afe !important;
    transform: translateY(-2px);
  }
`
