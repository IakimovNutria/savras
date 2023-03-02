import React, {MouseEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks';
import {createCell, fetchPipeline} from "../../store/api-actions";
import Cell from "../../components/cell/cell";
import useInterval from "@use-it/interval";
import CreateButtons from "../../components/create-buttons/create-buttons";
import {getCurrentPipeline, getIsPipelineLoading} from "../../store/pipeline-reducer/selectors";

function Pipeline(): JSX.Element {
    const id = useParams().id;

    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const pipeline = useAppSelector(getCurrentPipeline);
    const isLoading = useAppSelector(getIsPipelineLoading);
    useEffect(() => {
        dispatch(fetchPipeline({pipelineId: id === undefined ? "" : id}));
    }, [dispatch, id]);

    if (id === undefined) {
        return (<h1>undefined</h1>);
    }

    if (pipeline === null) {
        if (isLoading) {
            return (<h1>Loading...</h1>);
        } else {
            return (<h1>Not found</h1>);
        }
    }

    return (
        <React.Fragment>
            <div className="main-page-head">
                <h1 className="header">{pipeline.name}</h1>
                <button onClick={() => setVisible(!visible)} className="block-button head-button">Create</button>
                <div className="func-buttons">
                {
                    visible && <CreateButtons pipelineId={id}/>
                }
                </div>
                <button className="block-button head-button" onClick={() => {window.location.href="/"}}>Back to main</button>
            </div>
            {
                pipeline.cells.map((cellInfo) => (<Cell cellInfo={cellInfo} pipelineId={id}/>))
            }
        </React.Fragment>);
}

export default Pipeline;
