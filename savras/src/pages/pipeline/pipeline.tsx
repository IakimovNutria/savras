import React from "react";
import {useParams} from "react-router-dom";


type PipelineProps = {

}

function Pipeline(): JSX.Element {
    const id = Number(useParams().id);
    return (
        <React.Fragment>
            <form action="/main">
                <button>Back to main</button>
            </form>
            <h1>pipeline</h1>
        </React.Fragment>);
}

export default Pipeline;
