import React, {FormEvent, useCallback, useRef, useState} from 'react';
import {downloadFile} from '../../utils/download-file';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {deleteFile, uploadFile} from '../../store/main-reducer/actions';
import {getFiles} from '../../store/main-reducer/selectors';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import MainList from '../main-list/main-list';

export default function FilesSection(): JSX.Element {
	const dispatch = useAppDispatch();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const files = useAppSelector(getFiles);
	const [fileToDelete, setFileToDelete] = useState('');
	const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
	const hideDeleteFileModal = useCallback(() => setShowDeleteFileModal(false), []);
	const downloadFileHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const path = event.currentTarget.id;
		const { name } = event.currentTarget;
		downloadFile(path, name);
	}, [dispatch]);

	const openDeleteFileModal = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setFileToDelete(event.currentTarget.id);
		setShowDeleteFileModal(true);
	}, []);

	const uploadFileHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const toSend = new FormData();
		if (fileInputRef.current !== null && fileInputRef.current.files !== null) {
			toSend.append('file', fileInputRef.current.files[0]);
			dispatch(uploadFile({ formData: toSend }));
		}
	}, [fileInputRef, dispatch]);
	const deleteFileHandler = useCallback(() => {
		setShowDeleteFileModal(false);
		dispatch(deleteFile({ path: fileToDelete }));
	}, [dispatch, fileToDelete]);

	return (
		<>
			<section className="main__section">
				<h2 style={{ display: 'none' }}>files</h2>
				<h3>Add new file</h3>
				<form className="main__upload-form"
					onSubmit={uploadFileHandler}>
					<input type="file"
						required
						ref={fileInputRef} />
					<input className="main__submit-button"
						type="submit"
						value="Upload" />
				</form>
				<h3>My files</h3>
				<MainList items={files}
					getItemKey={(file) => file.path}
					renderItem={(file) => (
						<>
							<button
								className="main__list-item-button"
								id={file.path}
								name={file.name}
								onClick={downloadFileHandler}
							>
								Download
							</button>
							<span>{file.name}</span>
							<button
								className="main__list-item-button"
								id={file.path}
								onClick={openDeleteFileModal}
							>
								Delete
							</button>
						</>
					)}
				/>
			</section>
			{
				showDeleteFileModal && (
					<ConfirmationModal
						title="Delete file"
						text={`Are you sure you want to delete the file titled ${files.find((file) => file.path === fileToDelete)?.name}?`}
						onConfirm={deleteFileHandler}
						onNotConfirm={hideDeleteFileModal}
					/>
				)
			}
		</>
	);
}
