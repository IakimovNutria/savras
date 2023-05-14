import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import useInterval from '@use-it/interval';
import CellInfo from '../../types/cell-info';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {deleteCell, executeCell, fetchCellInfo} from '../../store/pipeline-reducer/actions';
import {fetchFileColumns} from '../../store/main-reducer/actions';
import {CellStatus} from '../../enums/cell-status';
import {getFilesColumns, getFunctions} from '../../store/main-reducer/selectors';
import {getCellsStatus} from '../../store/pipeline-reducer/selectors';
import './cell.css';
import {getStatusStyle} from '../../utils/get-status-style';
import {HeaderButton} from '../header-button/header-button';
import {Button} from '../button/button';
import {SidebarName} from '../../enums/sidebar-name';
import {ButtonSize} from '../../enums/button-size';
import Modal from '../modal/modal';
import ReactMarkdown from 'react-markdown';
import {PipelineContext} from '../../contexts/pipeline-context';
import CellCharts from '../cell-charts/cell-charts';

type CellProps = {
    cellInfo: CellInfo;
};

function Cell({ cellInfo }: CellProps): JSX.Element {
	const dispatch = useAppDispatch();
	const dataColumns = useAppSelector(getFilesColumns);
	const cellStatus = useAppSelector(getCellsStatus)[cellInfo.id];
	const [modalVisible, setModalVisible] = useState(false);

	const {setSidebar, pipelineId, canEdit} = useContext(PipelineContext);

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
	const functionsInfo = useAppSelector(getFunctions);
	const funcDoc = useMemo(() => functionsInfo.find((func) => func.function === cellInfo.function)?.doc,
		[functionsInfo, cellInfo.function]);

	const executeHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(executeCell({ cellId: cellInfo.id }));
	}, [dispatch, cellInfo.id]);

	const deleteCellHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(deleteCell({ cellId: cellInfo.id, pipelineId }));
	}, [dispatch, cellInfo.id, pipelineId]);

	const openInputs = useCallback(() => setSidebar&&setSidebar({id: cellInfo.id, name: SidebarName.INPUTS}),
		[cellInfo.id, setSidebar]);
	const openParams = useCallback(() => setSidebar&&setSidebar({id: cellInfo.id, name: SidebarName.PARAMS}),
		[cellInfo.id, setSidebar]);
	const openOutputs = useCallback(() => setSidebar&&setSidebar({id: cellInfo.id, name: SidebarName.OUTPUTS}),
		[cellInfo.id, setSidebar]);
	const openModal = useCallback(() => setModalVisible(true),
		[setModalVisible, cellInfo.function]);
	const statusStyle = useMemo(() => ({ ...getStatusStyle(cellStatus) }), [cellStatus]);
	const closeModal = useCallback(() => setModalVisible(false), []);
	const preparedDoc = useMemo(() => funcDoc?.replace(/\n+/g, '\n'),
		[funcDoc]);

	return (
		<>
			<div className="cell">
				<header className="cell__header">
					<span style={statusStyle}
						className="cell__status">{cellStatus}</span>
					<div className="cell__function">
						<h2 className="cell__function-name">{cellInfo.function}</h2>
						{
							funcDoc &&
							<button className="cell__function-info-icon"
								onClick={openModal}
							/>
						}
					</div>
					{
						canEdit &&
						<HeaderButton onClick={deleteCellHandler}
							icon={<div className="cell__trash-icon"/>}>
							Delete
						</HeaderButton>
					}
				</header>
				<div className="cell__params-buttons">
					<Button onClick={openInputs}
						hasShadow
						size={ButtonSize.MEDIUM}
					>
						Inputs
					</Button>
					<Button onClick={openParams}
						size={ButtonSize.MEDIUM}
						hasShadow
					>
						Params
					</Button>
					<Button onClick={openOutputs}
						hasShadow
						size={ButtonSize.MEDIUM}
					>
						Outputs
					</Button>
				</div>
				{
					canEdit &&
					<Button onClick={executeHandler}
						hasShadow
						size={ButtonSize.LARGE}
					>
						Execute
					</Button>
				}
				<CellCharts cellId={cellInfo.id}
					outputs={cellInfo.outputs}
					inputs={cellInfo.inputs}
					dataColumns={cellInfo.data_columns}
				/>
			</div>
			{
				modalVisible && preparedDoc &&
				<Modal closeModal={closeModal}
					title={cellInfo.function}
				>
					<div className="cell__modal-doc">
						<ReactMarkdown>
							{preparedDoc}
						</ReactMarkdown>
					</div>
				</Modal>
			}
		</>
	);
}

export default Cell;
