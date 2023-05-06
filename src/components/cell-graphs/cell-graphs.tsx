import React from 'react';
/*, { useEffect, useMemo } from 'react';
import Chart from '../chart/chart';
import { getFileTimeSeries } from '../../store/pipeline-reducer/actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import TimeSeries from '../../types/time-series';
import { getGraphs } from '../../store/pipeline-reducer/selectors';
*/
type GraphsParams = {
    cellId: string;
    outputs: {[key: string]: string | null};
};

function CellGraphs({ cellId, outputs }: GraphsParams): JSX.Element {
	/*
	const graphsInfo = useAppSelector(getGraphs)[cellId];
	const dispatch = useAppDispatch();
	const graphs: {name: string, timeSeries: TimeSeries}[] = useMemo(() => {
		const newGraphs = [];
		for (const key in graphsInfo) {
			if (graphsInfo[key] && cellParams.graphInputs[key]) {
				newGraphs.push({ name: key, timeSeries: graphsInfo[key] });
			}
		}
		for (const key in graphsInfo) {
			if (graphsInfo[key] && cellParams.graphOutputs[key]) {
				newGraphs.push({ name: key, timeSeries: graphsInfo[key] });
			}
		}
		return newGraphs;
	}, [cellParams, graphsInfo]);

	useEffect(() => {
		for (const key in cellParams.graphInputs) {
			const path = cellParams.inputsPath[key];
			const dataColumn = cellParams.selectedInputsColumn[key];
			if (cellParams.graphInputs[key] && cellParams.graphInputs[key] !== null && path !== null && dataColumn !== null) {
				dispatch(getFileTimeSeries({
					path,
					graphName: key,
					cellId,
					dataColumn,
				}));
			}
		}
	}, [cellParams, cellId, dispatch]);

	useEffect(() => {
		for (const key in cellParams.graphOutputs) {
			const path = outputs[key];
			const dataColumn = 'value';
			if (cellParams.graphOutputs[key] && cellParams.graphOutputs[key] !== null && path !== null) {
				dispatch(getFileTimeSeries({
					path,
					graphName: key,
					cellId,
					dataColumn,
				}));
			}
		}
	}, [cellParams, outputs, cellId, dispatch]);

	return (graphs.length !== 0) ? (
		<ul className="cell__graphs">
			{
				graphs.map((chart) => (
					<li key={chart.name}
						className="cell__graph-item">
						<span className="cell__graph-name">{chart.name}</span>
						<Chart name={chart.name}
							timeSeries={chart.timeSeries}
							width={400}
							height={150} />
					</li>))
			}
		</ul>
	) : <></>;
	*/
	return <></>;
}

export default CellGraphs;
