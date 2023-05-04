import Modal from '../modal/modal';
import React, {ChangeEvent, useCallback, useState} from 'react';
import {sharePipeline} from '../../store/main-reducer/actions';
import {useAppDispatch} from '../../hooks';
import {Button} from '../button/button';
import './share-modal.css';
import {ButtonSize} from '../../enums/button-size';

type ConfirmationModalProps = {
	setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
	pipelineId: string;
}

export default function ShareModal({setShowShareModal, pipelineId}: ConfirmationModalProps): JSX.Element {
	const dispatch = useAppDispatch();
	const [userToShare, setUserToShare] = useState('');
	function sharePipelineHandler() {
		dispatch(sharePipeline({ username: userToShare, pipelineId: pipelineId }));
		setUserToShare('');
		setShowShareModal(false);
	}
	const closeModal = useCallback(() => setShowShareModal(false),
		[setShowShareModal]);
	const changeUserToShare = useCallback((e: ChangeEvent<HTMLInputElement>) => setUserToShare(e.currentTarget.value),
		[setUserToShare]);

	return (
		<Modal title="Share pipeline"
			closeModal={closeModal}>
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
						onChange={changeUserToShare} />
					<Button type="submit"
						size={ButtonSize.MEDIUM}
						plainLeft
					>
						Confirm
					</Button>
				</form>
				<Button onClick={closeModal}
					hasShadow
					size={ButtonSize.MEDIUM}
				>
					Exit
				</Button>
			</div>
		</Modal>
	);
}
