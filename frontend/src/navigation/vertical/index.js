// ** Icon imports
import { useSelector } from 'react-redux'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LocalPolice from '@mui/icons-material/LocalPolice'
import Category from '@mui/icons-material/Category'
import SettingsIcon from '@mui/icons-material/Settings'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CallSplitIcon from '@mui/icons-material/CallSplit'

/**
 * @file is responsible for sidebar menu
 */



const offlineNavItemList = [
  {
    title: 'Data Upload',
    icon: CloudUploadIcon,
    path: `data-upload/`
  },
  {
    title: 'Data Visualization',
    icon: Category,
    path: `/data-visualization`
  },
  {
    title: 'Data Operation',
    icon: SettingsIcon,
    path: '/dataPreparation',
    subTitle: [
      {
        title: 'Noise Filtering',
        icon: NoteAddIcon,
        path: '/dataPreparation/noiseFiltering'
      },
      {
        title: 'Dataset Split',
        icon: CallSplitIcon,
        path: '/dataPreparation/datasetSplit'
      },
      {
        title: 'Label Correction',
        icon: VerifiedUserIcon,
        path: '/dataPreparation/labelCorrection'
      },
      {
        title: 'Augmentation',
        icon: AccountBalanceIcon,
        path: '/dataPreparation/Augmentation'
      }
    ]
  },
  {
    title: 'Model Training',
    icon: PlayArrowIcon,
    path: '/modelTraining'
  },
  {
    title: 'Model evaluation',
    icon: StarBorderIcon,
    path: '/modelEvaluation'
  },
  {
    title: 'Model Inference',
    icon: LocalPolice,
    path: '/model-inference'
  }
]

const navigation = () => {
  return offlineNavItemList
}

export default navigation
