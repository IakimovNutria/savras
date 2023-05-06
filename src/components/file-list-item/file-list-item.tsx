import {Button} from '../button/button';
import {ButtonSize} from '../../enums/button-size';
import React, {FormEvent, useCallback, useState} from 'react';
import FileInfo from '../../types/file-info';
import {downloadFile} from '../../utils/download-file';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import {deleteFile} from '../../store/main-reducer/actions';
import {useAppDispatch} from '../../hooks';
import {MainListItemName} from '../main-list-item-name/main-list-item-name';

type FileListItemProps = {
	file: FileInfo;
}

export function FileListItem({file}: FileListItemProps): JSX.Element {
	const dispatch = useAppDispatch();
	const downloadFileHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const path = event.currentTarget.id;
		const { name } = event.currentTarget;
		downloadFile(path, name);
	}, []);
	const [showModal, setShowModal] = useState(false);
	const deleteFileHandler = useCallback(() => {
		setShowModal(false);
		dispatch(deleteFile({ path: file.path }));
	}, [dispatch, file.path]);
	const hideDeleteFileModal = useCallback(() => setShowModal(false), []);
	const openDeleteFileModal = useCallback(() => setShowModal(true), []);
	return (
		<>
			<Button
				id={file.path}
				name={file.name}
				onClick={downloadFileHandler}
				size={ButtonSize.SMALL}
			>
				Download
			</Button>
			<MainListItemName name={file.name} />
			<Button
				id={file.path}
				onClick={openDeleteFileModal}
				size={ButtonSize.SMALL}
			>
				Delete
			</Button>
			{
				showModal && (
					<ConfirmationModal
						title="Delete file"
						text={`Are you sure you want to delete the file titled ${file.name}?`}
						onConfirm={deleteFileHandler}
						onNotConfirm={hideDeleteFileModal}
					/>
				)
			}
		</>
	);
}
