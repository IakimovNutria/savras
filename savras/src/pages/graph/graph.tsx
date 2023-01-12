import Chart from 'react-apexcharts';
import React, {Component} from 'react';

class Graph extends Component {
    constructor(props: any) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: 'apexchart-example'
                },
                xaxis: {
                    categories: ["2023-01-12T11:14:17.922Z", "2023-01-13T11:14:17.922Z", "2023-01-14T11:14:17.922Z", "2023-01-15T11:14:17.922Z"],
                    type: 'datetime',
                }
            },
            series: [{
                name: 'series-1',
                data: [30, 40, 35, 50]
            }]
        }
    }
    render() {
        return (
            //@ts-ignore
            <Chart options={this.state.options} series={this.state.series} type="line" width={500} height={320} />
        )
    }
}

export default Graph;