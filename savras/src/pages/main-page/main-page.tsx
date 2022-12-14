import React, {FormEvent, useRef, useState} from "react";
import {Link} from "react-router-dom";
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

    function handleDeletePipeline(event: FormEvent<HTMLDivElement>) {
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
        //@ts-ignore
        toSend.append('file', fileInputRef.current.files[0])
        dispatch(uploadFile({formData: toSend}));
    }

    function deleteFileHandler(event: FormEvent<HTMLDivElement>) {
        event.preventDefault();
        // TODO: добавить подтверждение об удалении файла
        const path = event.currentTarget.id;
        dispatch(deleteFile({path: path}));
    }

    function downloadFileHandler(event: FormEvent<HTMLAnchorElement>) {
        event.preventDefault();
        const path = event.currentTarget.id;
        const name = event.currentTarget.innerText;
        dispatch(downloadFile({path: path, name: name}));
    }

    return (
    <div className="main-page">
        <button className="block-button sign-out-button" onClick={handleSignOut}>exit</button>
        <div className="column-elements block">
            <h3>add file</h3>
            <form className="column-elements" onSubmit={handleFileUpload}>
                <input type="file" className="column-elements" required ref={fileInputRef}/>
                <input className="block-button" type="submit" value="Загрузить" />
            </form>
            <h3>files</h3>
            <ul className='column-elements delete-buttons-ul'>
                {
                    files.map((file) => (
                        <li className='row-elements' key={file.path}>
                            <a href={"#"} className="column-elements" id={file.path} onClick={downloadFileHandler}>{file.name}</a>
                            <div className='delete-button' id={file.path} onClick={deleteFileHandler}/>
                        </li>))
                }
            </ul>
        </div>
        <div className="column-elements block">
            <h3>create new pipeline</h3>
            <form encType="multipart/form-data" className="column-elements" onSubmit={handleCreatePipeline}>
                <input type="text" required className="text-input" placeholder="Name"
                       value={newPipelineName}
                       onChange={(e) => setNewPipelineName(e.target.value)}/>
                <input className="block-button" type="submit" value="Создать" />
            </form>
            <h3>pipelines</h3>
            <ul className='column-elements delete-buttons-ul'>
                {
                    userPipelines.map((pipeline) => (
                        <li className='row-elements' key={pipeline.id}>
                            <div className="column-elements">
                                <Link to={`/pipeline/${pipeline.id}`}>
                                    {pipeline.name}
                                </Link>
                            </div>
                            <div className='delete-button' id={pipeline.id} onClick={handleDeletePipeline}/>
                        </li>))
                }
            </ul>
        </div>
        <div className="column-elements block">
            <h3>shared pipelines</h3>
            <ul className='column-elements'>
                {
                    sharedPipelines.map((pipeline) => (
                        <li key={pipeline.id}>
                            <Link to={`/pipeline/${pipeline.id}`}>
                                {pipeline.name}
                            </Link>
                        </li>))
                }
            </ul>
        </div>
    </div>);
}

export default MainPage;


