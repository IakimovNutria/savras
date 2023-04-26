import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import React, {Dispatch, FormEvent, SetStateAction, useCallback, useEffect} from 'react';
import useInterval from '@use-it/interval';
import CellInfo from '../../types/cell-info';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {deleteCell, executeCell, fetchCellInfo, moveCell} from '../../store/pipeline-reducer/actions';
import {fetchFileColumns} from '../../store/main-reducer/actions';
import {CellStatus} from '../../enums/cell-status';
import {getFilesColumns} from '../../store/main-reducer/selectors';
import {getCellsStatus} from '../../store/pipeline-reducer/selectors';
import './cell.css';
import {getStatusStyle} from '../../utils/get-status-style';
import {HeaderButton} from '../header-button/header-button';
import {Button} from '../button/button';
import {SidebarName} from '../../enums/sidebar-name';

type CellProps = {
    cellInfo: CellInfo;
    pipelineId: string;
    canEdit: boolean;
	setSidebar: Dispatch<SetStateAction<{id: string, name: SidebarName}>>;
	setModalFuncName: Dispatch<SetStateAction<string>>;
};

function Cell({ cellInfo, pipelineId, canEdit, setSidebar, setModalFuncName }: CellProps): JSX.Element {
	const dispatch = useAppDispatch();
	const dataColumns = useAppSelector(getFilesColumns);
	const cellStatus: string = useAppSelector(getCellsStatus)[cellInfo.id];

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

	const openInputs = useCallback(() => setSidebar({id: cellInfo.id, name: SidebarName.INPUTS}),
		[cellInfo.id, setSidebar]);
	const openParams = useCallback(() => setSidebar({id: cellInfo.id, name: SidebarName.PARAMS}),
		[cellInfo.id, setSidebar]);
	const openOutputs = useCallback(() => setSidebar({id: cellInfo.id, name: SidebarName.OUTPUTS}),
		[cellInfo.id, setSidebar]);
	const changeModalFuncName = useCallback(() => setModalFuncName(cellInfo.function),
		[setModalFuncName, cellInfo.function]);

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
					<div className="cell__function">
						<h2 className="cell__function-name">{cellInfo.function}</h2>
						<button className="cell__function-info-icon"
							onClick={changeModalFuncName}
						/>
					</div>
					<HeaderButton onClick={deleteCellHandler}
						icon={<div className="cell__trash-icon"/>}>
						Delete
					</HeaderButton>
				</header>
				<div className="cell__params-buttons">
					<Button onClick={openInputs}
						className="cell__button"
						hasShadow
					>
						Inputs
					</Button>
					<Button onClick={openParams}
						className="cell__button"
						hasShadow
					>
						Params
					</Button>
					<Button onClick={openOutputs}
						className="cell__button"
						hasShadow
					>
						Outputs
					</Button>
				</div>
				<Button className="cell__execute-button"
					onClick={executeHandler}
					hasShadow
				>
					Execute
				</Button>
			</div>
		</Draggable>
	);
}

export default Cell;
