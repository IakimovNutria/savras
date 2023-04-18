import React, {FormEvent, useCallback, useContext} from 'react';
import {CellContext} from '../../contexts/cell-context';

type CellOutputProps = {
	isShowGraph: boolean;
	output: string;
	outputName: string;
}

function CellOutput({isShowGraph, output, outputName}: CellOutputProps): JSX.Element {
	const {setCellParams} = useContext(CellContext);
	const updateShowGraphHandler = useCallback((event: FormEvent<HTMLInputElement>) => {
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.checked;
		setCellParams((state) => ({ ...state, graphOutputs: { ...state.graphOutputs, [fieldName]: value } }));
	}, []);
	const updateOutputNameHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const { value } = event.target;
		setCellParams((state) => ({ ...state, outputs: { ...state.outputs, [fieldName]: value } }));
	}, []);

	return (
		<>
			<div className="cell__show-graph-checkbox">
				<img alt="graph-icon"
					src="/img/graph-icon.png"
					width={15}
					height={15} />
				<input
					type="checkbox"
					checked={isShowGraph}
					id={output}
					onChange={updateShowGraphHandler}
				/>
			</div>
			<span>
				{output}:
			</span>
			<input
				value={outputName}
				className="cell__text-input"
				type="text"
				id={output}
				onChange={updateOutputNameHandler}
			/>
		</>
	);
}

export default CellOutput;
