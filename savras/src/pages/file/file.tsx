import React from "react";
import {useParams} from "react-router-dom";


type FileProps = {

}

function File(): JSX.Element {
    const id = Number(useParams().id);
    return (
        <React.Fragment>
            <form action="/">
                <button>Back to main</button>
            </form>
            <h1>file</h1>
        </React.Fragment>);
}

export default File;
