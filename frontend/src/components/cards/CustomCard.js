
import CGroups from '../../../styles/pages/card.module.scss'
import Button from '@mui/material/Button'

const CustomCard = (props) => {
    const {cardTitle, cardBtnName, handleClick} = props;
    return (
        <div className={CGroups.customCard}>
            <div className={CGroups.first_content}>
                <span>{cardTitle}</span>
            </div>
            <div className={CGroups.second_content}>
                <Button className={CGroups.button} onClick={handleClick}>
                    {/* <span> */}
                        {cardBtnName}
                        {/* </span> */}
                </Button>
            </div>
        </div>
    )
}

export default CustomCard;