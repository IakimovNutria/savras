import React from "react";
import {Link} from "react-router-dom";


let data = [["123", "12"],
    ["321", "21"],
    ["456", "32"]]



const bgColor: string = '#000';
const textColor: string = '#fff';


function MainPage(): JSX.Element {
    return (
    <div className="main-page">
        <div className="files-block">
            <h3>add file</h3>
            <form encType="multipart/form-data" method="post" className="main-page-form">
                <input type="file" name="f" />
                <input type="submit" value="Загрузить" />
            </form>
            <h3>files</h3>
            <ul>
                {
                    data.map(key => (<li><Link to={`/file/${key[1]}`}>{key[0]}</Link></li>))
                }
            </ul>
        </div>
        <div className="my-pipelines-block">
            <h3>create new pipeline</h3>
            <form encType="multipart/form-data" method="post" className="main-page-form">
                <input type="text"/>
                <input type="submit" value="Создать" />
            </form>
            <h3>pipelines</h3>
            <ul>
                {
                    data.map(key => (<li><Link to={`/pipeline/${key[1]}`}>{key[0]}</Link></li>))
                }
            </ul>
        </div>
        <div className="shared-pipelines-block">
            <h3>shared pipelines</h3>
            <ul>
                {
                    data.map(key => (<li><Link to={`/pipeline/${key[1]}`}>{key[0]}</Link></li>))
                }
            </ul>
        </div>
    </div>)
}

export default MainPage;


