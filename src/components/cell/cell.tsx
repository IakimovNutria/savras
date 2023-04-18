import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import React, {FormEvent, useCallback, useEffect, useState} from 'react';
import useInterval from '@use-it/interval';
import CellInfo from '../../types/cell-info';
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
	deleteCell,
	executeCell,
	fetchCellInfo,
	moveCell
} from '../../store/pipeline-reducer/actions';
import { fetchFileColumns } from '../../store/main-reducer/actions';
import CellInputs from '../cell-inputs/cell-inputs';
import CellParams from '../../types/cell-params';
import CellParamInputs from '../cell-param-inputs/cell-param-inputs';
import CellOutputs from '../cell-outputs/cell-outputs';
import { CellStatus } from '../../enums/cell-status';
import CellGraphs from '../cell-graphs/cell-graphs';
import { getFilesColumns } from '../../store/main-reducer/selectors';
import { getCellsStatus } from '../../store/pipeline-reducer/selectors';
import './cell.css';
import {getStatusStyle} from '../../utils/get-status-style';
import {CellContext} from '../../contexts/cell-context';

type CellProps = {
    cellInfo: CellInfo;
    pipelineId: string;
    canEdit: boolean;
};

function Cell({ cellInfo, pipelineId, canEdit }: CellProps): JSX.Element {
	const dispatch = useAppDispatch();
	const dataColumns = useAppSelector(getFilesColumns);
	const cellStatus: string = useAppSelector(getCellsStatus)[cellInfo.id];

	const defaultCellParams: CellParams = {
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
	}, [cellInfo.inputs]);

	useInterval(() => {
		dispatch(fetchCellInfo({ cellId: cellInfo.id }));
	}, cellStatus === CellStatus.IN_PROCESS ? 1000 * 5 : null);

	const stopHandler = useCallback((event: DraggableEvent, data: DraggableData) => {
		event.preventDefault();
		dispatch(moveCell({ cellId: cellInfo.id, x: data.x, y: data.y }));
	}, [dispatch]);

	const executeHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(executeCell({ cellId: cellInfo.id }));
	}, [dispatch, cellInfo.id]);

	const deleteCellHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(deleteCell({ cellId: cellInfo.id, pipelineId }));
	}, [dispatch, cellInfo.id, pipelineId]);

	return (
		<CellContext.Provider value={{cellParams, setCellParams}}>
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
						/>
						<CellParamInputs
							cellId={cellInfo.id}
							functionName={cellInfo.function}
							inputParams={cellInfo.input_params}
						/>
						<CellOutputs
							cellId={cellInfo.id}
							outputs={cellInfo.outputs}
						/>
						<CellGraphs cellId={cellInfo.id}
							cellParams={cellParams}
							outputs={cellInfo.outputs} />
					</div>
					<button
						className="cell__execute-button"
						key={`${cellInfo.id} execute`}
						onClick={executeHandler}
					>
						Execute
					</button>
				</div>
			</Draggable>
		</CellContext.Provider>);
}

export default Cell;
