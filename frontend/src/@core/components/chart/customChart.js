import * as React from 'react';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function CustomChart(props) {
    const { chartData } = props;
    const [dataset, setDataset] = useState([]);
    let chartSetting = {
        yAxis: [
            {
                label: !chartData || !chartData.ytitle ? 'No data' : chartData.ytitle,
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

    useEffect(() => {
        console.log("chartData ", chartData)

        let tmpDataset = [];
    
        for (let index = 0; index < chartData.x?.length; index++) {
            tmpDataset.push({ x: chartData.x[index], y: chartData.y[index] });
        }
        
        console.log("tmp data: ", tmpDataset)
        setDataset(tmpDataset)
    }, [chartData])

    return (
        <>
            {dataset.length > 0 ? (
                <BarChart
                    margin={{
                        top: 30,
                        bottom: 30,
                        left: 70,
                    }}
                    borderRadius={10}
                    dataset={dataset}
                    xAxis={[
                        {
                            scaleType: 'band',
                            dataKey: 'x',
                            colorMap: {
                                type: 'ordinal',
                                colors: ['#2b8cbe'],
                            },
                        },
                    ]}
                    {...chartSetting}
                />
            ) : (
                <div>No Data Available</div>
            )}
        </>
    );
}