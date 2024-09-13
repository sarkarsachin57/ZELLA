import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';


const SettingPanelHeader = ({icon, title}) => {
    
    return(
        <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
            {icon}
            <Typography sx={{padding: '0 8px'}}>
                {title}
            </Typography>
        </Box>
    );
}

export default SettingPanelHeader;