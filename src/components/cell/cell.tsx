import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import React, { FormEvent, useEffect, useState } from 'react';
import useInterval from '@use-it/interval';
import CellInfo from '../../types/cell-info';
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
	deleteCell,
	executeCell, fetchCellInfo, fetchFileColumns,
	moveCell,
	saveFile,
	updateInputs,
	updateParams,
} from '../../store/api-actions';
import CellInputs from '../cell-inputs/cell-inputs';
import CellArguments from '../../types/cell-arguments';
import CellParamInputs from '../cell-param-inputs/cell-param-inputs';
import CellOutputs from '../cell-outputs/cell-outputs';
import { CellStatus, CellStatusStyle } from '../../enums/cell-status';
import CellGraphs from '../cell-graphs/cell-graphs';
import { getFilesColumns, getFunctions } from '../../store/main-reducer/selectors';
import { getCellsStatus } from '../../store/pipeline-reducer/selectors';

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

	const stopHandler = (event: DraggableEvent, data: DraggableData) => {
		event.preventDefault();
		dispatch(moveCell({ cellId: cellInfo.id, x: data.x, y: data.y }));
	};

	const updateInputHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
	};

	const updateInputColumnHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const value = (options.selectedIndex !== -1) ? options[selectedIndex].value : '';
		const fieldName = select.id;
		setCellParams((state) => ({ ...state, selectedInputsColumn: { ...state.selectedInputsColumn, [fieldName]: value } }));
	};

	const updateParamHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.type === 'checkbox' ? event.target.checked : event.target.value;
		setCellParams((state) => ({ ...state, inputParams: { ...state.inputParams, [fieldName]: value } }));
	};

	const updateOutputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const { value } = event.target;
		setCellParams((state) => ({ ...state, outputs: { ...state.outputs, [fieldName]: value } }));
	};

	const submitInputsHandler = async (event: FormEvent<HTMLButtonElement>) => {
		const elem = cellParams;
		const toUpdate: {path: string, data_column: string, field: string}[] = [];
		for (const key in elem.inputsPath) {
			const path = elem.inputsPath[key];
			const dataColumn = elem.selectedInputsColumn[key];
			if (path !== null && dataColumn !== null) {
				toUpdate.push({ path, data_column: dataColumn, field: key });
			}
		}
		dispatch(updateInputs({ cellId: cellInfo.id, inputs: toUpdate }));
		event.preventDefault();
	};

	const submitParamsHandler = async (event: FormEvent<HTMLButtonElement>) => {
		const toUpdate: {field: string, value: string | boolean | number}[] = [];
		for (const key in cellParams.inputParams) {
			const notNumberValue = cellParams.inputParams[key];
			const paramType = functionInfo ? functionInfo.input_params[key] : 0;
			const value = (paramType === 'int' || paramType === 'float') ? Number(notNumberValue) : notNumberValue;
			toUpdate.push({ field: key, value });
		}
		dispatch(updateParams({ cellId: cellInfo.id, params: toUpdate }));
		event.preventDefault();
	};

	const saveFilesHandler = (event: FormEvent<HTMLButtonElement>) => {
		const elem = cellParams;
		for (const key in elem.outputs) {
			const value = elem.outputs[key];
			if (value !== '' && value != null) {
				const path = cellInfo.outputs[key];
				if (path !== null) {
					dispatch(saveFile({ path, name: value }));
				}
			}
		}
		event.preventDefault();
	};

	const executeHandler = async (event: FormEvent<HTMLButtonElement>) => {
		dispatch(executeCell({ cellId: cellInfo.id }));
		event.preventDefault();
	};

	const deleteCellHandler = (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(deleteCell({ cellId: cellInfo.id, pipelineId }));
	};

	const updateShowGraphInputsHandler = (event: FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.checked;
		setCellParams((state) => ({ ...state, graphInputs: { ...state.graphInputs, [fieldName]: value } }));
	};

	const updateShowGraphOutputHandler = (event: FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.checked;
		setCellParams((state) => ({ ...state, graphOutputs: { ...state.graphOutputs, [fieldName]: value } }));
	};

	const getStatusStyle = (status: string) => {
		if (Object.prototype.hasOwnProperty.call(CellStatusStyle, status)) {
			return CellStatusStyle[status as keyof typeof CellStatusStyle];
		}
		return { color: 'red' };
	};

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
