import Button from '@mui/material/Button';

const ActiveButton = (props) =>{
    const {
        isActive = true,
        btnName = 'Button',
        handleClick = f=>f
    } = props

    if (isActive) {
        return (
            <Button variant="contained" onClick={handleClick} sx={{marginX: '8px'}}> {btnName} </Button>
        )
    } 
    return (
        <Button variant="outlined" onClick={handleClick} sx={{marginX: '8px'}}> {btnName} </Button>
    )
}

export default ActiveButton;