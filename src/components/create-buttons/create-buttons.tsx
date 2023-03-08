import {useAppDispatch, useAppSelector} from "../../hooks";
import React, {MouseEvent, useState} from "react";
import {createCell} from "../../store/api-actions";
import {getFunctions} from "../../store/main-reducer/selectors";


type CreateButtonsProps = {
    pipelineId: string;
};

function CreateButtons({pipelineId}: CreateButtonsProps) : JSX.Element {
    const functions = useAppSelector(getFunctions);
    const dispatch = useAppDispatch();
    const [currentGroup, setCurrentGroup] = useState(functions[0].group);

    function handleCreate(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        dispatch(createCell({pipelineId: pipelineId, functionName: event.currentTarget.id}));
    }

    return (
    <>
    {
        <ul className="row-elements">
        {
            [...new Set(functions.map((func) => func.group))].map((group) => (
                <li className="row-elements">
                    <button onClick={() => setCurrentGroup(group)}
                            className={`func-group-button ${group === currentGroup ? 'func-group-button_active' : ''}`}>
                        {group}
                    </button>
                </li>))
        }
        </ul>
    }
    {
        (<ul className='row-elements'>
            {
                functions.filter((func) => func.group === currentGroup).map((func) => (
                    <li className="row-elements" style={{margin: 0}} key={func.function}>
                        <button id={func.function} onClick={handleCreate}
                                style={{border: "2px solid #fcc521"}}
                                className="block-button head-button">
                            {func.name}
                        </button>
                    </li>
                ))
            }
        </ul>)
    }
    </>)
}

export default CreateButtons;
