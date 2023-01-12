import Chart from 'react-apexcharts';
import React, {Component} from 'react';

type GraphProps = {
    categories: string[];
    series: {name: string, data: number[]}[]
}

function Graph({categories, series}: GraphProps): JSX.Element {

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
    return (<Chart options={options} series={series} type="line" width={500} height={320}/>);
}

export default Graph;