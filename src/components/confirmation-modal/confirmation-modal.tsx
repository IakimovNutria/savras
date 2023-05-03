import Modal from '../modal/modal';
import React from 'react';
import './confirmation-modal.css';
import {Button} from '../button/button';
import {ButtonSize} from '../../enums/button-size';

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
			closeModal={onNotConfirm}>
			<div className="confirmation">
				<div className="confirmation__text">
					{text}
				</div>
				<div className="confirmation__buttons">
					<Button onClick={onConfirm}
						size={ButtonSize.MEDIUM}
						hasShadow
					>
						Yes
					</Button>
					<Button onClick={onNotConfirm}
						size={ButtonSize.MEDIUM}
						hasShadow
					>
						No
					</Button>
				</div>
			</div>
		</Modal>
	);
}
