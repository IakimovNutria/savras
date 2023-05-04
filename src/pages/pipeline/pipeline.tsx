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
import { CloseSidebarContext } from '../../contexts/close-sidebar-context';
import Modal from '../../components/modal/modal';
import {SidebarTabs} from '../../components/sidebar-tabs/sidebar-tabs';
import ReactMarkdown from 'react-markdown';

function Pipeline() {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const [sidebar, setSidebar] = useState({id: null, name: null} as {id: null | string, name: null | SidebarName});
	const [modalFuncName, setModalFuncName] = useState('');
	const functionsInfo = useAppSelector(getFunctions);
	const modalFunc = useMemo(() => functionsInfo.find((func) => func.function === modalFuncName),
		[functionsInfo, modalFuncName]);
	const pipeline = useAppSelector(getCurrentPipeline);
	const isLoading = useAppSelector(getIsPipelineLoading);
	const userPipelines = useAppSelector(getUserPipelines);
	const sharedPipelines = useAppSelector(getSharedPipelines);
	const canEdit = useMemo(() => userPipelines.some((pipeline) => pipeline.id === id),
		[userPipelines, pipeline?.id]);
	const hasAccess = useMemo(() => canEdit || sharedPipelines.some((pipeline) => pipeline.id === id),
		[canEdit, sharedPipelines, pipeline?.id]);
	useEffect(() => {
		dispatch(fetchPipeline({ pipelineId: id === undefined ? '' : id }));
	}, [dispatch, id]);
	const changeVisible = useCallback(() => setVisible((visible) => !visible),
		[setVisible, visible]);
	const closeSidebar = useCallback(() => setSidebar({id: null, name: null}),
		[setSidebar]);
	const closeModal = useCallback(() => setModalFuncName(''), []);
	const preparedDoc = useMemo(() => modalFunc?.doc.replace(/\n+/g, '\n'),
		[modalFunc?.doc]);

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
						canEdit && <HeaderButton onClick={changeVisible}
							withoutRightBorder>Create</HeaderButton>
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
				<SidebarTabs sidebarId={sidebar.id}
					sidebarName={sidebar.name} />
			</CloseSidebarContext.Provider>
			{
				modalFunc && preparedDoc &&
				<Modal closeModal={closeModal}
					title={modalFunc.name}
				>
					<div className="pipeline__modal-doc">
						<ReactMarkdown>
							{preparedDoc}
						</ReactMarkdown>
					</div>
				</Modal>
			}
		</>);
}

export default Pipeline;
