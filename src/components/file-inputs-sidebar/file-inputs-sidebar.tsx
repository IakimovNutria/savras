import React, {FormEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import Input from '../../types/input';
import { getFiles } from '../../store/main-reducer/selectors';
import FileInput from '../file-input/file-input';
import {updateInputs} from '../../store/pipeline-reducer/actions';
import {Sidebar} from '../sidebar/sidebar';
import CellInfo from '../../types/cell-info';

type InputProps = {
    cell: CellInfo;
};

function FileInputsSidebar({cell}: InputProps): JSX.Element | null {
	const files = useAppSelector(getFiles);
	const dispatch = useAppDispatch();
	const [localInputsPaths, setLocalInputsPaths] = useState(cell.inputs);
	const [localInputsColumns, setLocalInputsColumns] = useState(cell.data_columns);
	useEffect(() => setLocalInputsPaths(cell.inputs), [cell.inputs]);
	useEffect(() => setLocalInputsColumns(cell.data_columns), [cell.data_columns]);
	const getFileName = useCallback((path: string | null) => {
		const file = files.find((elem) => elem.path === path);
		if (file === undefined) {
			return null;
		}
		return file.name;
	}, [files]);
	const inputsArray: Input[] = useMemo(() => {
		const newInputsArray = [];
		for (const key in localInputsPaths) {
			const toPush: Input = {
				name: key,
				fileName: getFileName(localInputsPaths[key]),
				inputColumn: localInputsColumns[key],
				path: localInputsPaths[key],
			};
			newInputsArray.push(toPush);
		}
		return newInputsArray;
	}, [localInputsColumns, localInputsPaths, getFileName]);

	const submitInputsHandler = useCallback(async (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const toUpdate: {path: string, data_column: string, field: string}[] = [];
		for (const key in localInputsPaths) {
			const path = localInputsPaths[key];
			const dataColumn = localInputsColumns[key];
			if (path !== null && dataColumn !== null) {
				toUpdate.push({ path, data_column: dataColumn, field: key });
			}
		}
		dispatch(updateInputs({ cellId: cell.id, inputs: toUpdate }));
	}, [dispatch, cell.id, localInputsColumns, localInputsPaths]);
	const renderItem = useCallback((input: Input) => (
		<FileInput input={input}
			setInputsColumns={setLocalInputsColumns}
			setInputsPaths={setLocalInputsPaths}
		/>
	), []);
	const keyExtractor = useCallback((item: Input) => cell.id + item.name, [cell.id]);

	return (
		<Sidebar title="Inputs"
			items={inputsArray}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			buttonTitle="Save inputs"
			buttonClickHandler={submitInputsHandler}
		/>
	);
}

export default FileInputsSidebar;
