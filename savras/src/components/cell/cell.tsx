import CellInfo from "../../types/cellInfo";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {useAppSelector, useAppDispatch} from "../../hooks"
import {fetchPipeline, moveCell, updateInput, updateParam} from "../../store/api-actions";
import React, {FormEvent, useState} from "react";


type CellProps = {
    cellInfo: CellInfo;
    pipelineId: string;
};


function Cell({cellInfo, pipelineId}: CellProps): JSX.Element {
    const functionsInfo = useAppSelector((state) => state.cellsFunctions);
    const functionInfo = functionsInfo.find((elem) => (elem.function === cellInfo.function));
    const dispatch = useAppDispatch();
    const files = useAppSelector((state) => state.filesList);
    type OutputNames = {
        field: string;
        value: string;
    };
    type CellsInput = {
        inputs: {};
        inputParams: {};
        outputNames: OutputNames[];
    }
    const defaultCellsInput: CellsInput = {
        inputs: cellInfo.inputs,
        inputParams: cellInfo.input_params,
        outputNames: []
    };
    const [cellsInputs, setCellsInputs] = useState(defaultCellsInput);

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
                toPush.pattern = '';
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

    const stopHandler = (event: DraggableEvent, data: DraggableData) => {
        event.preventDefault();
        dispatch(moveCell({cellId: cellInfo.id, x: data.x, y: data.y}));
    }

    const updateInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = event.target.value;
        setCellsInputs({...cellsInputs, inputs: {...cellsInputs.inputs, [fieldName]: value}});
    }

    const updateParamHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = (event.currentTarget.type === "checkbox" ? event.target.checked : event.target.value);
        setCellsInputs({...cellsInputs, inputParams: {...cellsInputs.inputParams, [fieldName]: value}});
    }

    const dragHandler = (event: DraggableEvent, data: DraggableData) => {
        event.preventDefault();
        /*setSize((value: {width: number, height: number}) => {
            return {width: Math.max(data.x + 500, value.width), height: Math.max(data.y + 500, value.height)};
        });*/
    }

    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        const elem = cellsInputs;
        for (const key in elem.inputParams) {
            const notNumberValue = elem.inputParams[key as keyof typeof elem.inputParams];
            //@ts-ignore
            const value = functionInfo.input_params[key] === "number" ? Number(notNumberValue) : notNumberValue;
            dispatch(updateParam({cellId: cellInfo.id, value: value, field: key}));
        }
        for (const key in elem.inputs) {
            const value = elem.inputs[key as keyof typeof elem.inputs];
            const file = files.find((elem) => elem.name === value);
            if (file === undefined) {
                // TODO: выводить сообщение об ошибке
                return;
            }
            dispatch(updateInput({cellId: cellInfo.id, path: file.id, field: key}));
        }
        // TODO: execute
        dispatch(fetchPipeline({pipelineId: pipelineId}));
        event.preventDefault();
    }

    return (
        <Draggable handle=".drag-handle" onStop={stopHandler} defaultPosition={{x: cellInfo.x, y: cellInfo.y}}
                   bounds={{left: 0, top: 0}} key={cellInfo.id}>
            <div className="block column-elements draggable-block">
                <div className="drag-handle" />
                <div className="row-elements">
                    <div className="column-elements block inside-draggable-block">
                        <h3 className="inside-draggable-block-element">inputs</h3>
                        <ul className="column-elements">
                            {
                                inputs.map((input) => (
                                    <li className="column-elements" key={cellInfo.id + input.name}>
                                        <h5 className="inside-draggable-block-element">{input.name}</h5>
                                        <input className="cell-text-input inside-draggable-block-element"
                                               id={input.name} type={"text"}
                                               onChange={updateInputHandler}
                                               value={//@ts-ignore
                                                    cellsInputs.inputs[input.name]
                                                }/>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="block inside-draggable-block column-elements">
                        <h3 className="inside-draggable-block-element">params</h3>
                        <ul className="column-elements">
                            {
                                params.map((param) => {
                                    return (
                                            <li className={param.type === "checkbox" ? "row-elements" : "column-elements"}
                                                key={cellInfo.id + param.name}>
                                                <h5 className="inside-draggable-block-element"
                                                    style={param.type === "checkbox" ? {transform: "translate(9px, 0)"} : {}}>
                                                    {param.name}
                                                </h5>
                                                {
                                                    param.type === "checkbox" ?
                                                        // @ts-ignore
                                                        (<input id={param.name} type={param.type} checked={cellsInputs.inputParams[param.name]}
                                                                className="inside-draggable-block-element"
                                                                style={{transform: "translate(9px, 0)"}}
                                                                pattern={param.pattern} onChange={updateParamHandler} />
                                                        ) :
                                                        (<input id={param.name} type={param.type}
                                                                value={//@ts-ignore
                                                                cellsInputs.inputParams[param.name]}
                                                                className="cell-text-input inside-draggable-block-element"
                                                                pattern={param.pattern}
                                                                onChange={updateParamHandler}/>)
                                                }
                                            </li>
                                        )
                                    }
                                )
                            }
                        </ul>
                    </div>
                    <div className="block inside-draggable-block column-elements">
                        <h3 className="inside-draggable-block-element">outputs</h3>
                        <ul className="column-elements">
                            {
                                cellsInputs.outputNames.map((elem) => {
                                    return (<li key={cellInfo.id + elem.field}>
                                        <h5 className="inside-draggable-block-element">{elem.field}</h5>

                                    </li>);
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Draggable>);
}

export default Cell;
