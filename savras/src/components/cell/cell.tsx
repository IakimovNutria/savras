import {Navigate} from 'react-router-dom';
import CellInfo from "../../types/cellInfo";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {useAppSelector, useAppDispatch} from "../../hooks"
import {moveCell, updateInput, updateParam} from "../../store/api-actions";
import React, {Dispatch, SetStateAction, useState} from "react";
import * as string_decoder from "string_decoder";


type CellProps = {
    cellInfo: CellInfo;
};


function Cell({cellInfo}: CellProps): JSX.Element {
    const functionsInfo = useAppSelector((state) => state.cellsFunctions);
    const functionInfo = functionsInfo.find((elem) => (elem.function === cellInfo.function));
    const dispatch = useAppDispatch();
    type ParamInput = {
        name: string,
        value: string | boolean | number,
        type: string,
        pattern: string
    }
    type Input = {
        name: string,
        value: string
    }
    const inputs: Input[] = [];
    const params: ParamInput[] = [];
    if (functionInfo !== undefined) {
        for (const key in cellInfo.inputs) {
            const toPush: Input = {name: key, value: cellInfo.inputs[key as keyof typeof cellInfo.inputs]};
            if (toPush.value === null) {
                toPush.value = "";
            }
            inputs.push(toPush);
        }
        for (const key in functionInfo.input_params) {
            const fieldType = functionInfo.input_params[key as keyof typeof functionInfo.input_params];
            const toPush: ParamInput = {
                name: key,
                type: "",
                pattern: "*",
                value: cellInfo.input_params[key as keyof typeof cellInfo.input_params]
            };
            if (fieldType === "bool") {
                toPush.type = "checkbox";
                if (toPush.value === null) {
                    toPush.value = false;
                }
            } else if (fieldType === "str") {
                toPush.type = "text";
                if (toPush.value === null) {
                    toPush.value = "";
                }
            } else if (fieldType === "int") {
                toPush.type = "number";
                toPush.pattern = "\\d*";
                if (toPush.value === null) {
                    toPush.value = 0;
                }
            } else if (fieldType === "float") {
                toPush.type = "number";
                toPush.pattern = "*";
                if (toPush.value === null) {
                    toPush.value = 0;
                }
            }
            params.push(toPush);
        }
    }

    const moveHandler = (event: DraggableEvent, data: DraggableData) => {
        event.preventDefault();
        dispatch(moveCell({cellId: cellInfo.id, x: data.x, y: data.y}));
    }

    const updateInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        dispatch(updateInput({cellId: cellInfo.id, field: event.currentTarget.id, path: ""}));
    }

    const updateParamHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        dispatch(updateParam({cellId: cellInfo.id, field: event.currentTarget.id, value: event.target.value}));
    }

    return (
        <Draggable handle=".drag-handle" onStop={moveHandler} defaultPosition={{x: 100, y: 100}} bounds={{left: 0, top: 0}}>
            <div className="block column-elements">
                <div className="drag-handle">
                    Drag
                </div>
                <div>
                    {
                        inputs.map((input) => (
                            <div className="row-elements">
                                <h5>{input.name}</h5>
                                <input className="cell-text-input" id={input.name} type={"text"}
                                       onChange={updateInputHandler} value={input.value}/>
                            </div>
                        ))
                    }
                </div>
                {
                    params.map((param) => {
                            return (
                                <div className="row-elements">
                                    <h5>{param.name}</h5>
                                    {
                                        param.type === "checkbox" ?
                                            (param.value
                                                ?
                                                    (<input id={param.name} type={param.type} checked
                                                            pattern={param.pattern} onChange={updateParamHandler} />)
                                                :
                                                    (<input id={param.name} type={param.type}
                                                            pattern={param.pattern} onChange={updateParamHandler} />)
                                            ) :
                                            (<input id={param.name} type={param.type} value={param.value.toString()}
                                                    className="cell-text-input" pattern={param.pattern}
                                                    onChange={updateParamHandler}/>)
                                    }
                                </div>
                            )
                        }
                    )
                }
            </div>
        </Draggable>);
}

export default Cell;
