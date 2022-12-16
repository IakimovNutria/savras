import React, {MouseEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks';
import {createCell, fetchPipeline} from "../../store/api-actions";
import Cell from "../../components/cell/cell";


function Pipeline(): JSX.Element {
    const id = useParams().id;
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const pipeline = useAppSelector((state) => state.currentPipeline);
    const functions = useAppSelector((state) => state.cellsFunctions);
    if (id === undefined) {
        return (<h1>undefined</h1>);
    }
    dispatch(fetchPipeline({pipelineId: id}));
    if (pipeline === null) {
        return (<h1>server problem</h1>);
    }
    function handleCreate(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (id === undefined)
            return;
        dispatch(createCell({pipelineId: id, functionName: event.currentTarget.id}));
    }

    return (
        <React.Fragment>
            <form action="/">
                <button>Back to main</button>
            </form>
            <h1>{pipeline.name}</h1>
            <button onClick={() => setVisible(!visible)}>create</button>
            {
                visible ?
                (<ul className='row-elements'>
                    {
                        functions.map((func) => (
                            <li className='row-elements'>
                                <button id={func.function} onClick={handleCreate}>
                                    {func.function}
                                </button>
                            </li>
                        ))
                    }
                </ul>) : <></>
            }

            <div>
                {
                    pipeline.cells.map((cellInfo) => <Cell cellInfo={cellInfo}/>)
                }
            </div>
        </React.Fragment>);
}

export default Pipeline;
