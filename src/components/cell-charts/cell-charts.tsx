import React, {useCallback, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getGraphs} from '../../store/pipeline-reducer/selectors';
import {getFileTimeSeries} from '../../store/pipeline-reducer/actions';
import Chart from '../chart/chart';
import './cell-charts.css';
import TimeSeries from '../../types/time-series';

type GraphsParams = {
    cellId: string;
    outputs: {[key: string]: string | null};
	inputs: {[key: string]: string | null};
	dataColumns: Record<string, string | null>;
};

function CellCharts({ cellId, outputs, inputs, dataColumns }: GraphsParams): JSX.Element {
	const graphs = useAppSelector(getGraphs);
	const dispatch = useAppDispatch();
	const [inputGraph, setInputGraph] = useState('');
	const [outputGraph, setOutputGraph] = useState('');
	const updateInputGraph = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const path = (selectedIndex !== -1) ? options[selectedIndex].id : null;
		const fieldName = select.value;
		setInputGraph(fieldName);
		if (!path || graphs[path]) {
			return;
		}
		const dataColumn = dataColumns[fieldName];
		if (dataColumn) {
			dispatch(getFileTimeSeries({path, dataColumn, cellId}));
		}
	}, [graphs, dataColumns, dispatch]);

	const updateOutputGraph = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const path = (selectedIndex !== -1) ? options[selectedIndex].id : null;
		const fieldName = select.value;
		setOutputGraph(fieldName);
		if (!path || graphs[path]) {
			return;
		}
		dispatch(getFileTimeSeries({path, dataColumn: 'value', cellId}));
	}, [graphs, dispatch]);

	const outputTimeSeries = useMemo(() => {
		const path = outputs[outputGraph];
		if (!path) {
			return null;
		}
		return graphs[path];
	}, [graphs, outputs, outputGraph]);
	const inputTimeSeries = useMemo(() => {
		const path = inputs[inputGraph];
		if (!path) {
			return null;
		}
		return graphs[path];
	}, [graphs, inputs, inputGraph]);

	const timeSeries = useMemo(() => {
		const res: Record<string, TimeSeries> = {};
		if (outputGraph && outputTimeSeries) {
			res[outputGraph] = outputTimeSeries;
		}
		if (inputGraph && inputTimeSeries) {
			res[inputGraph] = inputTimeSeries;
		}
		return res;
	}, [inputTimeSeries, inputGraph, outputTimeSeries, outputGraph]);

	return (
		<section className="cell-charts">
			<div className="cell-charts__selectors">
				<div className="cell-charts__selector">
					<span className="cell-charts__selector-name">Input graph</span>
					<select onChange={updateInputGraph}
						value={inputGraph ?? 'choose file'}
						className="nodrag"
					>
						{
							inputGraph || <option id="">choose input</option>
						}
						{
							Object.entries(inputs).map(([name, path]) => (
								path &&
								<option id={path?.toString()}
									key={path}
								>
									{name}
								</option>
							))
						}
					</select>
				</div>
				<div className="cell-charts__selector">
					<span className="cell-charts__selector-name">Output graph</span>
					<select onChange={updateOutputGraph}
						value={outputGraph ?? 'choose file'}
						className="nodrag"
					>
						{
							outputGraph || <option id="">choose output</option>
						}
						{
							Object.entries(outputs).map(([name, path]) => (
								path &&
								<option id={path?.toString()}
									key={path}
								>
									{name}
								</option>
							))
						}
					</select>
				</div>
			</div>
			<div className="cell-charts__charts">
				{
					<Chart timeSeries={timeSeries}
						cellId={cellId}
					/>
				}
			</div>
		</section>
	);
}

export default CellCharts;
