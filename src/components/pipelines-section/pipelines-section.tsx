import {Link} from 'react-router-dom';
import {createPipeline, deletePipeline, forkPipeline} from '../../store/main-reducer/actions';
import React, {ChangeEvent, FormEvent, useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getSharedPipelines, getUserPipelines} from '../../store/main-reducer/selectors';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import ShareModal from '../share-modal/share-modal';
import MainList from '../main-list/main-list';
import {Button} from '../button/button';
import './pipelines-section.css';
import {ButtonSize} from '../../enums/button-size';

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
			<section className="pipelines-section">
				<h2 style={{ display: 'none' }}>pipelines</h2>
				<h3 className="pipelines-section__title">Create new pipeline</h3>
				<form className="pipelines-section__form"
					onSubmit={createPipelineHandler}>
					<input
						required
						className="pipelines-section__input"
						placeholder="Name"
						value={newPipelineName}
						onChange={updateNewPipelineName}
					/>
					<Button type="submit"
						size={ButtonSize.MEDIUM}
						plainLeft
					>
						Create
					</Button>
				</form>
				<MainList items={userPipelines}
					keyExtractor={(pipeline) => pipeline.id}
					renderItem={(pipeline) => (
						<>
							<div className="pipelines-section__buttons">
								<Button
									id={pipeline.id}
									linkTo={`/pipeline/${pipeline.id}`}
									size={ButtonSize.SMALL}
									plainRight
								>
									Open
								</Button>
								<Button id={pipeline.id}
									onClick={() => dispatch(forkPipeline({ pipelineId: pipeline.id }))}
									size={ButtonSize.SMALL}
									plainLeft
								>
									Fork
								</Button>
							</div>
							<span>{pipeline.name}</span>
							<div className="pipelines-section__buttons">
								<Button id={pipeline.id}
									onClick={openShareModal}
									size={ButtonSize.SMALL}
									plainRight
								>
									Share
								</Button>
								<Button id={pipeline.id}
									onClick={openDeletePipelineModal}
									size={ButtonSize.SMALL}
									plainLeft
								>
									Delete
								</Button>
							</div>
						</>
					)}
					title="My pipelines"
				/>
				<MainList items={sharedPipelines}
					keyExtractor={(pipeline) => pipeline.id}
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
					title="Shared pipelines"
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
