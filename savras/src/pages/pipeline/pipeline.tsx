import React, {useState} from "react";
import {useParams} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks';
import {fetchPipeline} from "../../store/api-actions";
import FunctionsList from "../../components/functionsList/functionsList";
import Cell from "../../components/cell/cell"


function Pipeline(): JSX.Element {
    const id = useParams().id;
    const [isListPushed, useIsListPushed] = useState(false);
    if (id === undefined) {
        return (<h1>undefined</h1>);
    }
    const dispatch = useAppDispatch();
    dispatch(fetchPipeline({pipelineId: id}));
    const pipeline = useAppSelector((state) => state.currentPipeline);
    if (pipeline === null) {
        return (<h1>server problem</h1>);
    }
    return (
        <React.Fragment>
            <form action="/">
                <button>Back to main</button>
            </form>
            <h1>{pipeline.name}</h1>
            {
                isListPushed ?
                    <FunctionsList useIsListPushed={useIsListPushed} pipelineId={id}/> :
                    <button onClick={(event) => {
                        event.preventDefault();
                        useIsListPushed(true);
                    }}>create</button>
            }
            {
                pipeline.cells.map((cellInfo) => <Cell cellInfo={cellInfo}/>)
            }
        </React.Fragment>);
}

export default Pipeline;
