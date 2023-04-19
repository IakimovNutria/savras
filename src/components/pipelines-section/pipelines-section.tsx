import {Link} from 'react-router-dom';
import {createPipeline, deletePipeline, forkPipeline} from '../../store/main-reducer/actions';
import React, {ChangeEvent, FormEvent, useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getSharedPipelines, getUserPipelines} from '../../store/main-reducer/selectors';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import ShareModal from '../share-modal/share-modal';
import MainList from '../main-list/main-list';

export default function PipelinesSection(): JSX.Element {
	const dispatch = useAppDispatch();
	const userPipelines = useAppSelector(getUserPipelines);
	const sharedPipelines = useAppSelector(getSharedPipelines);
	const [newPipelineName, setNewPipelineName] = useState('');
	const [showDeletePipelineModal, setShowDeletePipelineModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const [pipelineToShare, setPipelineToShare] = useState('');
	const [pipelineToDelete, setPipelineToDelete] = useState('');
	const openShareModal = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const pipelineId = event.currentTarget.id;
		setPipelineToShare(pipelineId);
		setShowShareModal(true);
	}, []);

	const hideDeletePipelineModal = useCallback(() => setShowDeletePipelineModal(false), []);
	const deletePipelineHandler = useCallback(() => {
		setShowDeletePipelineModal(false);
		dispatch(deletePipeline({ pipelineId: pipelineToDelete }));
	}, [dispatch, pipelineToDelete]);
	const createPipelineHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		dispatch(createPipeline({ name: newPipelineName }));
		setNewPipelineName('');
	}, [newPipelineName, dispatch]);

	const openDeletePipelineModal = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setPipelineToDelete(event.currentTarget.id);
		setShowDeletePipelineModal(true);
	}, []);
	const updateNewPipelineName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setNewPipelineName(event.target.value);
	}, []);

	return (
		<>
			<section className="main__section">
				<h2 style={{ display: 'none' }}>pipelines</h2>
				<h3>Create new pipeline</h3>
				<form className="main__create-form"
					onSubmit={createPipelineHandler}>
					<input
						required
						className="main__create-form-input"
						placeholder="Name"
						value={newPipelineName}
						onChange={updateNewPipelineName}
					/>
					<input className="main__submit-button"
						type="submit"
						value="Create" />
				</form>
				<h3>My pipelines</h3>
				<MainList items={userPipelines}
					getItemKey={(pipeline) => pipeline.id}
					renderItem={(pipeline) => (
						<>
							<Link
								className="main__list-item-link"
								id={pipeline.id}
								to={`/pipeline/${pipeline.id}`}
							>
								Open
							</Link>
							<button className="main__list-item-button"
								id={pipeline.id}
								onClick={() => dispatch(forkPipeline({ pipelineId: pipeline.id }))}
							>
								Fork
							</button>
							<span>{pipeline.name}</span>
							<button className="main__list-item-button"
								id={pipeline.id}
								onClick={openShareModal}
							>
								Share
							</button>
							<button className="main__list-item-button"
								id={pipeline.id}
								onClick={openDeletePipelineModal}
							>
								Delete
							</button>
						</>
					)}
				/>
				<h3>Shared pipelines</h3>
				<MainList items={sharedPipelines}
					getItemKey={(pipeline) => pipeline.id}
					renderItem={(pipeline) => (
						<>
							<Link
								className="main__list-item-link"
								id={pipeline.id}
								to={`/pipeline/${pipeline.id}`}
							>
								Open
							</Link>
							<span>{pipeline.name}</span>
							<button
								className="main__list-item-button"
								id={pipeline.id}
								onClick={() => dispatch(forkPipeline({ pipelineId: pipeline.id }))}
							>
								Fork
							</button>
						</>
					)}
				/>
			</section>
			{
				showDeletePipelineModal && (
					<ConfirmationModal
						title="Delete pipeline"
						text={`Are you sure you want to delete the pipeline titled ${userPipelines.find((pipeline) => pipeline.id === pipelineToDelete)?.name}?`}
						onConfirm={deletePipelineHandler}
						onNotConfirm={hideDeletePipelineModal}
					/>
				)
			}
			{
				showShareModal &&
				<ShareModal setShowShareModal={setShowShareModal}
					pipelineId={pipelineToShare} />
			}
		</>
	);
}
