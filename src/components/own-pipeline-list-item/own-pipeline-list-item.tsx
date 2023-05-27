import {Button} from '../button/button';
import {ButtonSize} from '../../enums/button-size';
import {deletePipeline, forkPipeline} from '../../store/main-reducer/actions';
import React, {useCallback, useState} from 'react';
import ShortPipelineInfo from '../../types/short-pipeline-info';
import {useAppDispatch} from '../../hooks';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import ShareModal from '../share-modal/share-modal';
import './own-pipeline-list-item.css';
import {MainListItemName} from '../main-list-item-name/main-list-item-name';

type OwnPipelineListItemProps = {
	pipeline: ShortPipelineInfo;
}

export function OwnPipelineListItem({pipeline}: OwnPipelineListItemProps): JSX.Element {
	const dispatch = useAppDispatch();
	const forkPipelineHandler = useCallback(() => dispatch(forkPipeline({ pipelineId: pipeline.id })),
		[dispatch, pipeline.id]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const openShareModal = useCallback(() => setShowShareModal(true), [setShowShareModal]);
	const hideDeletePipelineModal = useCallback(() => setShowDeleteModal(false), [setShowDeleteModal]);
	const deletePipelineHandler = useCallback(() => {
		setShowDeleteModal(false);
		dispatch(deletePipeline({ pipelineId: pipeline.id }));
	}, [dispatch, pipeline.id, setShowDeleteModal]);
	const openDeleteModal = useCallback(() => setShowDeleteModal(true), []);
	return (
		<>
			<div className="own-pipeline-list-item__buttons">
				<Button
					id={pipeline.id}
					linkTo={`/pipeline/${pipeline.id}`}
					size={ButtonSize.SMALL}
					plainRight
				>
					Open
				</Button>
				<Button id={pipeline.id}
					onClick={forkPipelineHandler}
					size={ButtonSize.SMALL}
					plainLeft
				>
					Fork
				</Button>
			</div>
			<MainListItemName name={pipeline.name} />
			<div className="own-pipeline-list-item__buttons">
				<Button id={pipeline.id}
					onClick={openShareModal}
					size={ButtonSize.SMALL}
					plainRight
				>
					Share
				</Button>
				<Button id={pipeline.id}
					onClick={openDeleteModal}
					size={ButtonSize.SMALL}
					plainLeft
				>
					Delete
				</Button>
			</div>
			{
				showDeleteModal && (
					<ConfirmationModal
						title="Delete pipeline"
						text={`Are you sure you want to delete the pipeline titled ${pipeline.name}?`}
						onConfirm={deletePipelineHandler}
						onNotConfirm={hideDeletePipelineModal}
					/>
				)
			}
			{
				showShareModal &&
				<ShareModal setShowShareModal={setShowShareModal}
					pipelineId={pipeline.id} />
			}
		</>
	);
}
