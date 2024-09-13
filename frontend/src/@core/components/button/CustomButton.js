import { LoadingButton as _LoadingButton } from '@mui/lab'
import { styled } from '@mui/material/styles'

export const CustomButton = styled(_LoadingButton)`
  padding: 0.6rem 0;
  background-color: #39B677;
  color: #FFFFFF;
  max-height: 48px;
  font-weight: 500;
  border-radius: 8px;
  padding: 8px 12px;
  &:hover {
    background-color: #ebc22c;
    transform: translateY(-2px);
  }
`;

// .loading_button {
//     background-color: $button-color;
//     border-radius: 8px;
//     min-width: 100px;
//     padding: 8px 20px;
//     text-align: center;
//     color: #FFFFFF
// }
