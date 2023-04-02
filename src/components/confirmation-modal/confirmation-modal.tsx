import Modal from '../modal/modal';
import React from 'react';

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
			text={text}>
			<>
				<button onClick={onConfirm}>Yes</button>
				<button onClick={onNotConfirm}>No</button>
			</>
		</Modal>
	);
}
