import React, {FormEvent, useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {uploadFile} from '../../store/main-reducer/actions';
import {getFiles} from '../../store/main-reducer/selectors';
import MainList from '../main-list/main-list';
import {Button} from '../button/button';
import './files-section.css';
import {ButtonSize} from '../../enums/button-size';
import {FileListItem} from '../file-list-item/file-list-item';
import FileInfo from '../../types/file-info';

export default function FilesSection(): JSX.Element {
	const dispatch = useAppDispatch();
	const files = useAppSelector(getFiles);
	const [chosenFile, setChosenFile] = useState<File | null>(null);
	const uploadFileHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const toSend = new FormData();
		if (chosenFile !== null) {
			toSend.append('file', chosenFile);
			dispatch(uploadFile({ formData: toSend }));
		}
	}, [chosenFile, dispatch]);
	const changeFileHandler = useCallback((event: FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (event.currentTarget.files !== null) {
			setChosenFile(event.currentTarget.files[0]);
		}
	}, []);
	const fileKeyExtractor = useCallback((file: FileInfo) => file.path, []);
	const renderFileItem = useCallback((file: FileInfo) => <FileListItem file={file}/>, []);

	return (
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
						{chosenFile?.name ?? 'file not selected'}
					</div>
				</div>
				<Button type="submit"
					hasShadow
					size={ButtonSize.MEDIUM}
				>
					Upload
				</Button>
			</form>
			<MainList items={files}
				keyExtractor={fileKeyExtractor}
				renderItem={renderFileItem}
				title="My files"
			/>
		</section>
	);
}
