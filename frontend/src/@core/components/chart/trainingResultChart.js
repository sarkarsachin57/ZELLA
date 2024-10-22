import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function SimpleLineChart(props) {
    const {historyChartData, width} = props
  return (
    <LineChart
      width={width}
      height={300}
      series={historyChartData.series}
      xAxis={historyChartData.xAxis}
    />
  );
}