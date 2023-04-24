import React, {FormEvent, useCallback, useState} from 'react';
import {downloadFile} from '../../utils/download-file';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {deleteFile, uploadFile} from '../../store/main-reducer/actions';
import {getFiles} from '../../store/main-reducer/selectors';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import MainList from '../main-list/main-list';
import {Button} from '../button/button';
import './files-section.css';

export default function FilesSection(): JSX.Element {
	const dispatch = useAppDispatch();
	const files = useAppSelector(getFiles);
	const [fileToDelete, setFileToDelete] = useState('');
	const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
	const [chosenFile, setChosenFile] = useState<File | null>(null);
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
		if (chosenFile !== null) {
			toSend.append('file', chosenFile);
			dispatch(uploadFile({ formData: toSend }));
		}
	}, [chosenFile, dispatch]);
	const deleteFileHandler = useCallback(() => {
		setShowDeleteFileModal(false);
		dispatch(deleteFile({ path: fileToDelete }));
	}, [dispatch, fileToDelete]);
	const changeFileHandler = useCallback((event: FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (event.currentTarget.files !== null) {
			setChosenFile(event.currentTarget.files[0]);
		}
	}, []);


	return (
		<>
			<section className="files-section">
				<h2 style={{ display: 'none' }}>files</h2>
				<form className="files-section__upload-form"
					onSubmit={uploadFileHandler}>
					<h3 className="files-section__title">Add new file</h3>
					<div className="files-section__file-input">
						<label className="files-section__file-input-label">
							Choose file
							<input type="file"
								required
								style={{ display: 'none' }}
								onChange={changeFileHandler}
							/>
						</label>
						<div className="files-section__file-input-name">
							{chosenFile ? chosenFile.name : 'file not selected'}
						</div>
					</div>
					<Button type="submit"
						className="files-section__form-submit"
						hasShadow
					>
						Upload
					</Button>
				</form>
				<div>
					<MainList items={files}
						keyExtractor={(file) => file.path}
						renderItem={(file) => (
							<>
								<Button
									id={file.path}
									name={file.name}
									onClick={downloadFileHandler}
								>
									Download
								</Button>
								<span>{file.name}</span>
								<Button
									id={file.path}
									onClick={openDeleteFileModal}
								>
									Delete
								</Button>
							</>
						)}
						title="My files"
					/>
				</div>
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
