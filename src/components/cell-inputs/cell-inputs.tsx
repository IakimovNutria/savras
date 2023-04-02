import React, {
	ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { useAppSelector } from '../../hooks';
import CellInput from '../../types/cell-input';
import CellArguments from '../../types/cell-arguments';
import { getFiles, getFilesColumns } from '../../store/main-reducer/selectors';

type InputProps = {
    cellId: string;
    updateInputHandler: (event: ChangeEvent<HTMLSelectElement>) => void;
    updateShowGraphHandler: (event: FormEvent<HTMLInputElement>) => void;
    updateColumnHandler: (event: ChangeEvent<HTMLSelectElement>) => void;
    submitInputsHandler: (event: FormEvent<HTMLButtonElement>) => void;
    cellParams: CellArguments;
};

function CellInputs({
	cellId, updateInputHandler, updateColumnHandler, submitInputsHandler, updateShowGraphHandler, cellParams,
}: InputProps): JSX.Element {
	const files = useAppSelector(getFiles);
	const dataColumns = useAppSelector(getFilesColumns);
	const inputPaths = cellParams.inputsPath;
	const inputColumns = cellParams.selectedInputsColumn;
	const defaultInputsArray: CellInput[] = [];
	const [inputsArray, setInputsArray] = useState(defaultInputsArray);
	const defaultIsShowGraph: {[key: string]: boolean} = {};
	const [isShowGraph, setIsShowGraph] = useState(defaultIsShowGraph);

	useEffect(() => {
		function getFileName(path: string | null) {
			const file = files.find((elem) => elem.path === path);
			if (file === undefined) {
				return null;
			}
			return file.name;
		}
		for (const key in cellParams.inputsPath) {
			const graphInput = cellParams.graphInputs[key];
			setIsShowGraph((state) => ({ ...state, [key]: graphInput }));
		}
		const newInputsArray = [];
		for (const key in inputPaths) {
			const toPush: CellInput = {
				name: key,
				fileName: getFileName(inputPaths[key]),
				inputColumn: inputColumns[key],
				path: inputPaths[key],
			};
			newInputsArray.push(toPush);
		}
		setInputsArray(newInputsArray);
	}, [cellParams, inputColumns, inputPaths, files]);

	const getFileColumns = (path: string | null) => {
		if (path && Object.prototype.hasOwnProperty.call(dataColumns, path)) {
			return dataColumns[path];
		}
		return [];
	};

	return (
		<div className="cell__inputs">
			<h3>Inputs</h3>
			<ul className="cell__input-items">
				{
					inputsArray.map((input) => (
						<li className="cell__input-item"
							key={cellId + input.name}>
							<div className="cell__show-graph-checkbox">
								<img alt="graph-icon"
									src="/img/graph-icon.png"
									width={15}
									height={15} />
								<input
									type="checkbox"
									checked={isShowGraph[input.name]}
									id={input.name}
									onChange={updateShowGraphHandler}
								/>
							</div>
							<span>
								{input.name}
    :
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
						</li>
					))
				}
			</ul>
			<button className="cell__save-button"
				onClick={submitInputsHandler}>Save inputs</button>
		</div>);
}

export default CellInputs;
