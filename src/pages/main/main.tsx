import React, {FormEvent, useRef, useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {setAuthorization} from '../../store/actions';
import AuthorizationStatus from '../../enums/authorization-status';
import {useCookies} from 'react-cookie';
import {
    createPipeline,
    deleteFile,
    deletePipeline, downloadFile,
    uploadFile, sharePipeline,
    forkPipeline
} from '../../store/api-actions';
import {getFiles, getSharedPipelines, getUserPipelines} from '../../store/main-reducer/selectors';
import {Link} from 'react-router-dom';
import ConfirmationModal from "../../components/confirmation-modal/confirmation-modal";
import Modal from "../../components/modal/modal";


function Main(): JSX.Element {
    const [newPipelineName, setNewPipelineName] = useState('');
    const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
    const [showDeletePipelineModal, setShowDeletePipelineModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [pipelineToShare, setPipelineToShare] = useState('');
    const [fileToDelete, setFileToDelete] = useState('');
    const [pipelineToDelete, setPipelineToDelete] = useState('');
    const [userToShare, setUserToShare] = useState('');
    const [, , removeCookie] = useCookies(['token']);
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const files = useAppSelector(getFiles);
    const userPipelines = useAppSelector(getUserPipelines);
    const sharedPipelines = useAppSelector(getSharedPipelines);

    function createPipelineHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(createPipeline({name: newPipelineName}));
        setNewPipelineName('');
    }

    function openDeletePipelineModal(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        setPipelineToDelete(event.currentTarget.id);
        setShowDeletePipelineModal(true);
    }

    function deletePipelineHandler() {
        setShowDeletePipelineModal(false);
        dispatch(deletePipeline({pipelineId: pipelineToDelete}));
    }

    function signOutHandler(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        removeCookie('token');
        dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED));
    }

    function uploadFileHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const toSend = new FormData();
        if (fileInputRef.current !== null && fileInputRef.current.files !== null) {
            toSend.append('file', fileInputRef.current.files[0]);
            dispatch(uploadFile({formData: toSend}));
        }
    }

    function openDeleteFileModal(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        setFileToDelete(event.currentTarget.id);
        setShowDeleteFileModal(true);
    }

    function deleteFileHandler() {
        setShowDeleteFileModal(false);
        dispatch(deleteFile({path: fileToDelete}));
    }

    function downloadFileHandler(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        const path = event.currentTarget.id;
        const name = event.currentTarget.name;
        dispatch(downloadFile({path: path, name: name}));
    }

    function openShareModal(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        const pipelineId = event.currentTarget.id;
        setPipelineToShare(pipelineId);
        setShowShareModal(true);
    }

    function sharePipelineHandler() {
        dispatch(sharePipeline({username: userToShare, pipelineId: pipelineToShare}));
        setUserToShare('');
        setShowShareModal(false);
    }

    return (
        <React.Fragment>
            <header className='main__header'>
                <button className='main__header-button' onClick={signOutHandler}>Sign out</button>
            </header>
            <div className='main__body'>
                <h1 style={{display: 'none'}}>main page</h1>
                <section className='main__section'>
                    <h2 style={{display: 'none'}}>files</h2>
                    <h3>Add new file</h3>
                    <form className='main__upload-form' onSubmit={uploadFileHandler}>
                        <input type='file' required ref={fileInputRef} />
                        <input className='main__submit-button' type='submit' value='Upload' />
                    </form>
                    <h3>My files</h3>
                    <ul className='main__list'>
                        {
                            files.map((file, index) => (
                                <li className={`main__list-item ${index % 2 === 0 ? 'main__list-item_even' : 'main__list-item_odd'}`} key={file.path}>
                                    <button className='main__list-item-button' id={file.path} name={file.name}
                                            onClick={downloadFileHandler}>Download</button>
                                    <span>{file.name}</span>
                                    <button className='main__list-item-button' id={file.path}
                                            onClick={openDeleteFileModal}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>
                </section>
                <section className='main__section'>
                    <h2 style={{display: 'none'}}>pipelines</h2>
                    <h3>Create new pipeline</h3>
                    <form className='main__create-form' onSubmit={createPipelineHandler}>
                        <input required className='main__create-form-input'
                               placeholder='Name' value={newPipelineName}
                               onChange={(e) => setNewPipelineName(e.target.value)}/>
                        <input className='main__submit-button' type='submit' value='Create' />
                    </form>
                    <h3>My pipelines</h3>
                    <ul className='main__list'>
                        {
                            userPipelines.map((pipeline, index) => (
                                <li className={`main__list-item ${index % 2 === 0 ? 'main__list-item_even' : 'main__list-item_odd'}`} key={pipeline.id}>
                                    <Link className='main__list-item-link' id={pipeline.id}
                                          to={`/pipeline/${pipeline.id}`}>Open</Link>
                                    <button className='main__list-item-button' id={pipeline.id}
                                            onClick={() => dispatch(forkPipeline({pipelineId: pipeline.id}))}>
                                        Fork
                                    </button>
                                    <span>{pipeline.name}</span>
                                    <button className='main__list-item-button' id={pipeline.id}
                                            onClick={openShareModal}>Share</button>
                                    <button className='main__list-item-button' id={pipeline.id}
                                            onClick={openDeletePipelineModal}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>

                    <h3>Shared pipelines</h3>
                    <ul className='main__list'>
                        {
                            sharedPipelines.map((pipeline, index) => (
                                <li className={`main__list-item ${index % 2 === 0 ? 'main__list-item_even' : 'main__list-item_odd'}`}
                                    key={pipeline.id}>
                                    <Link className='main__list-item-link' id={pipeline.id}
                                          to={`/pipeline/${pipeline.id}`}>Open</Link>
                                    <button className='main__list-item-button' id={pipeline.id}
                                            onClick={() => dispatch(forkPipeline({pipelineId: pipeline.id}))}>
                                        Fork
                                    </button>
                                    <span>{pipeline.name}</span>
                                    <button className='main__list-item-button' id={pipeline.id}
                                            onClick={openDeletePipelineModal}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>
                </section>
            </div>
            {
                showDeleteFileModal && (
                    <ConfirmationModal title={'Delete file'}
                                       text={`Are you sure you want to delete the file titled ${files.find((file) => file.path === fileToDelete)?.name}?`}
                                       onConfirm={deleteFileHandler}
                                       onNotConfirm={() => setShowDeleteFileModal(false)}/>
                )
            }
            {
                showDeletePipelineModal && (
                    <ConfirmationModal title={'Delete pipeline'}
                                       text={`Are you sure you want to delete the pipeline titled ${userPipelines.find((pipeline) => pipeline.id === pipelineToDelete)?.name}?`}
                                       onConfirm={deletePipelineHandler}
                                       onNotConfirm={() => setShowDeletePipelineModal(false)}/>
                )
            }
            {
                showShareModal && (
                    <Modal text={'Enter the login of the user you want to share the pipeline with'} title={'Share pipeline'}>
                        <form>
                            <input type='text' value={userToShare} onChange={(e) => setUserToShare(e.currentTarget.value)}/>
                            <button onClick={sharePipelineHandler}>Confirm</button>
                            <button onClick={() => setShowShareModal(false)}>Exit</button>
                        </form>
                    </Modal>
                )
            }
        </React.Fragment>);
}

export default Main;


