import React, {
	ChangeEvent, FormEvent, useMemo,
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
	const outputNames: string[] = useMemo(() => {
		const newOutputNames = [];
		for (const key in outputs) {
			if (outputs[key] !== null) {
				newOutputNames.push(key);
			}
		}
		return newOutputNames;
	}, [outputs]);
	const isShowGraph = useMemo(() => {
		const newIsShow: {[key: string]: boolean} = {};
		for (const key in outputs) {
			newIsShow[key] = cellParams.graphOutputs[key];
		}
		return newIsShow;
	}, [cellParams]);
	const names: {[key: string]: string} = useMemo(() => {
		const newNames: {[key: string]: string} = {};
		for (const key in cellParams.outputs) {
			const output = cellParams.outputs[key];
			newNames[key] = output === null ? '' : output;
		}
		return newNames;
	}, [cellParams]);

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
