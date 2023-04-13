import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import React, {FormEvent, useCallback, useEffect, useState} from 'react';
import useInterval from '@use-it/interval';
import CellInfo from '../../types/cell-info';
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
	deleteCell,
	executeCell,
	fetchCellInfo,
	fetchFileColumns,
	moveCell,
	saveFile,
	updateInputs,
	updateParams,
} from '../../store/api-actions';
import CellInputs from '../cell-inputs/cell-inputs';
import CellArguments from '../../types/cell-arguments';
import CellParamInputs from '../cell-param-inputs/cell-param-inputs';
import CellOutputs from '../cell-outputs/cell-outputs';
import { CellStatus } from '../../enums/cell-status';
import CellGraphs from '../cell-graphs/cell-graphs';
import { getFilesColumns, getFunctions } from '../../store/main-reducer/selectors';
import { getCellsStatus } from '../../store/pipeline-reducer/selectors';
import './cell.css';
import {getStatusStyle} from '../../utils/get-status-style';

type CellProps = {
    cellInfo: CellInfo;
    pipelineId: string;
    canEdit: boolean;
};

function Cell({ cellInfo, pipelineId, canEdit }: CellProps): JSX.Element {
	const dispatch = useAppDispatch();
	const functionsInfo = useAppSelector(getFunctions);
	const functionInfo = functionsInfo.find((elem) => (elem.function === cellInfo.function));
	const dataColumns = useAppSelector(getFilesColumns);
	const cellStatus: string = useAppSelector(getCellsStatus)[cellInfo.id];

	const defaultCellParams: CellArguments = {
		inputsPath: cellInfo.inputs,
		inputParams: cellInfo.input_params,
		outputs: {},
		selectedInputsColumn: cellInfo.data_columns,
		graphInputs: {},
		graphOutputs: {},
	};
	const [cellParams, setCellParams] = useState(defaultCellParams);

	useEffect(() => {
		for (const key in cellInfo.inputs) {
			setCellParams((state) => ({ ...state, graphInputs: { ...state.graphInputs, [key]: false } }));
		}
		for (const key in cellInfo.outputs) {
			setCellParams((state) => ({ ...state, graphOutputs: { ...state.graphOutputs, [key]: false } }));
		}
	}, [cellInfo]);

	useEffect(() => {
		for (const key in cellInfo.inputs) {
			const path = cellInfo.inputs[key];
			if (path && !Object.prototype.hasOwnProperty.call(dataColumns, path)) {
				dispatch(fetchFileColumns({ path }));
			}
		}
	});

	useInterval(() => {
		dispatch(fetchCellInfo({ cellId: cellInfo.id }));
	}, cellStatus === CellStatus.IN_PROCESS ? 1000 * 5 : null);

	const stopHandler = useCallback((event: DraggableEvent, data: DraggableData) => {
		event.preventDefault();
		dispatch(moveCell({ cellId: cellInfo.id, x: data.x, y: data.y }));
	}, [dispatch]);

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

	const updateInputColumnHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const value = (selectedIndex !== -1) ? options[selectedIndex].value : '';
		const fieldName = select.id;
		setCellParams((state) => ({ ...state, selectedInputsColumn: { ...state.selectedInputsColumn, [fieldName]: value } }));
	}, []);

	const updateParamHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.type === 'checkbox' ? event.target.checked : event.target.value;
		setCellParams((state) => ({ ...state, inputParams: { ...state.inputParams, [fieldName]: value } }));
	}, []);

	const updateOutputNameHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const { value } = event.target;
		setCellParams((state) => ({ ...state, outputs: { ...state.outputs, [fieldName]: value } }));
	}, []);

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
		dispatch(updateInputs({ cellId: cellInfo.id, inputs: toUpdate }));
	}, [cellParams, dispatch, cellInfo.id]);

	const submitParamsHandler = useCallback(async (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const toUpdate: {field: string, value: string | boolean | number}[] = [];
		for (const key in cellParams.inputParams) {
			const notNumberValue = cellParams.inputParams[key];
			const paramType = functionInfo ? functionInfo.input_params[key] : 0;
			const value = (paramType === 'int' || paramType === 'float') ? Number(notNumberValue) : notNumberValue;
			toUpdate.push({ field: key, value });
		}
		dispatch(updateParams({ cellId: cellInfo.id, params: toUpdate }));
	}, [cellParams, cellInfo.id, dispatch]);

	const saveFilesHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		for (const key in cellParams.outputs) {
			const value = cellParams.outputs[key];
			if (value !== '' && value != null) {
				const path = cellInfo.outputs[key];
				if (path !== null) {
					dispatch(saveFile({ path, name: value }));
				}
			}
		}
	}, [cellParams, dispatch, cellInfo.outputs]);

	const executeHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(executeCell({ cellId: cellInfo.id }));
	}, [dispatch, cellInfo.id]);

	const deleteCellHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(deleteCell({ cellId: cellInfo.id, pipelineId }));
	}, [dispatch, cellInfo.id, pipelineId]);

	const updateShowGraphInputsHandler = useCallback((event: FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.checked;
		setCellParams((state) => ({ ...state, graphInputs: { ...state.graphInputs, [fieldName]: value } }));
	}, []);

	const updateShowGraphOutputHandler = useCallback((event: FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.checked;
		setCellParams((state) => ({ ...state, graphOutputs: { ...state.graphOutputs, [fieldName]: value } }));
	}, []);

	return (
		<Draggable
			handle=".cell__header"
			onStop={stopHandler}
			defaultPosition={{ x: cellInfo.x, y: cellInfo.y }}
			bounds={{ left: 0, top: 0 }}
			key={cellInfo.id}
			disabled={!canEdit}
		>
			<div className="cell">
				<header className="cell__header">
					<span style={{ ...getStatusStyle(cellStatus) }}
						className="cell__status">{cellStatus}</span>
					<h2 className="cell__function-name">{cellInfo.function}</h2>
					<button className="cell__header-button"
						onClick={deleteCellHandler}>Delete</button>
				</header>
				<div className="cell__body">
					<CellInputs
						cellId={cellInfo.id}
						updateInputHandler={updateInputHandler}
						updateColumnHandler={updateInputColumnHandler}
						submitInputsHandler={submitInputsHandler}
						updateShowGraphHandler={updateShowGraphInputsHandler}
						cellParams={cellParams}
					/>
					<CellParamInputs
						cellId={cellInfo.id}
						functionName={cellInfo.function}
						inputParams={cellInfo.input_params}
						submitParamsHandler={submitParamsHandler}
						updateParamHandler={updateParamHandler}
						cellParams={cellParams}
					/>
					<CellOutputs
						cellId={cellInfo.id}
						outputs={cellInfo.outputs}
						saveFilesHandler={saveFilesHandler}
						updateOutputNameHandler={updateOutputNameHandler}
						cellParams={cellParams}
						updateShowGraphHandler={updateShowGraphOutputHandler}
					/>
					<CellGraphs cellId={cellInfo.id}
						cellParams={cellParams}
						outputs={cellInfo.outputs} />
				</div>
				<button
					className="cell__execute-button"
					key={`${cellInfo.id}execute`}
					onClick={executeHandler}
				>
					Execute
				</button>
			</div>
		</Draggable>);
}

export default Cell;
