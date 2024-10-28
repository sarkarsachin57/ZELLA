import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme, bgColor }) => ({
    backgroundColor: Array.isArray(bgColor) && bgColor.length === 3
        ? `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`
        : '#ffeb3b', // Default color if `bgColor` is not a valid array
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#000000', // Set font color to black
    borderRadius: '4px', // Add some padding or styling if needed
}));

export default function DirectionStack(props) {
    const { data } = props;
    return (
        <div>
            <Stack direction="row" justifyContent="center" spacing={2}>
                {
                    Object.entries(data).map(([category, values], index) => {
                        console.log('bgColor: ', values); // Verify that values are RGB arrays
                        return (
                            <Item key={index} bgColor={values}>{category}</Item>
                        );
                    })
                }
            </Stack>
        </div>
    );
}
