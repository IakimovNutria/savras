import React from "react";
import {useParams} from "react-router-dom";


type PipelineProps = {

}

function Pipeline(): JSX.Element {
    const id = Number(useParams().id);
    return (
        <html>
        <head>
            <title>Savras</title>
            <meta name="robots" content="noindex, nofollow"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </head>
        <body>
        <form action="/main">
            <button>Back to main</button>
        </form>
        <h1>pipeline</h1>
        </body>
        </html>);
}

export default Pipeline;
