import React from 'react';

type ModalProps = {
    text: string;
    title: string;
    children: JSX.Element;
}

export default function Modal({ title, text, children }: ModalProps): JSX.Element {
	return (
		<div className="modal">

			<div className="modal__content">
				<header className="modal__header">
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
