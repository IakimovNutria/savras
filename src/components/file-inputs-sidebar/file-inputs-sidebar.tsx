import React, {FormEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import Input from '../../types/input';
import {getFileNames, getFiles, getFunctions} from '../../store/main-reducer/selectors';
import FileInput from '../file-input/file-input';
import {updateInputs} from '../../store/pipeline-reducer/actions';
import {Sidebar} from '../sidebar/sidebar';
import CellInfo from '../../types/cell-info';
import {fetchFileName} from '../../store/main-reducer/actions';

type InputProps = {
    cell: CellInfo;
};

function FileInputsSidebar({cell}: InputProps): JSX.Element | null {
	const files = useAppSelector(getFiles);
	const unsavedFiles = useAppSelector(getFileNames);
	const functions = useAppSelector(getFunctions);
	const func = useMemo(() => {
		return functions?.find((func) => func.function === cell.function);
	}, [functions, cell.function]);
	const dispatch = useAppDispatch();
	const defaultLocalInputs = useMemo(() => {
		const res: Record<string, {path: string | null, data_column: string | null}[] | null> = {};
		for (const key in cell.inputs) {
			res[key] = cell.inputs[key]?.length ? cell.inputs[key] : [{path: null, data_column: null}];
		}
		return res;
	}, [cell.inputs]);
	const [localInputs, setLocalInputs] = useState(defaultLocalInputs);
	useEffect(() => setLocalInputs(defaultLocalInputs), [defaultLocalInputs]);
	const getFileName = useCallback((path: string | null) => {
		if (path === null) {
			return null;
		}
		const file = files.find((elem) => elem.path === path);
		if (file) {
			return file.name;
		}
		if (!unsavedFiles[path]) {
			dispatch(fetchFileName({path}));
			return null;
		}
		return unsavedFiles[path];
	}, [files, unsavedFiles]);
	const inputsArray: Input[] = useMemo(() => {
		const newInputsArray = [];
		for (const key in localInputs) {
			const toPush: Input = {
				name: key,
				value: localInputs[key]?.map(({path, data_column}) =>
					({
						fileName: getFileName(path),
						inputColumn: data_column,
						path: path,
					})
				) ?? []
			};
			newInputsArray.push(toPush);
		}
		return newInputsArray;
	}, [localInputs, getFileName, unsavedFiles]);
	const submitInputsHandler = useCallback(async (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const toUpdate: {values: {path: string, data_column: string}[], field: string}[] = [];
		for (const key in localInputs) {
			const newValues: {path: string, data_column: string}[] = [];
			localInputs[key]?.forEach(({path, data_column}) => {
				if (path && data_column) {
					newValues.push({path, data_column});
				}
			});
			if (newValues) {
				toUpdate.push({ field: key, values: newValues });
			}
		}
		dispatch(updateInputs({ cellId: cell.id, inputs: toUpdate }));
	}, [dispatch, cell.id, localInputs]);
	const renderItem = useCallback((input: Input) => (
		<FileInput input={input}
			setInputs={setLocalInputs}
			multi={func?.inputs[input.name]}
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
