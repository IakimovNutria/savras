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
		<Modal title={title}
			text={text}
			headerBodyGap={22}
		>
			<div className="confirmation">
				<button onClick={onConfirm}
					className="confirmation__button">Yes</button>
				<button onClick={onNotConfirm}
					className="confirmation__button">No</button>
			</div>
		</Modal>
	);
}
