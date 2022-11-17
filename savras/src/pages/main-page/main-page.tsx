import React from "react";


let data = [["123", "12"],
    ["321", "21"],
    ["456", "32"]]

const bgColor: string = '#000';
const textColor: string = '#fff';


function MainPage(): JSX.Element {
    return (<html>
    <head>
        <title>Savras</title>
        <meta name="robots" content="noindex, nofollow"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </head>
    <body>
    <div className="main-page">
        <h3>add file</h3>
        <form encType="multipart/form-data" method="post">
            <p>
                <input type="file" name="f" />
                <input type="submit" value="Отправить" />
            </p>
        </form>
        <h3>files</h3>
        <div className="files">
            <ul>
                {
                    data.map(key => (<li><a href={`file/${key[1]}`}>{key[0]}</a></li>))
                }
            </ul>
        </div>
        <h3>pipelines</h3>
        <div className="user-pipelines">
            <ul>
                {
                    data.map(key => (<li><a href={`pipeline/${key[1]}`}>{key[0]}</a></li>))
                }
            </ul>
        </div>
        <h3>shared pipelines</h3>
        <div className="shared-pipelines">
            <ul>
                {
                    data.map(key => (<li><a href={`pipeline/${key[1]}`}>{key[0]}</a></li>))
                }
            </ul>
        </div>
    </div>
    </body>
    </html>)
}

export default MainPage;


