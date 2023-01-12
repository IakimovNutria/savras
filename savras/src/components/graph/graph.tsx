import Chart from 'react-apexcharts';
import React from 'react';
import TimeSeries from "../../types/timeSeries";


type GraphProps = {
    timeSeries: TimeSeries;
    name: string;
    width: number;
    height: number;
}

function Graph({timeSeries, width, height, name}: GraphProps): JSX.Element {
    const categories = timeSeries.map((t) => t.datetime);
    const series = [{name: name, data: timeSeries.map((t) => t.value)}];
    const options = {
        chart: {
            id: 'apexchart-example'
        },
        xaxis: {
            categories: categories,
            type: 'datetime',
        }
    }

    //@ts-ignore
    return (<Chart options={options} series={series} type="line" width={width} height={height}/>);
}

export default Graph;