import React, {FormEvent, useCallback, useContext} from 'react';
import CellParams from '../../types/cell-params';
import Input from '../../types/input';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getFiles, getFilesColumns} from '../../store/main-reducer/selectors';
import {fetchFileColumns} from '../../store/main-reducer/actions';
import {CellContext} from '../../contexts/cell-context';

type CellInputProps = {
	cellParams: CellParams;
	input: Input;
};

export default function CellInput({cellParams, input}: CellInputProps): JSX.Element {
	const {setCellParams} = useContext(CellContext);
	const files = useAppSelector(getFiles);
	const dataColumns = useAppSelector(getFilesColumns);
	const dispatch = useAppDispatch();
	const getFileColumns = useCallback((path: string | null) => {
		if (path && Object.prototype.hasOwnProperty.call(dataColumns, path)) {
			return dataColumns[path];
		}
		return [];
	}, [dataColumns]);

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
		setCellParams((state) => ({ ...state, inputsPath: { ...state.inputsPath, [fieldName]: path } }));
	}, [dataColumns, dispatch]);

	const updateColumnHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const value = (selectedIndex !== -1) ? options[selectedIndex].value : '';
		const fieldName = select.id;
		setCellParams((state) => ({ ...state, selectedInputsColumn: { ...state.selectedInputsColumn, [fieldName]: value } }));
	}, []);

	const updateShowGraphHandler = useCallback((event: FormEvent<HTMLInputElement>) => {
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.checked;
		setCellParams((state) => ({ ...state, graphInputs: { ...state.graphInputs, [fieldName]: value } }));
	}, []);

	return (
		<>
			<div className="cell__show-graph-checkbox">
				<img alt="graph-icon"
					src="/img/graph-icon.png"
					width={15}
					height={15}
				/>
				<input
					type="checkbox"
					checked={cellParams.graphInputs[input.name]}
					id={input.name}
					onChange={updateShowGraphHandler}
				/>
			</div>
			<span>
				{input.name}:
			</span>
			<select
				value={(input.fileName === null) ? 'choose file' : input.fileName}
				onChange={updateInputHandler}
				name={input.name}
				id={input.name}
			>
				{
					(input.fileName === null) && (<option id="">choose file</option>)
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
				(input.fileName !== null) && (
					<select value={input.inputColumn ? input.inputColumn : 'choose column'}
						onChange={updateColumnHandler}
						id={input.name}
					>
						{
							input.inputColumn || (<option id="">choose column</option>)
						}
						{
							getFileColumns(input.path).map((elem) => (
								<option id={input.name + elem}
									key={input.name + elem}
								>
									{elem}
								</option>
							))
						}
					</select>
				)
			}
		</>
	);
}
