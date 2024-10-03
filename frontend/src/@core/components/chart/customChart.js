import * as React from 'react';
import { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function CustomChart(props) {
    
    const { chartData } = props
    console.log('chartData: ', chartData.x)
    const [dataX, setDataX] = useState(chartData.x)
    const [dataY, setDataY] = useState(chartData.y)

    const dataset = []

    const chartSetting = {
        yAxis: [
        {
            label: chartData === null? 'No data' : chartData.ytitle,
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
    for (let index = 0; index < dataX.length; index++) {
        dataset.push({x:dataX[index], y:dataY[index]});
    }
    console.log(dataset)
    
    return (
        <BarChart
            margin={{
                top: 30,
                bottom: 30,
                left: 70
            }}
            borderRadius={10}
            dataset={dataset}
            xAxis={[
            { 
                scaleType: 'band', 
                dataKey: 'x', 
                colorMap: {
                    type: 'ordinal',
                    colors: ['#2b8cbe',]
                }
            },
            ]}
            {...chartSetting}
      />
    );
}