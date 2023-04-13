import Modal from '../modal/modal';
import React, {useState} from 'react';
import {sharePipeline} from '../../store/api-actions';
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
		<Modal text="Enter the login of the user you want to share the pipeline with"
			title="Share pipeline"
			headerBodyGap={11}
		>
			<div className="share-modal">
				<form className="share-modal__form"
					onSubmit={sharePipelineHandler}>
					<input className="share-modal__input"
						placeholder="user login"
						type="text"
						value={userToShare}
						onChange={(e) => setUserToShare(e.currentTarget.value)} />
					<Button type="submit"
						width={88}
						height={40}
						borderRadius="0px 5px 5px 0px"
					>
						Confirm
					</Button>
				</form>
				<Button onClick={() => setShowShareModal(false)}
					hasShadow
					width={88}
					height={40}
					borderRadius="5px"
				>
					Exit
				</Button>
			</div>
		</Modal>
	);
}
