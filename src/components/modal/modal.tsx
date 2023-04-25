import React, {FormEvent, ReactNode, useCallback} from 'react';
import './modal.css';

type ModalProps = {
    title: string;
    children: ReactNode;
	closeModal: () => void;
}

export default function Modal({ title, children, closeModal }: ModalProps): JSX.Element {
	const stopPropagation = useCallback((event: FormEvent<HTMLDivElement>) => event.stopPropagation(), []);
	return (
		<div className="modal"
			onClick={closeModal}>
			<div className="modal__content"
				onClick={stopPropagation}>
				<header className="modal__header">
					{title}
				</header>
				<div className="modal__body">
					{children}
				</div>
			</div>
		</div>
	);
}
