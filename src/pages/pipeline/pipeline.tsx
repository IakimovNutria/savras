import React, {useCallback, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPipeline } from '../../store/pipeline-reducer/actions';
import Cell from '../../components/cell/cell';
import CellCreation from '../../components/cell-creation/cell-creation';
import { getCurrentPipeline, getIsPipelineLoading } from '../../store/pipeline-reducer/selectors';
import Loading from '../../components/loading/loading';
import NotFound from '../not-found/not-found';
import { getUserPipelines, getSharedPipelines } from '../../store/main-reducer/selectors';
import NoAccess from '../no-access/no-access';
import './pipeline.css';

function Pipeline(): JSX.Element {
	const { id } = useParams();

	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
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

	const changeVisible = useCallback(() => setVisible(!visible), [setVisible, visible]);

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
		<React.Fragment>
			<header className="pipeline__header">
				<h1>{pipeline.name}</h1>
				{
					canEdit && <button onClick={changeVisible}
						className="pipeline__header-button">Create</button>
				}
				<Link className="pipeline__header-button"
					to="/">Back to main</Link>
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
					/>)
				)
			}
		</React.Fragment>);
}

export default Pipeline;
