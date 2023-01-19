import CellInfo from "../../types/cellInfo";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {useAppSelector, useAppDispatch} from "../../hooks"
import {
    deleteCell,
    executeCell,
    moveCell,
    saveFile,
    updateInput,
    updateParam
} from "../../store/api-actions";
import React, {FormEvent, useEffect, useState} from "react";
import Inputs from "./cellComponents/inputs";
import CellParams from "./cellTypes/cellParams";
import InputParams from "./cellComponents/inputParams";
import Outputs from "./cellComponents/outputs";
import {CellStatus, CellStatusStyle} from "../../types/cellStatus";
import Graphs from "./cellComponents/graphs";


type CellProps = {
    cellInfo: CellInfo;
    pipelineId: string;
};


function Cell({cellInfo, pipelineId}: CellProps): JSX.Element {
    const dispatch = useAppDispatch();
    const functionsInfo = useAppSelector((state) => state.cellsFunctions);
    const functionInfo = functionsInfo.find((elem) => (elem.function === cellInfo.function));

    const defaultCellParams: CellParams = {
        inputsPath: cellInfo.inputs,
        inputParams: cellInfo.input_params,
        outputs: {},
        selectedInputsColumn: cellInfo.data_columns,
        graphInputs: {},
        graphOutputs: {}
    };
    const [cellParams, setCellParams] = useState(defaultCellParams);
    const [cellStatus, setCellStatus] = useState(CellStatus.NOT_EXECUTED);

    useEffect(() => {
        for (const key in cellParams.inputsPath) {
            setCellParams((state) => {return {...state, graphInputs: {...state.graphInputs, [key]: false}}});
        }
        for (const key in cellParams.outputs) {
            setCellParams((state) => {return {...state, graphOutputs: {...state.graphOutputs, [key]: false}}});
        }
    }, []);

    useEffect(() => {
        if (cellInfo.error !== null) {
            setCellStatus(cellInfo.error);
        } else {
            for (const key in cellInfo.outputs) {
                if (cellInfo.outputs[key] !== null) {
                    setCellStatus(CellStatus.EXECUTED);
                }
            }
        }}
    );

    const stopHandler = (event: DraggableEvent, data: DraggableData) => {
        event.preventDefault();
        dispatch(moveCell({cellId: cellInfo.id, x: data.x, y: data.y}));
    }

    const updateInputHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        const select = event.target;
        const options = select.options;
        const selectedIndex = options.selectedIndex;
        const path = (selectedIndex !== -1) ? options[selectedIndex].id : null;
        const value = (options.selectedIndex !== -1) ? options[selectedIndex].value : "";
        const fieldName = select.id;
        setCellParams((state) => {return {...state, inputsPath: {...state.inputsPath, [fieldName]: path}}});
    }

    const updateInputColumnHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        const select = event.target;
        const options = select.options;
        const selectedIndex = options.selectedIndex;
        const value = (options.selectedIndex !== -1) ? options[selectedIndex].value : "";
        const fieldName = select.id;
        setCellParams((state) => {return {...state, selectedInputsColumn: {...state.selectedInputsColumn, [fieldName]: value}}});
    }

    const updateParamHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = (event.currentTarget.type === "checkbox" ? event.target.checked : event.target.value);
        setCellParams((state) => {return {...state, inputParams: {...state.inputParams, [fieldName]: value}}});
    }

    const updateOutputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = event.target.value;
        setCellParams((state) => {return {...state, outputs: {...state.outputs, [fieldName]: value}}});
    }

    const submitInputsHandler = async (event: FormEvent<HTMLButtonElement>) => {
        setCellStatus(CellStatus.SAVING);
        const elem = cellParams;
        for (const key in elem.inputsPath) {
            const path = elem.inputsPath[key as keyof typeof elem.inputsPath];
            const dataColumn = elem.selectedInputsColumn[key as keyof typeof elem.selectedInputsColumn];
            if (path !== null && dataColumn !== null) {
                dispatch(updateInput({
                    cellId: cellInfo.id,
                    path: path,
                    field: key, data_column: dataColumn,
                    setCellStatus: setCellStatus
                }));
            }
        }
        if (cellStatus === CellStatus.SAVING) {
            setCellStatus(CellStatus.SAVED);
        }
        event.preventDefault();
    }

    const submitParamsHandler = async (event: FormEvent<HTMLButtonElement>) => {
        setCellStatus(CellStatus.SAVING);
        const elem = cellParams;
        for (const key in elem.inputParams) {
            const notNumberValue = elem.inputParams[key as keyof typeof elem.inputParams];
            //@ts-ignore
            const paramType = functionInfo.input_params[key];
            const value = (paramType === "int" || paramType === "float") ? Number(notNumberValue) : notNumberValue;
            dispatch(updateParam({cellId: cellInfo.id, value: value, field: key, setCellStatus: setCellStatus}));
        }
        if (cellStatus === CellStatus.SAVING) {
            setCellStatus(CellStatus.SAVED);
        }
        event.preventDefault();
    }

    const saveFilesHandler = (event: FormEvent<HTMLButtonElement>) => {
        setCellStatus(CellStatus.SAVING);
        const elem = cellParams;
        for (const key in elem.outputs) {
            const value = elem.outputs[key as keyof typeof elem.outputs];
            if (value !== "" && value != null) {
                const path = cellInfo.outputs[key as keyof typeof cellInfo.outputs];
                if (path !== null) {
                    dispatch(saveFile({path: path, name: value}));
                }
            }
        }
        if (cellStatus === CellStatus.SAVING) {
            setCellStatus(CellStatus.SAVED);
        }
        event.preventDefault();
    }

    const executeHandler = async (event: FormEvent<HTMLButtonElement>) => {
        await submitParamsHandler(event);
        await submitInputsHandler(event);
        setCellStatus(CellStatus.IN_PROCESS);
        dispatch(executeCell({cellId: cellInfo.id, setCellStatus: setCellStatus}));
        event.preventDefault();
    }

    const deleteCellHandler = (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(deleteCell({cellId: cellInfo.id, pipelineId: pipelineId}));
    }

    const updateShowGraphInputsHandler = (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = event.currentTarget.checked;
        setCellParams((state) => {return {...state, graphInputs: {...state.graphInputs, [fieldName]: value}}});
    }

    return (
        <Draggable handle=".drag-handle" onStop={stopHandler}
                   defaultPosition={{x: cellInfo.x, y: cellInfo.y}}
                   bounds={{left: 0, top: 0}} key={cellInfo.id}>
            <div className="column-elements cell">
                <div className="drag-handle row-elements">
                    {/*@ts-ignore*/}
                    <h3 style={{color: "red", ...CellStatusStyle[cellStatus], userSelect: "none"}}>{cellStatus}</h3>
                    <h3 style={{margin: 0, marginLeft: "10px", userSelect: "none"}}>{cellInfo.function}</h3>
                    <button className="block-button head-button" onClick={deleteCellHandler}>Delete</button>
                </div>
                <div className="column-elements" style={{width: "100%"}}>
                    <Inputs cellId={cellInfo.id}
                            updateInputHandler={updateInputHandler}
                            updateColumnHandler={updateInputColumnHandler}
                            submitInputsHandler={submitInputsHandler}
                            updateShowGraphHandler={updateShowGraphInputsHandler}
                            cellParams={cellParams}/>
                    <InputParams cellId={cellInfo.id} functionName={cellInfo.function}
                                 inputParams={cellInfo.input_params}
                                 submitParamsHandler={submitParamsHandler}
                                 updateParamHandler={updateParamHandler}
                                 cellParams={cellParams}/>
                    <Outputs cellId={cellInfo.id} outputs={cellInfo.outputs}
                             saveFilesHandler={saveFilesHandler}
                             updateOutputNameHandler={updateOutputNameHandler}
                             cellParams={cellParams}/>
                    <Graphs cellId={cellInfo.id} cellParams={cellParams}/>
                </div>
                <button className="block-button cell-execute-button" key={cellInfo.id + "execute"}
                        onClick={executeHandler}>
                    Execute
                </button>
            </div>
        </Draggable>);
}

export default Cell;
