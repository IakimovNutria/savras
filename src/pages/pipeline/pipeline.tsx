import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {fetchPipeline} from '../../store/pipeline-reducer/actions';
import Cell from '../../components/cell/cell';
import CellCreation from '../../components/cell-creation/cell-creation';
import {getCurrentPipeline, getIsPipelineLoading} from '../../store/pipeline-reducer/selectors';
import Loading from '../../components/loading/loading';
import NotFound from '../not-found/not-found';
import {getFunctions, getSharedPipelines, getUserPipelines} from '../../store/main-reducer/selectors';
import NoAccess from '../no-access/no-access';
import './pipeline.css';
import {HeaderButton} from '../../components/header-button/header-button';
import {SidebarName} from '../../enums/sidebar-name';
import FileInputsSidebar from '../../components/file-inputs-sidebar/file-inputs-sidebar';
import ParamInputsSidebar from '../../components/param-inputs-sidebar/param-inputs-sidebar';
import OutputsSidebar from '../../components/outputs-sidebar/outputs-sidebar';
import { CloseSidebarContext } from '../../contexts/close-sidebar-context';
import Modal from '../../components/modal/modal';

function Pipeline(): JSX.Element {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const [sidebar, setSidebar] = useState({id: '', name: SidebarName.INPUTS});
	const [modalFuncName, setModalFuncName] = useState('');
	const functionsInfo = useAppSelector(getFunctions);
	const modalFunc = useMemo(() => functionsInfo.find((func) => func.function === modalFuncName),
		[functionsInfo, modalFuncName]);
	const pipeline = useAppSelector(getCurrentPipeline);
	const isLoading = useAppSelector(getIsPipelineLoading);
	const canEdit = useAppSelector(getUserPipelines)
		.find((pipeline) => pipeline.id === id) !== undefined;
	const hasAccess = useAppSelector(getUserPipelines)
		.concat(useAppSelector(getSharedPipelines))
		.find((pipeline) => pipeline.id === id) !== undefined;
	useEffect(() => {
		dispatch(fetchPipeline({ pipelineId: id === undefined ? '' : id }));
	}, [dispatch, id]);
	const changeVisible = useCallback(() => setVisible((visible) => !visible),
		[setVisible, visible]);
	const closeSidebar = useCallback(() => setSidebar({id: '', name: SidebarName.INPUTS}),
		[setSidebar]);
	const sidebarComponent = useMemo(() => {
		if (pipeline === null) {
			return null;
		}
		const sidebarCell = pipeline.cells.find((cellInfo) => cellInfo.id === sidebar.id);
		if (!sidebarCell) {
			return null;
		}
		if (sidebar.name === SidebarName.INPUTS) {
			return (
				<FileInputsSidebar cellId={sidebarCell.id}
					inputsPaths={sidebarCell.inputs}
					inputsColumns={sidebarCell.data_columns}
					key={sidebarCell.id}
				/>
			);
		}
		if (sidebar.name === SidebarName.PARAMS) {
			return (
				<ParamInputsSidebar cellId={sidebarCell.id}
					inputParams={sidebarCell.input_params}
					functionName={sidebarCell.function}
					key={sidebarCell.id}
				/>
			);
		}
		if (sidebar.name === SidebarName.OUTPUTS) {
			return (
				<OutputsSidebar cellId={sidebarCell.id}
					outputs={sidebarCell.outputs}
					key={sidebarCell.id}
				/>
			);
		}
		return null;
	}, [pipeline, sidebar]);

	if (id === undefined) {
		return <NotFound />;
	}

	if (!hasAccess) {
		return <NoAccess />;
	}

	if (pipeline === null) {
		return isLoading ? <Loading /> : <NotFound />;
	}

	return (
		<>
			<header className="pipeline__header">
				<h1 className="pipeline__title">{pipeline.name}</h1>
				<div className="pipeline__header-buttons">
					{
						canEdit && <HeaderButton onClick={changeVisible}>Create</HeaderButton>
					}
					<HeaderButton linkTo="/">Main</HeaderButton>
				</div>
			</header>
			{
				visible &&
				<CellCreation pipelineId={id}
					changeVisible={changeVisible}
				/>
			}
			{
				pipeline.cells.map((cellInfo) => (
					<Cell cellInfo={cellInfo}
						pipelineId={id}
						canEdit={canEdit}
						key={cellInfo.id}
						setSidebar={setSidebar}
						setModalFuncName={setModalFuncName}
					/>
				))
			}
			<CloseSidebarContext.Provider value={closeSidebar}>
				{sidebarComponent}
			</CloseSidebarContext.Provider>
			{
				modalFunc &&
				<Modal closeModal={() => setModalFuncName('')}
					title={modalFunc.name}
				>
					<div className="pipeline__modal-doc">
						{modalFunc.doc}
					</div>
				</Modal>
			}
		</>);
}

export default Pipeline;
