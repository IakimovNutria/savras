import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks';
import {fetchPipeline} from "../../store/api-actions";
import Cell from "../../components/cell/cell";
import CreateButtons from "../../components/create-buttons/create-buttons";
import {getCurrentPipeline, getIsPipelineLoading} from "../../store/pipeline-reducer/selectors";
import Loading from "../../components/loading/loading";
import NotFound from "../not-found/not-found";

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
            return (<Loading />);
        } else {
            return (<NotFound />);
        }
    }

    return (
        <React.Fragment>
            <header className="pipeline-header">
                <h1>{pipeline.name}</h1>
                <button onClick={() => setVisible(!visible)} className="pipeline-header__button">Create</button>
                <button className="pipeline-header__button" onClick={() => {window.location.href="/"}}>Back to main</button>
            </header>
            {
                visible && <CreateButtons pipelineId={id}/>
            }
            {
                pipeline.cells.map((cellInfo) => (<Cell cellInfo={cellInfo} pipelineId={id}/>))
            }
        </React.Fragment>);
}

export default Pipeline;
