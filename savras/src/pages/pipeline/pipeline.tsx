import React, {MouseEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks';
import {createCell, fetchPipeline} from "../../store/api-actions";
import Cell from "../../components/cell/cell";
import useInterval from "@use-it/interval";

function Pipeline(): JSX.Element {
    const id = useParams().id;

    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const pipeline = useAppSelector((state) => state.currentPipeline);
    const functions = useAppSelector((state) => state.cellsFunctions);
    useEffect(() => {
        dispatch(fetchPipeline({pipelineId: id === undefined ? "" : id}));
    }, []);
    useInterval(() => {
        dispatch(fetchPipeline({pipelineId: id === undefined ? "" : id}));
    }, 1000 * 10);
    function handleCreate(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (id === undefined)
            return;
        dispatch(createCell({pipelineId: id, functionName: event.currentTarget.id}));
    }

    if (id === undefined) {
        return (<h1>undefined</h1>);
    }


    if (pipeline === null) {
        return (<h1>Loading...</h1>);
    }

    return (
        <React.Fragment>
            <form action="/">
                <button className="block-button">Back to main</button>
            </form>
            <h1 className="header">{pipeline.name}</h1>
            <button onClick={() => setVisible(!visible)} className="block-button">create</button>
            {
                visible ?
                (<ul className='row-elements'>
                    {
                        functions.map((func) => (
                            <li className='row-elements' key={func.function}>
                                <button id={func.function} onClick={handleCreate} className="block-button">
                                    {func.function}
                                </button>
                            </li>
                        ))
                    }
                </ul>) : <></>
            }
            {
                pipeline.cells.map((cellInfo) => (<Cell cellInfo={cellInfo} pipelineId={id}/>))
            }
        </React.Fragment>);
}

export default Pipeline;
