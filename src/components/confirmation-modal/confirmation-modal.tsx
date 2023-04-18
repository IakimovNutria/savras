import Modal from '../modal/modal';
import React from 'react';
import './confirmation-modal.css';

type ConfirmationModalProps = {
    title: string;
    text: string;
    onConfirm: () => void;
    onNotConfirm: () => void;
}

export default function ConfirmationModal({
	title, text, onConfirm, onNotConfirm,
}: ConfirmationModalProps): JSX.Element {
	return (
		<Modal title={title}>
			<div className="confirmation">
				<div className="confirmation__text">
					{text}
				</div>
				<div className="confirmation__buttons">
					<button onClick={onConfirm}
						className="confirmation__button">Yes</button>
					<button onClick={onNotConfirm}
						className="confirmation__button">No</button>
				</div>
			</div>
		</Modal>
	);
}
