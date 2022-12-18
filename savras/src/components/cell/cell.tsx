import CellInfo from "../../types/cellInfo";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {useAppSelector, useAppDispatch} from "../../hooks"
import {executeCell, fetchPipeline, moveCell, updateInput, updateParam} from "../../store/api-actions";
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
    type CellsInput = {
        inputs: {};
        inputParams: {};
        outputs: {};
    };
    const defaultCellsInput: CellsInput = {
        inputs: cellInfo.inputs,
        inputParams: cellInfo.input_params,
        outputs: cellInfo.outputs
    };
    const [cellsInputs, setCellsInputs] = useState(defaultCellsInput);

    type ParamInput = {
        name: string,
        value: string | boolean | number,
        type: string,
        pattern: string
    };
    type Input = {
        name: string,
        value: string
    };
    type Output = {
        name: string,
        value: string
    };
    const inputs: Input[] = [];
    const params: ParamInput[] = [];
    const outputs: Output[] = [];
    for (const key in cellInfo.inputs) {
        const toPush: Input = {name: key, value: cellInfo.inputs[key as keyof typeof cellInfo.inputs]};
        if (toPush.value === null) {
            toPush.value = "";
        }
        inputs.push(toPush);
    }
    for (const key in cellInfo.outputs) {
        const toPush: Output = {name: key, value: cellInfo.outputs[key as keyof typeof cellInfo.outputs]};
        if (toPush.value === null) {
            toPush.value = "";
        }
        outputs.push(toPush);
    }
    if (functionInfo !== undefined) {
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

    const updateOutputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = event.target.value;
        setCellsInputs({...cellsInputs, outputs: {...cellsInputs.outputs, [fieldName]: value}});
    }

    const dragHandler = (event: DraggableEvent, data: DraggableData) => {
        event.preventDefault();
        /*setSize((value: {width: number, height: number}) => {
            return {width: Math.max(data.x + 500, value.width), height: Math.max(data.y + 500, value.height)};
        });*/
    }

    const submitInputsHandler = (event: FormEvent<HTMLButtonElement>) => {
        const elem = cellsInputs;
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

    const submitParamsHandler = (event: FormEvent<HTMLButtonElement>) => {
        const elem = cellsInputs;
        for (const key in elem.inputParams) {
            const notNumberValue = elem.inputParams[key as keyof typeof elem.inputParams];
            //@ts-ignore
            const paramType = functionInfo.input_params[key];
            const value = (paramType === "int" || paramType === "float") ? Number(notNumberValue) : notNumberValue;
            dispatch(updateParam({cellId: cellInfo.id, value: value, field: key}));
        }
        event.preventDefault();
    }

    const saveFilesHandler = (event: FormEvent<HTMLButtonElement>) => {
        const elem = cellsInputs;
        for (const key in elem.outputs) {
            const value = elem.outputs[key as keyof typeof elem.outputs];
            if (value !== "") {
                // TODO: сохранять файл
            }
        }
        event.preventDefault();
    }

    const executeHandler = (event: FormEvent<HTMLButtonElement>) => {
        submitParamsHandler(event);
        submitInputsHandler(event);
        dispatch(executeCell({cellId: cellInfo.id}));
        dispatch(fetchPipeline({pipelineId: pipelineId}));
        event.preventDefault();
    }


    return (
        <Draggable handle=".drag-handle" onStop={stopHandler} defaultPosition={{x: cellInfo.x, y: cellInfo.y}}
                   bounds={{left: 0, top: 0}} key={cellInfo.id}>
            <div className="block column-elements cell">
                <div className="drag-handle" />
                <div className="row-elements">
                    <div>
                        <div className="column-elements block cell-inside-block">
                            <h3 className="cell-inside-block-element">inputs</h3>
                            <ul className="column-elements cell-inside-ul">
                            {
                                inputs.map((input) => (
                                    <li className="column-elements" key={cellInfo.id + input.name}>
                                        <h5 className="cell-inside-block-element">{input.name}</h5>
                                        <input className="cell-text-input cell-inside-block-element"
                                               id={input.name} type="text"
                                               onChange={updateInputHandler}
                                               value={//@ts-ignore
                                                    cellsInputs.inputs[input.name]
                                                }/>
                                    </li>
                                ))
                            }
                            </ul>
                        </div>
                        <div className="cell-inside-button-block column-elements">
                            <button className="block-button cell-button" onClick={submitInputsHandler}
                                    key={cellInfo.id + "inputs"}>
                                save inputs
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="block cell-inside-block column-elements">
                            <h3 className="cell-inside-block-element">params</h3>
                            <ul className="column-elements cell-inside-ul">
                            {
                                params.map((param) => {
                                    return (
                                            <li className={param.type === "checkbox" ? "row-elements" : "column-elements"}
                                                key={cellInfo.id + param.name}>
                                                <h5 className="cell-inside-block-element"
                                                    style={param.type === "checkbox" ? {transform: "translate(9px, 0)"} : {}}>
                                                    {param.name}
                                                </h5>
                                                {
                                                    param.type === "checkbox" ?
                                                        // @ts-ignore
                                                        (<input id={param.name} type={param.type} checked={cellsInputs.inputParams[param.name]}
                                                                className="cell-inside-block-element"
                                                                style={{transform: "translate(9px, 0)"}}
                                                                pattern={param.pattern} onChange={updateParamHandler} />
                                                        ) :
                                                        // @ts-ignore
                                                        (<input value={cellsInputs.inputParams[param.name]}
                                                                id={param.name} type={param.type}
                                                                className="cell-text-input cell-inside-block-element"
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
                        <div className="cell-inside-button-block column-elements" key={cellInfo.id + "params"}>
                            <button className="block-button cell-button" onClick={submitParamsHandler}>save params</button>
                        </div>
                    </div>
                    <div>
                        <div className="block cell-inside-block column-elements">
                            <h3 className="cell-inside-block-element">outputs</h3>
                            <ul className="column-elements cell-inside-ul">
                            {
                                outputs.map((output) => {
                                    return (
                                        <li key={cellInfo.id + output.name} className="column-elements">
                                            <h5 className="cell-inside-block-element">{output.name}</h5>
                                            {/*@ts-ignore*/}
                                            <input value={cellsInputs.outputs[output.name]}
                                                   className="cell-inside-block-element cell-text-input"
                                                   type="text" id={output.name}
                                                   onChange={updateOutputNameHandler}/>
                                        </li>);
                                })
                            }
                            </ul>
                        </div>
                        <div className="cell-inside-button-block column-elements">
                            <button className="block-button cell-button" onClick={saveFilesHandler}
                                    key={cellInfo.id + "output"}>
                                save output files
                            </button>
                        </div>
                    </div>
                </div>
                <button className="block-button cell-execute-button" key={cellInfo.id + "execute"}
                        onClick={executeHandler}>
                    execute
                </button>
            </div>
        </Draggable>);
}

export default Cell;
