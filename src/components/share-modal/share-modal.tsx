import Modal from '../modal/modal';
import React, {useState} from 'react';
import {sharePipeline} from '../../store/main-reducer/actions';
import {useAppDispatch} from '../../hooks';
import {Button} from '../button/button';
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
		<Modal title="Share pipeline">
			<div className="share-modal">
				<div className="share-modal__text">
					Enter the login of the user you want to share the pipeline with
				</div>
				<form className="share-modal__form"
					onSubmit={sharePipelineHandler}>
					<input className="share-modal__input"
						placeholder="user login"
						type="text"
						value={userToShare}
						onChange={(e) => setUserToShare(e.currentTarget.value)} />
					<Button type="submit"
						className="share-modal__input-button"
					>
						Confirm
					</Button>
				</form>
				<Button onClick={() => setShowShareModal(false)}
					hasShadow
					className="share-modal__exit-button"
				>
					Exit
				</Button>
			</div>
		</Modal>
	);
}
