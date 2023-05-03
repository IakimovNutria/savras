import React, {FormEvent, ReactNode, useCallback, useMemo} from 'react';
import './modal.css';
import ReactDOM from 'react-dom';

type ModalProps = {
    title: string;
    children: ReactNode;
	closeModal: () => void;
}

export default function Modal({ title, children, closeModal }: ModalProps): JSX.Element {
	const stopPropagation = useCallback((event: FormEvent<HTMLDivElement>) => event.stopPropagation(), []);
	const appRoot = useMemo(() => document.getElementById('root'), []);
	const modalComponent = useMemo(() => (
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
	), [closeModal, stopPropagation, title, children]);

	return appRoot ? ReactDOM.createPortal(modalComponent, appRoot) : modalComponent;
}
