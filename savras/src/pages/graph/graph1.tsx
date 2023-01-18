import Chart from 'react-apexcharts';
import React, {Component} from 'react';
import Graph from "../../components/graph/graph";
import TimeSeries from "../../types/timeSeries";

class Graph1 extends Component {
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
            <Graph timeSeries={[{datetime: "2023-01-12T11:14:17.922Z", value: 101}, {datetime: "2023-01-13T11:14:17.922Z", value: 105}]} name={"123"} width={100} height={200}/>
        )
    }
}

export default Graph1;