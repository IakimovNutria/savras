import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPipeline } from '../../store/api-actions';
import Cell from '../../components/cell/cell';
import CreateButtons from '../../components/create-buttons/create-buttons';
import { getCurrentPipeline, getIsPipelineLoading } from '../../store/pipeline-reducer/selectors';
import Loading from '../../components/loading/loading';
import NotFound from '../not-found/not-found';
import { getUserPipelines, getSharedPipelines } from '../../store/main-reducer/selectors';
import NoAccess from '../no-access/no-access';

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
					canEdit && <button onClick={() => setVisible(!visible)}
						className="pipeline__header-button">Create</button>
				}
				<button className="pipeline__header-button"
					onClick={() => { window.location.href = '/'; }}>Back to main</button>
			</header>
			{
				visible && <CreateButtons pipelineId={id} />
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
