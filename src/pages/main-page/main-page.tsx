import React, {FormEvent, useRef, useState} from "react";
import { useAppDispatch, useAppSelector } from '../../hooks';
import {setAuthorization} from "../../store/actions";
import AuthorizationStatus from "../../enums/authorization-status";
import {useCookies} from "react-cookie";
import {
    createPipeline,
    deleteFile,
    deletePipeline, downloadFile,
    uploadFile
} from "../../store/api-actions";
import {getFiles, getSharedPipelines, getUserPipelines} from "../../store/main-reducer/selectors";


function MainPage(): JSX.Element {
    const [newPipelineName, setNewPipelineName] = useState("");
    const [, , removeCookie] = useCookies(["token"]);
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const files = useAppSelector(getFiles);
    const userPipelines = useAppSelector(getUserPipelines);
    const sharedPipelines = useAppSelector(getSharedPipelines);

    function handleCreatePipeline(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(createPipeline({name: newPipelineName}));
        setNewPipelineName("");
    }

    function handleDeletePipeline(event: FormEvent<HTMLButtonElement>) {
        // TODO: добавить подтверждение об удалении пайплайна
        dispatch(deletePipeline({pipelineId: event.currentTarget.id}));
        event.preventDefault();
    }

    function handleSignOut(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        removeCookie("token");
        dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED));
    }

    function handleFileUpload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const toSend = new FormData();
        if (fileInputRef.current !== null && fileInputRef.current.files !== null) {
            toSend.append('file', fileInputRef.current.files[0]);
            dispatch(uploadFile({formData: toSend}));
        }
    }

    function deleteFileHandler(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        // TODO: добавить подтверждение об удалении файла
        const path = event.currentTarget.id;
        dispatch(deleteFile({path: path}));
    }

    function downloadFileHandler(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        const path = event.currentTarget.id;
        const name = event.currentTarget.name;
        dispatch(downloadFile({path: path, name: name}));
    }

    return (
        <React.Fragment>
            <header className="main-header">
                <button className="main-header__button" onClick={handleSignOut}>Sign out</button>
            </header>
            <div className="main-body">
                <h1 style={{display: "none"}}>main page</h1>
                <section className="main-section">
                    <h2 style={{display: "none"}}>files</h2>
                    <h3>Add new file</h3>
                    <form className="main-section__upload-form" onSubmit={handleFileUpload}>
                        <input type="file" required ref={fileInputRef} />
                        <input className="main-section__button" type="submit" value="Upload" />
                    </form>
                    <h3>My files</h3>
                    <ul className='main-section__items'>
                        {
                            // TODO: добавить кнопку просмотра файла
                            files.map((file, index) => (
                                <li className={`main-section__item ${index % 2 === 0 ? 'main-section__item_even' : 'main-section__item_odd'}`} key={file.path}>
                                    <button className="main-section__item-button" id={file.path} name={file.name}
                                            onClick={downloadFileHandler}>Download</button>
                                    <span>{file.name}</span>
                                    <button className="main-section__item-button" id={file.path}
                                            onClick={deleteFileHandler}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>
                </section>
                <section className="main-section">
                    <h2 style={{display: "none"}}>pipelines</h2>
                    <h3>Create new pipeline</h3>
                    <form className="main-section__create-form" onSubmit={handleCreatePipeline}>
                        <input required className="main-page__text-input"
                               placeholder="Name" value={newPipelineName}
                               onChange={(e) => setNewPipelineName(e.target.value)}/>
                        <input className="main-section__button" type="submit" value="Create" />
                    </form>
                    <h3>My pipelines</h3>
                    <ul className='main-section__items'>
                        {
                            // TODO: добавить кнопку share, fork
                            userPipelines.map((pipeline, index) => (
                                <li className={`main-section__item ${index % 2 === 0 ? 'main-section__item_even' : 'main-section__item_odd'}`} key={pipeline.id}>
                                    <button className="main-section__item-button" id={pipeline.id} name={pipeline.name}
                                            onClick={() => {window.location.href=`/pipeline/${pipeline.id}`}}>Open</button>
                                    <span>{pipeline.name}</span>
                                    <button className="main-section__item-button" id={pipeline.id}
                                            onClick={handleDeletePipeline}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>

                    <h3>Shared pipelines</h3>
                    <ul className='main-section__items'>
                        {
                            // TODO: добавить кнопку fork
                            sharedPipelines.map((pipeline, index) => (
                                <li className={`main-section__item ${index % 2 === 0 ? 'main-section__item_even' : 'main-section__item_odd'}`}
                                    key={pipeline.id}>
                                    <button className="main-section__item-button" id={pipeline.id} name={pipeline.name}
                                            onClick={() => {window.location.href=`/pipeline/${pipeline.id}`}}>Open</button>
                                    <span>{pipeline.name}</span>
                                    <button className="main-section__item-button" id={pipeline.id}
                                            onClick={handleDeletePipeline}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>
                </section>
            </div>
        </React.Fragment>);
}

export default MainPage;


