import ApexChart from 'react-apexcharts';
import React, {useMemo} from 'react';
import TimeSeries from '../../types/time-series';

type GraphProps = {
    timeSeries: TimeSeries;
    name: string;
    width: number;
    height: number;
}

function Chart({timeSeries, width, height, name}: GraphProps): JSX.Element {
	const series = useMemo(() => [{ name, data: timeSeries.map((t) => t.value) }],
		[timeSeries, name]);
	const options = useMemo(() => ({
		chart: {
			id: name,
		},
		xaxis: {
			categories: timeSeries.map((t) => t.datetime),
			type: 'datetime' as const,
		},
	}), [timeSeries, name]);
	return (
		<ApexChart options={options}
			series={series}
			type="line"
			width={width}
			height={height}
		/>
	);
}

export default Chart;
