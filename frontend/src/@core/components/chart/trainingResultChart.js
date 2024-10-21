import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function SimpleLineChart(props) {
    const {historyChartData} = props
  return (
    <LineChart
      width={500}
      height={300}
      series={historyChartData.series}
      xAxis={historyChartData.xAxis}
    />
  );
}