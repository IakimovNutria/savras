import React, { PureComponent } from 'react';
import {
    Label,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceArea,
    ResponsiveContainer,
} from 'recharts';
import moment from 'moment';


type stateType = {
    data: {[key: string]: number}[],
    left: number | string,
    right: number | string,
    refAreaLeft: string,
    refAreaRight: string,
    top: string,
    bottom: string,
    animation: boolean,
}

const initialData: {[key: string]: number}[] = [
    { name: 1, cost: 4.11, impression: 100 },
    { name: 2, cost: 2.39, impression: 120 },
    { name: 3, cost: 1.37, impression: 150 },
    { name: 4, cost: 1.16, impression: 180 },
    { name: 5, cost: 2.29, impression: 200 },
    { name: 6, cost: 3, impression: 499 },
    { name: 7, cost: 0.53, impression: 50 },
    { name: 8, cost: 2.52, impression: 100 },
    { name: 9, cost: 1.79, impression: 200 },
    { name: 10, cost: 2.94, impression: 222 },
    { name: 11, cost: 4.3, impression: 210 },
    { name: 12, cost: 4.41, impression: 300 },
    { name: 13, cost: 2.1, impression: 50 },
    { name: 14, cost: 8, impression: 190 },
    { name: 15, cost: 0, impression: 300 },
    { name: 16, cost: 9, impression: 400 },
    { name: 17, cost: 3, impression: 200 },
    { name: 18, cost: 2, impression: 50 },
    { name: 19, cost: 3, impression: 100 },
    { name: 20, cost: 7, impression: 100 },
];

const getAxisYDomain = (from: number, to: number) => {
    const refData = initialData.slice(from - 1, to);
    let [bottom, top] = [1e9, -1e9];
    refData.forEach((d) => {
        for (let key in d) {
            if (d[key] > top)
                top = d[key];
            if (d[key] < bottom)
                bottom = d[key];
        }
    });

    return [(bottom - 1), (top + 1)];
};

const initialState: stateType = {
    data: initialData,
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    top: 'dataMax+1',
    bottom: 'dataMin-1',
    animation: true,
};

export default class Example extends PureComponent {

    state: stateType;

    constructor(props: any) {
        super(props);
        this.state = initialState;
    }

    zoom() {
        let { refAreaLeft, refAreaRight } = this.state;
        const { data } = this.state;

        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            this.setState(() => ({
                refAreaLeft: '',
                refAreaRight: '',
            }));
            return;
        }

        // xAxis domain
        if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        // yAxis domain
        const [bottom, top] = getAxisYDomain(parseInt(refAreaLeft), parseInt(refAreaRight));

        this.setState(() => ({
            refAreaLeft: '',
            refAreaRight: '',
            data: data.slice(),
            left: refAreaLeft,
            right: refAreaRight,
            bottom,
            top
        }));
    }

    zoomOut() {
        const { data } = this.state;
        this.setState(() => ({
            data: data.slice(),
            refAreaLeft: '',
            refAreaRight: '',
            left: 'dataMin',
            right: 'dataMax',
            top: 'dataMax+1',
            bottom: 'dataMin'
        }));
    }

    render() {
        const { data, left, right, refAreaLeft, refAreaRight, top, bottom } = this.state;

        return (
            <div className="highlight-bar-charts" style={{ userSelect: 'none', width: '100%' }}>
                <button type="button" className="btn update" onClick={this.zoomOut.bind(this)}>
                    Zoom Out
                </button>

                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        width={800}
                        height={400}
                        data={data}
                        onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
                        onMouseMove={(e) => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
                        // eslint-disable-next-line react/jsx-no-bind
                        onMouseUp={this.zoom.bind(this)}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis allowDataOverflow dataKey="name" domain={[left, right]} type="number"
                               tickFormatter={timeStr => moment(timeStr).format('HH:mm')} />
                        <YAxis allowDataOverflow domain={[bottom, top]} type="number" yAxisId="1" />
                        <Tooltip />
                        <Line yAxisId="1" type="natural" dataKey="cost" stroke="#8884d8" animationDuration={300} />
                        <Line yAxisId="1" type="natural" dataKey="impression" stroke="#82ca9d" animationDuration={300} />

                        {refAreaLeft && refAreaRight ? (
                            <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                        ) : null}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
