// ** Icon imports
import { useSelector } from 'react-redux'

import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import EyeCircleOutline from 'mdi-material-ui/EyeCircleOutline'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SettingsIcon from '@mui/icons-material/Settings'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { TRUST_MODE, TRUST_METHOD } from 'src/constants'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

/**
 * @file is responsible for sidebar menu
 */



const offlineNavItemList = [
  {
    title: 'Upload Data page',
    icon: CloudUploadIcon,
    path: `data-upload/`
    // path: `data-upload/${localStorage.getItem("projectId")}`
  },

  {
    title: 'Data Preparation',
    icon: SettingsIcon,
    path: '/dataPreparation',
    subTitle: [
      {
        title: 'Relevant Data Selection',
        icon: NoteAddIcon,
        path: '/dataPreparation/relevantSelection'
      },
      {
        title: 'Label Correction',
        icon: VerifiedUserIcon,
        path: '/dataPreparation/labelCorrection'
      },
      {
        title: 'Label Balancing',
        icon: AccountBalanceIcon,
        path: '/dataPreparation/labelBalancing'
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
  }
]

const navigation = () => {
  return offlineNavItemList
}

export default navigation
