import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
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

	console.log(modalFuncName);
	console.log(modalFunc);
	console.log(functionsInfo);
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
					<Link className="pipeline__header-button"
						to="/">Main</Link>
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
				{
					pipeline.cells
						.filter((cellInfo) => cellInfo.id === sidebar.id)
						.map((cellInfo) => {
							if (sidebar.name === SidebarName.INPUTS) {
								return (
									<FileInputsSidebar cellId={cellInfo.id}
										inputsPaths={cellInfo.inputs}
										inputsColumns={cellInfo.data_columns}
										key={cellInfo.id}
									/>
								);
							}
							if (sidebar.name === SidebarName.PARAMS) {
								return (
									<ParamInputsSidebar cellId={cellInfo.id}
										inputParams={cellInfo.input_params}
										functionName={cellInfo.function}
										key={cellInfo.id}
									/>
								);
							}
							if (sidebar.name === SidebarName.OUTPUTS) {
								return (
									<OutputsSidebar cellId={cellInfo.id}
										outputs={cellInfo.outputs}
										key={cellInfo.id}
									/>
								);
							}
							return null;
						})
				}
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
