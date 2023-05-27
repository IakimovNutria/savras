import ApexChart from 'react-apexcharts';
import React, {useMemo} from 'react';
import TimeSeries from '../../types/time-series';
import './chart.css';

type GraphProps = {
    timeSeries: Record<string, TimeSeries>;
	cellId: string;
}

function Chart({timeSeries, cellId}: GraphProps): JSX.Element {
	const series = useMemo(() => Object.entries(timeSeries).map(([name, series]) => {
		return { name, data: series.map((t) => t.value) };
	}),[timeSeries]);
	const categories = useMemo(() => Object.entries(timeSeries).map(([, series]) => series).map((series) => series.map(({datetime}) => datetime)),
		[timeSeries]);
	const allEqual = useMemo(() => {
		if (categories.length == 0) {
			return false;
		}
		const first = categories[0];
		return categories.every((category) => {
			if (category.length !== first.length) {
				return false;
			}
			for (let j = 0; j < category.length; j++) {
				if (category[j] !== first[j]) {
					return false;
				}
			}
			return true;
		});
	}, [categories]);
	const options = useMemo(() => ({
		chart: {
			id: cellId,
			zoom: {
				enabled: false, //TODO: turn on scaling
				type: 'x' as const,
				autoScaleYaxis: false
			},
			width: '100%'
		},
		xaxis: {
			categories: categories.length !== 0 ? categories[0] : [],
			type: 'datetime' as const,
		}
	}), [timeSeries]);

	if (categories.length === 0) {
		return <span className="chart__message">There&apos;s no graph</span>;
	}

	if (!allEqual) {
		return <span className="chart__message chart__message_error">Graph series dates are not the same</span>;
	}

	return (
		<ApexChart options={options}
			series={series}
			type="line"
			height={200}
			className="nodrag chart"
		/>
	);
}

export default Chart;
