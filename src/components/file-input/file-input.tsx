import React, {Dispatch, SetStateAction, useCallback, useMemo} from 'react';
import Input from '../../types/input';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getFiles, getFilesColumns} from '../../store/main-reducer/selectors';
import {fetchFileColumns} from '../../store/main-reducer/actions';
import './file-input.css';
import {FormField} from '../form-field/form-field';

type CellInputProps = {
	input: Input;
	setInputsColumns: Dispatch<SetStateAction<{[p: string]: string | null}>>;
	setInputsPaths: Dispatch<SetStateAction<{[p: string]: string | null}>>;
};

export default function FileInput({input, setInputsColumns, setInputsPaths}: CellInputProps): JSX.Element {
	const files = useAppSelector(getFiles);
	const dataColumns = useAppSelector(getFilesColumns);
	const dispatch = useAppDispatch();
	const fileColumns = useMemo(() => {
		if (input.path && Object.prototype.hasOwnProperty.call(dataColumns, input.path)) {
			return dataColumns[input.path];
		}
		return [];
	}, [input.path]);

	const updateInputHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const path = (selectedIndex !== -1) ? options[selectedIndex].id : null;
		const fieldName = select.id;
		if (path && !Object.prototype.hasOwnProperty.call(dataColumns, path)) {
			dispatch(fetchFileColumns({ path }));
		}
		setInputsPaths((state) => ({...state, [fieldName]: path}));
	}, [dataColumns, dispatch, setInputsPaths]);

	const updateColumnHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const value = (selectedIndex !== -1) ? options[selectedIndex].value : '';
		const fieldName = select.id;
		setInputsColumns((state) => ({...state, [fieldName]: value}));
	}, [setInputsColumns]);

	return (
		<FormField name={input.name}
			input={
				<>
					<select
						value={input.fileName ?? 'choose file'}
						onChange={updateInputHandler}
						name={input.name}
						id={input.name}
					>
						{
							input.fileName || <option id="">choose file</option>
						}
						{
							files.map((file) => (
								<option id={file.path}
									key={file.path}
								>
									{file.name}
								</option>
							))
						}
					</select>
					{
						(input.fileName !== null) &&
				<select value={input.inputColumn ?? 'choose column'}
					onChange={updateColumnHandler}
					id={input.name}
				>
					{
						input.inputColumn || <option id="">choose column</option>
					}
					{
						fileColumns.map((elem) => (
							<option id={input.name + elem}
								key={input.name + elem}
							>
								{elem}
							</option>
						))
					}
				</select>
					}
				</>
			}
		/>
	);
}
