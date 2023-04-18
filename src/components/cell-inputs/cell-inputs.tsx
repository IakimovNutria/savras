import React, {FormEvent, useCallback, useContext, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import Input from '../../types/input';
import { getFiles } from '../../store/main-reducer/selectors';
import CellInput from '../cell-input/cell-input';
import {CellContext} from '../../contexts/cell-context';
import {updateInputs} from '../../store/pipeline-reducer/actions';

type InputProps = {
    cellId: string;
};

function CellInputs({cellId}: InputProps): JSX.Element {
	const { cellParams } = useContext(CellContext);
	const files = useAppSelector(getFiles);
	const inputPaths = cellParams.inputsPath;
	const inputColumns = cellParams.selectedInputsColumn;
	const dispatch = useAppDispatch();
	const inputsArray: Input[] = useMemo(() => {
		const getFileName = (path: string | null) => {
			const file = files.find((elem) => elem.path === path);
			if (file === undefined) {
				return null;
			}
			return file.name;
		};
		const newInputsArray = [];
		for (const key in inputPaths) {
			const toPush: Input = {
				name: key,
				fileName: getFileName(inputPaths[key]),
				inputColumn: inputColumns[key],
				path: inputPaths[key],
			};
			newInputsArray.push(toPush);
		}
		return newInputsArray;
	}, [cellParams, inputColumns, inputPaths, files]);

	const submitInputsHandler = useCallback(async (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const toUpdate: {path: string, data_column: string, field: string}[] = [];
		for (const key in cellParams.inputsPath) {
			const path = cellParams.inputsPath[key];
			const dataColumn = cellParams.selectedInputsColumn[key];
			if (path !== null && dataColumn !== null) {
				toUpdate.push({ path, data_column: dataColumn, field: key });
			}
		}
		dispatch(updateInputs({ cellId, inputs: toUpdate }));
	}, [cellParams, dispatch, cellId]);

	return (
		<div className="cell__inputs">
			<h3>Inputs</h3>
			<ul className="cell__input-items">
				{
					inputsArray.map((input) => (
						<li className="cell__input-item"
							key={cellId + input.name}>
							<CellInput input={input}
								cellParams={cellParams}
							/>
						</li>
					))
				}
			</ul>
			<button className="cell__save-button"
				onClick={submitInputsHandler}>
				Save inputs
			</button>
		</div>);
}

export default CellInputs;
