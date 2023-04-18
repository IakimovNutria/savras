import React from 'react';
import './modal.css';

type ModalProps = {
    title: string;
    children: JSX.Element;
}

export default function Modal({ title, children }: ModalProps): JSX.Element {
	return (
		<div className="modal">
			<div className="modal__content">
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
