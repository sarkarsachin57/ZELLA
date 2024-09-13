import * as React from 'react';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const  CustomSwitch = (props) => {
    const {rightLabel, leftLabel, handleSwitchToggle, checked} = props;

    return (
        <Stack direction="row" spacing={1} alignItems="center" style={{margin: '0 8px'}}>
            <Typography>{leftLabel}</Typography>
            <Switch 
                inputProps={{ 'aria-label': 'ant design' }} 
                defaultChecked
                checked={checked}
                onChange={handleSwitchToggle}
            />
            <Typography>{rightLabel}</Typography>
        </Stack>
    )
}

  export default CustomSwitch