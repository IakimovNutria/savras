import React, {FormEvent, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import FileInfo from "../../types/fileInfo";
import { useAppDispatch, useAppSelector } from '../../hooks';
import {setAuthorization} from "../../store/actions";
import AuthorizationStatus from "../../types/authorizationStatus";
import {useCookies} from "react-cookie";


function MainPage(): JSX.Element {
    const [newPipelineName, setNewPipelineName] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const dispatch = useAppDispatch();
    const files = useAppSelector((state) => state.filesList);
    const userPipelines = useAppSelector((state) => state.userPipelinesList);
    const sharedPipelines = useAppSelector((state) => state.sharedPipelinesList);


    function handleCreatePipeline(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // dispatch(setUserPipelines(newPipelineName));
    }

    function handleDeletePipeline(event: FormEvent<HTMLDivElement>) {
        // TODO: добавить подтверждение об удалении пайплайна
        // dispatch(deletePipelineAction(event.currentTarget.id));
        event.preventDefault();
    }

    function handleSignOut(event: FormEvent<HTMLButtonElement>) {
        removeCookie("token");
        dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED));
    }

    return (
    <div className="main-page">
        <button className="block-button sign-out-button" onClick={handleSignOut}>exit</button>
        <div className="column-elements block">
            <h3>add file</h3>
            <form encType="multipart/form-data" method="post" className="column-elements">
                <label htmlFor="file-input">
                    Select file
                    <input id="file-input" type="file" required style={{display: "none"}}/>
                </label>
                <label>Файл не выбран</label>
                <input className="block-button" type="submit" value="Загрузить" />
            </form>
            <h3>files</h3>
            <ul className='column-elements delete-buttons-ul'>
                {
                    files.map((file) => (
                        <li className='row-elements'>
                            <div className="column-elements">{/*<Link to={`/file/${file['id']}`}>*/}{file['name']}{/*</Link>*/}</div>
                            <div className='delete-button' id={file['id']}/>
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
                        <li className='row-elements'>
                            <div className="column-elements">
                                <Link to={`/pipeline/${pipeline['id']}`}>
                                    {pipeline['name']}
                                </Link>
                            </div>
                            <div className='delete-button' id={pipeline['id']} onClick={handleDeletePipeline}/>
                        </li>))
                }
            </ul>
        </div>
        <div className="column-elements block">
            <h3>shared pipelines</h3>
            <ul className='column-elements'>
                {
                    sharedPipelines.map((pipeline) => (
                        <li>
                            <Link to={`/pipeline/${pipeline['id']}`}>
                                {pipeline['name']}
                            </Link>
                        </li>))
                }
            </ul>
        </div>
    </div>);
}

export default MainPage;


