import React from "react";
import {Link, Navigate} from "react-router-dom";
import getFiles from "../../requests/get-files";
import getUserPipelines from "../../requests/get-user-pipelines";
import getSharedPipelines from "../../requests/get-shared-pipelines";
import getUser from "../../requests/get-user";


function MainPage(): JSX.Element {
    let files: string[] = [];
    let userPipelines: string[] = [];
    let sharedPipelines: string[] = [];
    let hasAccess = false;

    getUser().then(r => {
        if (r === null) {

        } else if (r.ok) {
            hasAccess = true;
        }
    });

    getFiles().then(r => {
        if (r === null) {

        } else if (r.ok) {

        }
    });

    return hasAccess ? (
    <div className="main-page">
        <div className="centered-elements block">
            <h3>add file</h3>
            <form encType="multipart/form-data" method="post" className="centered-elements">
                <label htmlFor="file-input">
                    Select file
                    <input id="file-input" type="file" required style={{display: "none"}}/>
                </label>
                <label>Файл не выбран</label>
                <input className="block-button" type="submit" value="Загрузить" />
            </form>
            <h3>files</h3>
            <ul>
                {
                    files.map(key => (<li>{/*<Link to={`/file/${key[1]}`}>*/}{key}{/*</Link>*/}</li>))
                }
            </ul>
        </div>
        <div className="centered-elements block">
            <h3>create new pipeline</h3>
            <form encType="multipart/form-data" method="post" className="centered-elements">
                <input type="text" required className="text-input" placeholder="Name"/>
                <input className="block-button" type="submit" value="Создать" />
            </form>
            <h3>pipelines</h3>
            <ul>
                {
                    userPipelines.map(key => (<li>{/*<Link to={`/pipeline/${key[1]}`}>*/}{key[0]}{/*</Link>*/}</li>))
                }
            </ul>
        </div>
        <div className="centered-elements block">
            <h3>shared pipelines</h3>
            <ul>
                {
                    sharedPipelines.map(key => (<li>{/*<Link to={`/pipeline/${key[1]}`}>*/}{key[0]}{/*</Link>*/}</li>))
                }
            </ul>
        </div>
    </div>) : (<Navigate to={'/sign-in'} />);
}

export default MainPage;


