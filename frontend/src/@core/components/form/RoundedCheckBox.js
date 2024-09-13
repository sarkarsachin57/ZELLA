import Checkbox from '@mui/material/Checkbox'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const RoundedCheckBox = () =>{

        return <Checkbox
            icon= {<RadioButtonUncheckedIcon/>}
            checkedIcon = {<CheckCircleOutlineIcon/>}
        />

};

export default RoundedCheckBox;
