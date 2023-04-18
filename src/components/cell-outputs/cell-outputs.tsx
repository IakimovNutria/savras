import React, {FormEvent, useCallback, useContext, useMemo} from 'react';
import CellParams from '../../types/cell-params';
import CellOutput from '../cell-output/cell-output';
import {saveFile} from '../../store/main-reducer/actions';
import {useAppDispatch} from '../../hooks';
import {CellContext} from '../../contexts/cell-context';

type OutputsParams = {
    cellId: string;
    outputs: {[key: string]: string | null};
};

function CellOutputs({cellId, outputs}: OutputsParams): JSX.Element {
	const dispatch = useAppDispatch();
	const {cellParams} = useContext(CellContext);
	const saveFilesHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		for (const key in cellParams.outputs) {
			const value = cellParams.outputs[key];
			if (value !== '' && value != null) {
				const path = outputs[key];
				if (path !== null) {
					dispatch(saveFile({ path, name: value }));
				}
			}
		}
	}, [cellParams, dispatch, outputs]);
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
							<CellOutput isShowGraph={isShowGraph[output]}
								output={output}
								outputName={names[output]}
							/>
						</li>))
				}
			</ul>
			<button className="cell__save-button"
				onClick={saveFilesHandler}>Save output files</button>
		</div>);
}

export default CellOutputs;
