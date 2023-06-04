import React, {Dispatch, SetStateAction, useCallback} from 'react';
import Input from '../../types/input';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getFiles, getFilesColumns} from '../../store/main-reducer/selectors';
import {fetchFileColumns} from '../../store/main-reducer/actions';
import './file-input.css';

type FileInputProps = {
	input: Input;
	setInputs: Dispatch<SetStateAction<Record<string, {path: string | null, data_column: string | null}[] | null>>>;
	multi?: boolean;
};

export default function FileInput({input, setInputs, multi}: FileInputProps): JSX.Element {
	const files = useAppSelector(getFiles);
	const dataColumns = useAppSelector(getFilesColumns);
	const dispatch = useAppDispatch();
	const updateInputHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const path = (selectedIndex !== -1) ? options[selectedIndex].id : null;
		const fieldName = select.dataset.name;
		if (!fieldName) {
			return;
		}
		const index = Number(select.dataset.index);
		if (path && !Object.prototype.hasOwnProperty.call(dataColumns, path)) {
			dispatch(fetchFileColumns({ path }));
		}
		setInputs((state) => {
			const ll = state[fieldName];
			if (!ll) {
				return state;
			}
			const newValue: {path: string | null, data_column: string | null}[] = [...ll];
			newValue[index] = {data_column: null, path: path};
			return {...state, [fieldName]: newValue};
		});
	}, [dataColumns, dispatch, setInputs]);

	const updateColumnHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const value = (selectedIndex !== -1) ? options[selectedIndex].value : '';
		const fieldName = select.dataset.name;
		if (!fieldName) {
			return;
		}
		const index = Number(select.dataset.index);
		setInputs((state) => {
			const ll = state[fieldName];
			if (!ll) {
				return state;
			}
			const newValue: {path: string | null, data_column: string | null}[] = [...ll];
			newValue[index] = {...ll[index], data_column: value};
			return {...state, [fieldName]: newValue};
		});
	}, [setInputs]);

	const addHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		const fieldName = event.currentTarget.dataset.name;
		if (!fieldName) {
			return;
		}
		setInputs((state) => {
			const ll = state[fieldName];
			if (!ll) {
				return state;
			}
			return {...state, [fieldName]: ll.concat([{path: null, data_column: null}])};
		});
	}, [setInputs]);

	const deleteHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		const fieldName = event.currentTarget.dataset.name;
		const indexString = event.currentTarget.dataset.index;
		if (!fieldName || !indexString) {
			return;
		}
		const index = Number(indexString);
		setInputs((state) => {
			const ll = state[fieldName];
			if (!ll) {
				return state;
			}
			return {...state, [fieldName]: ll.filter((_, i) => i !== index)};
		});
	}, [setInputs]);

	return (
		<>
			<span className="file-input__name">{input.name}: </span>
			<ul className="file-input__list">
				{input.value.map(({fileName, path, inputColumn}, index) => {
					const fileColumns = (path && Object.prototype.hasOwnProperty.call(dataColumns, path)) ? dataColumns[path] : [];
					return (
						<li key={input.name + index}>
							<select
								value={fileName ?? 'choose file'}
								onChange={updateInputHandler}
								name={input.name}
								data-name={input.name}
								data-index={index}
							>
								{
									fileName || <option id="">choose file</option>
								}
								{
									files.map((file) => (
										<option data-file-path={file.path}
											id={file.path}
											key={input.name + file.path}
										>
											{file.name}
										</option>
									))
								}
							</select>
							{
								(fileName !== null) &&
								<select value={inputColumn ?? 'choose column'}
									onChange={updateColumnHandler}
									data-name={input.name}
									data-index={index}
								>
									{
										inputColumn || <option id="">choose column</option>
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
							{
								multi && (
									<>
										{
											input.value.length > 1 &&
											<button data-index={index}
												data-name={input.name}
												onClick={deleteHandler}
											>
												delete
											</button>
										}
										{
											index===input.value.length - 1 &&
											<button data-name={input.name}
												onClick={addHandler}
											>
												add
											</button>
										}
									</>
								)
							}
						</li>
					);}
				)}
			</ul>
		</>
	);
}
