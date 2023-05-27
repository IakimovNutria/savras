import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {fetchPipeline} from '../../store/pipeline-reducer/actions';
import CellCreation from '../../components/cell-creation/cell-creation';
import {getCurrentPipeline, getIsPipelineLoading} from '../../store/pipeline-reducer/selectors';
import Loading from '../../components/loading/loading';
import NotFound from '../not-found/not-found';
import {getFunctions, getSharedPipelines, getUserPipelines} from '../../store/main-reducer/selectors';
import NoAccess from '../no-access/no-access';
import './pipeline.css';
import {HeaderButton} from '../../components/header-button/header-button';
import {SidebarName} from '../../enums/sidebar-name';
import {SidebarTabs} from '../../components/sidebar-tabs/sidebar-tabs';
import Graph from '../../components/graph/graph';
import {PipelineContext} from '../../contexts/pipeline-context';
import {getEdgeId} from '../../utils/get-edge-id';
import {fetchCellsFunctionsInfo} from '../../store/main-reducer/actions';

function Pipeline() {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const [sidebar, setSidebar] = useState({id: null, name: null} as {id: null | string, name: null | SidebarName});
	const pipeline = useAppSelector(getCurrentPipeline);
	const isLoading = useAppSelector(getIsPipelineLoading);
	const userPipelines = useAppSelector(getUserPipelines);
	const sharedPipelines = useAppSelector(getSharedPipelines);
	const functions = useAppSelector(getFunctions);
	const canEdit = useMemo(() => userPipelines.some((pipeline) => pipeline.id === id),
		[userPipelines, pipeline?.id]);
	const hasAccess = useMemo(() => canEdit || sharedPipelines.some((pipeline) => pipeline.id === id),
		[canEdit, sharedPipelines, pipeline?.id]);
	useEffect(() => {
		if (pipeline?.id !== id && id) {
			dispatch(fetchPipeline({pipelineId: id}));
		}
	}, [dispatch, id]);
	const changeVisible = useCallback(() => setVisible((visible) => !visible),
		[setVisible, visible]);
	const cellNodesInfo = useMemo(() => {
		if (!pipeline) {
			return [];
		}
		return pipeline.cells.map((cellInfo) => ({
			id: cellInfo.id,
			type: 'cell' as const,
			position: {
				x: cellInfo.x,
				y: cellInfo.y
			},
			data: {
				cellInfo: cellInfo
			}
		}));
	}, [pipeline?.cells]);

	useEffect(() => {
		if (functions === null) {
			dispatch(fetchCellsFunctionsInfo());
		}
	}, [functions]);

	if (!id) {
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
			<PipelineContext.Provider value={{pipelineId: pipeline.id, canEdit, setSidebar}}>
				<Graph cellNodes={cellNodesInfo}
					graphEdges={pipeline.edges.map((e) => ({id: getEdgeId(e[0], e[1]), source: e[0], target: e[1], label: ''}))}
				/>
				<SidebarTabs sidebarId={sidebar.id}
					sidebarName={sidebar.name}
				/>
			</PipelineContext.Provider>
		</>);
}

export default Pipeline;
