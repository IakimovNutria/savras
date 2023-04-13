import React, { useEffect, useMemo } from 'react';
import Graph from '../graph/graph';
import { getFileTimeSeries } from '../../store/api-actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import TimeSeries from '../../types/time-series';
import CellArguments from '../../types/cell-arguments';
import { getGraphs } from '../../store/pipeline-reducer/selectors';

type GraphsParams = {
    cellId: string;
    cellParams: CellArguments;
    outputs: {[key: string]: string | null};
};

function CellGraphs({ cellId, cellParams, outputs }: GraphsParams): JSX.Element {
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
				graphs.map((graph) => (
					<li key={graph.name}
						className="cell__graph-item">
						<span className="cell__graph-name">{graph.name}</span>
						<Graph name={graph.name}
							timeSeries={graph.timeSeries}
							width={400}
							height={150} />
					</li>))
			}
		</ul>
	) : <></>;
}

export default CellGraphs;
