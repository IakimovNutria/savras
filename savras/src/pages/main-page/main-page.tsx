import React, {FormEvent, useRef, useState} from "react";
import { useAppDispatch, useAppSelector } from '../../hooks';
import {setAuthorization} from "../../store/actions";
import AuthorizationStatus from "../../types/authorizationStatus";
import {useCookies} from "react-cookie";
import {
    createPipeline,
    deleteFile,
    deletePipeline, downloadFile,
    uploadFile
} from "../../store/api-actions";


function MainPage(): JSX.Element {
    const [newPipelineName, setNewPipelineName] = useState("");
    const [, , removeCookie] = useCookies(["token"]);
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const files = useAppSelector((state) => state.filesList);
    const userPipelines = useAppSelector((state) => state.userPipelinesList);
    const sharedPipelines = useAppSelector((state) => state.sharedPipelinesList);

    function handleCreatePipeline(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(createPipeline({name: newPipelineName}));
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
            <div className="main-page-head">
                <button className="block-button head-button" onClick={handleSignOut}>Sign out</button>
            </div>
            <div className="main-page-body">
                <div className="column-elements main-page-block">
                    <h3>Add new file</h3>
                    <form className="column-elements" onSubmit={handleFileUpload}>
                        <input type="file" className="column-elements" required ref={fileInputRef} />
                        <input className="block-button" type="submit" value="Upload" />
                    </form>
                    <h3>My files</h3>
                    <ul className='main-page-ul column-elements'>
                        {
                            // TODO: добавить кнопку просмотра файла
                            files.map((file, index) => (
                                <li className={`main-page-li row-elements ${index % 2 === 0 ? 'even-item' : 'odd-item'}`} key={file.path}>
                                    <button className="block-button" id={file.path} name={file.name} onClick={downloadFileHandler}>Download</button>
                                    <h4>{file.name}</h4>
                                    <button className="block-button" id={file.path} onClick={deleteFileHandler}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="column-elements main-page-block">
                    <h3>Create new pipeline</h3>
                    <form encType="multipart/form-data" className="column-elements" onSubmit={handleCreatePipeline}>
                        <input type="text" required className="text-input" placeholder="Name"
                               value={newPipelineName}
                               onChange={(e) => setNewPipelineName(e.target.value)}/>
                        <input className="block-button" type="submit" value="Create" />
                    </form>
                    <h3>My pipelines</h3>
                    <ul className='main-page-ul column-elements'>
                        {
                            // TODO: добавить кнопку share, fork
                            userPipelines.map((pipeline, index) => (
                                <li className={`main-page-li row-elements ${index % 2 === 0 ? 'even-item' : 'odd-item'}`} key={pipeline.id}>
                                    <button className="block-button" id={pipeline.id} name={pipeline.name} onClick={() => {window.location.href=`/pipeline/${pipeline.id}`}}>Open</button>
                                    <h4>{pipeline.name}</h4>
                                    <button className="block-button" id={pipeline.id} onClick={handleDeletePipeline}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>

                    <h3>Shared pipelines</h3>
                    <ul className='main-page-ul'>
                        {
                            // TODO: добавить кнопку fork
                            sharedPipelines.map((pipeline, index) => (
                                    <li className={`main-page-li row-elements ${index % 2 === 0 ? 'even-item' : 'odd-item'}`} key={pipeline.id}>
                                        <button className="block-button" id={pipeline.id} name={pipeline.name} onClick={() => {window.location.href=`/pipeline/${pipeline.id}`}}>Open</button>
                                        <h4>{pipeline.name}</h4>
                                        <button className="block-button" id={pipeline.id} onClick={handleDeletePipeline}>Delete</button>
                                    </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </React.Fragment>);
}

export default MainPage;


