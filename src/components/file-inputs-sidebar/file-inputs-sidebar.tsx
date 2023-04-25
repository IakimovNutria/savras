import React, {FormEvent, useCallback, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import Input from '../../types/input';
import { getFiles } from '../../store/main-reducer/selectors';
import FileInput from '../file-input/file-input';
import {updateInputs} from '../../store/pipeline-reducer/actions';
import {Sidebar} from '../sidebar/sidebar';

type InputProps = {
    cellId: string;
	inputsPaths: {[key: string]: string | null};
	inputsColumns: {[key: string]: string | null};
};

function FileInputsSidebar({cellId, inputsPaths, inputsColumns}: InputProps): JSX.Element {
	const files = useAppSelector(getFiles);
	const dispatch = useAppDispatch();
	const [localInputsPaths, setLocalInputsPaths] = useState(inputsPaths);
	const [localInputsColumns, setLocalInputsColumns] = useState(inputsColumns);
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
		dispatch(updateInputs({ cellId, inputs: toUpdate }));
	}, [dispatch, cellId, localInputsColumns, localInputsPaths]);

	return (
		<Sidebar title="Inputs"
			items={inputsArray}
			renderItem={(input) => (
				<FileInput input={input}
					setInputsColumns={setLocalInputsColumns}
					setInputsPaths={setLocalInputsPaths}
				/>
			)}
			keyExtractor={(item) => cellId + item.name}
			buttonTitle="Save inputs"
			buttonClickHandler={submitInputsHandler}
		/>
	);
}

export default FileInputsSidebar;
