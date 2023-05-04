import Chart from 'react-apexcharts';
import React, {useMemo} from 'react';
import TimeSeries from '../../types/time-series';

type GraphProps = {
    timeSeries: TimeSeries;
    name: string;
    width: number;
    height: number;
}

function Graph({timeSeries, width, height, name}: GraphProps): JSX.Element {
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
		<Chart options={options}
			series={series}
			type="line"
			width={width}
			height={height}
		/>
	);
}

export default Graph;
