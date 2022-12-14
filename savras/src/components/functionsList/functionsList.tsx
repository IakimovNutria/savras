import { useAppSelector, useAppDispatch } from '../../hooks';
import React, {MouseEvent} from "react";
import {createCell} from "../../store/api-actions";
import pipelineInfo from "../../types/pipelineInfo";

type FunctionsListProps = {
    useIsListPushed: React.Dispatch<React.SetStateAction<boolean>>;
    pipelineId: string;
};


function FunctionsList({useIsListPushed, pipelineId}: FunctionsListProps): JSX.Element {
    const functions = useAppSelector((state) => state.cellsFunctions);
    const dispatch = useAppDispatch()
    function handleCreate(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        dispatch(createCell({pipelineId: pipelineId, functionName: event.currentTarget.id}));
    }

    return (
        <React.Fragment>
            <button onClick={(event) => {
                event.preventDefault();
                useIsListPushed(false);
            }}>
                don't create
            </button>
            <ul className='row-elements'>
                {
                    functions.map((func) => (
                        <li className='row-elements'>
                            <button id={func.functionName} onClick={handleCreate}>
                                {func.functionName}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </React.Fragment>);
}

export default FunctionsList;
