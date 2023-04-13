import React from 'react';
import './modal.css';

type ModalProps = {
    text: string;
    title: string;
    children: JSX.Element;
	headerBodyGap: number;
}

export default function Modal({ title, text, children, headerBodyGap }: ModalProps): JSX.Element {
	return (
		<div className="modal">
			<div className="modal__content">
				<header className="modal__header"
					style={{marginBottom: headerBodyGap}}>
					{title}
				</header>
				<div className="modal__body">
					{text}
				</div>
				<footer className="modal__footer">
					{children}
				</footer>
			</div>
		</div>
	);
}
