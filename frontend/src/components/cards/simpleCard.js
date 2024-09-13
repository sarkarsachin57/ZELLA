import Button from '@mui/material/Button'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const SimpleCard = (props) => {
    const {cardTitle, btnName, btnAction} = props;

    return (
        <Card sx={{ minWidth: 275, maxHeight: '300px', border: '1px solid white'}}>
            <CardContent>
            <Typography sx={{ fontSize: 24 }} color="text.secondary" gutterBottom>
                {cardTitle}
            </Typography>
            </CardContent>

            <CardActions>
            <Button size="small" onClick={btnAction}> {btnName} </Button>
            </CardActions>
        </Card>
    )
}

export default SimpleCard;
