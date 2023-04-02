import React, {
	ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import CellArguments from '../../types/cell-arguments';

type OutputsParams = {
    cellId: string;
    outputs: {[key: string]: string | null};
    updateOutputNameHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    saveFilesHandler: (event: FormEvent<HTMLButtonElement>) => void;
    cellParams: CellArguments;
    updateShowGraphHandler: (event: FormEvent<HTMLInputElement>) => void;
};

function CellOutputs({
	cellId, outputs, updateOutputNameHandler, saveFilesHandler, cellParams, updateShowGraphHandler,
}: OutputsParams): JSX.Element {
	const defaultOutputNames: string[] = [];
	const [outputNames, setOutputNames] = useState(defaultOutputNames);
	const defaultIsShowGraph: {[key: string]: boolean} = {};
	const [isShowGraph, setIsShowGraph] = useState(defaultIsShowGraph);
	const defaultName: {[key: string]: string} = {};
	const [names, setNames] = useState(defaultName);

	useEffect(() => {
		const newOutputNames = [];
		for (const key in outputs) {
			if (outputs[key] !== null) {
				newOutputNames.push(key);
			}
		}
		setOutputNames(newOutputNames);
	}, [outputs]);

	useEffect(() => {
		for (const key in outputs) {
			const graphOutput = cellParams.graphOutputs[key];
			setIsShowGraph((state) => ({ ...state, [key]: graphOutput }));
		}
		for (const key in cellParams.outputs) {
			const output = cellParams.outputs[key];
			setNames((state) => ({ ...state, [key]: output === null ? '' : output }));
		}
	}, [cellParams, outputs]);

	return (
		<div className="cell__outputs">
			<h3>Outputs</h3>
			<ul className="cell__output-items">
				{
					outputNames.map((output) => (
						<li key={cellId + output}
							className="cell__output-item">
							<div className="cell__show-graph-checkbox">
								<img alt="graph-icon"
									src="/img/graph-icon.png"
									width={15}
									height={15} />
								<input
									type="checkbox"
									checked={isShowGraph[output]}
									id={output}
									onChange={updateShowGraphHandler}
								/>
							</div>
							<span>
								{output}
    :
							</span>
							<input
								value={names[output]}
								className="cell__text-input"
								type="text"
								id={output}
								onChange={updateOutputNameHandler}
							/>
						</li>))
				}
			</ul>
			<button className="cell__save-button"
				onClick={saveFilesHandler}>Save output files</button>
		</div>);
}

export default CellOutputs;
