import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function CustomChart(props) {


  
    const { chartData } = props
    console.log('chartData: ', chartData)
    const x = "['plane', 'dog', 'cat', 'frog', 'horse', 'car', 'truck', 'bird', 'deer', 'ship']"
    const y = "[5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000]"
    const jsonStringX = x.replace(/'/g, '"')
    const JsonX = JSON.parse(jsonStringX)
    const JsonY = JSON.parse(y)

    const dataset = []

    const chartSetting = {
        yAxis: [
        {
            label: chartData === null? 'No data' :chartData[0].hovertemplate,
        },
        ],
        series: [{ dataKey: 'y' }],
        height: 300,
        sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        },
        },
    };
    for (let index = 0; index < JsonY.length; index++) {
        dataset.push({x:JsonX[index], y:JsonY[index]});
    }
    console.log(dataset)
    
    return (
        <BarChart
            dataset={dataset}
            xAxis={[
            { scaleType: 'band', dataKey: 'x' },
            ]}
            {...chartSetting}
      />
    );
}