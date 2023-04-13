import Modal from '../modal/modal';
import React, {useState} from 'react';
import {sharePipeline} from '../../store/api-actions';
import {useAppDispatch} from '../../hooks';
import './share-modal.css';

type ConfirmationModalProps = {
	setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
	pipelineId: string;
}

export default function ShareModal({
	setShowShareModal, pipelineId
}: ConfirmationModalProps): JSX.Element {
	const dispatch = useAppDispatch();
	const [userToShare, setUserToShare] = useState('');
	function sharePipelineHandler() {
		dispatch(sharePipeline({ username: userToShare, pipelineId: pipelineId }));
		setUserToShare('');
		setShowShareModal(false);
	}

	return (
		<Modal text="Enter the login of the user you want to share the pipeline with"
			title="Share pipeline"
			headerBodyGap={11}
		>
			<div className="share-modal">
				<form className="share-modal__form">
					<input className="share-modal__input"
						placeholder="user login"
						type="text"
						value={userToShare}
						onChange={(e) => setUserToShare(e.currentTarget.value)} />
					<button onClick={sharePipelineHandler}
						className="share-modal__confirm">Confirm</button>
				</form>
				<button onClick={() => setShowShareModal(false)}
					className="share-modal__exit">Exit</button>
			</div>
		</Modal>
	);
}
