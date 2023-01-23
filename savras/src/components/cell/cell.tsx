import CellInfo from "../../types/cell-info";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {useAppSelector, useAppDispatch} from "../../hooks"
import {
    deleteCell,
    executeCell, fetchCellInfo, fetchFileColumns, fetchPipeline,
    moveCell,
    saveFile,
    updateInputs,
    updateParams
} from "../../store/api-actions";
import React, {FormEvent, useEffect, useState} from "react";
import Inputs from "./cellComponents/inputs";
import CellParams from "./cellTypes/cellParams";
import InputParams from "./cellComponents/inputParams";
import Outputs from "./cellComponents/outputs";
import {CellStatus, CellStatusStyle} from "../../types/cell-status";
import Graphs from "./cellComponents/graphs";
import useInterval from "@use-it/interval";


type CellProps = {
    cellInfo: CellInfo;
    pipelineId: string;
};


function Cell({cellInfo, pipelineId}: CellProps): JSX.Element {
    const dispatch = useAppDispatch();
    const functionsInfo = useAppSelector((state) => state.cellsFunctions);
    const functionInfo = functionsInfo.find((elem) => (elem.function === cellInfo.function));
    const dataColumns = useAppSelector((state) => state.fileColumns);
    const cellStatus: string = useAppSelector((state) => state.cellsStatus)[cellInfo.id];

    const defaultCellParams: CellParams = {
        inputsPath: cellInfo.inputs,
        inputParams: cellInfo.input_params,
        outputs: {},
        selectedInputsColumn: cellInfo.data_columns,
        graphInputs: {},
        graphOutputs: {}
    };
    const [cellParams, setCellParams] = useState(defaultCellParams);

    useEffect(() => {
        for (const key in cellInfo.inputs) {
            setCellParams((state) => {return {...state, graphInputs: {...state.graphInputs, [key]: false}}});
        }
        for (const key in cellInfo.outputs) {
            setCellParams((state) => {return {...state, graphOutputs: {...state.graphOutputs, [key]: false}}});
        }
    }, [cellInfo]);

    useEffect(() => {
        for (const key in cellInfo.inputs) {
            const path = cellInfo.inputs[key];
            if (path && !dataColumns.hasOwnProperty(path)) {
                dispatch(fetchFileColumns({path: path}));
            }
        }
    });

    useInterval(() => {
        dispatch(fetchCellInfo({cellId: cellInfo.id}));
    }, cellStatus === CellStatus.IN_PROCESS ? 1000 * 5 : null);

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
        const fieldName = select.id;
        if (path && !dataColumns.hasOwnProperty(path)) {
            dispatch(fetchFileColumns({path: path}));
        }
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
        const value = event.currentTarget.type === "checkbox" ? event.target.checked : event.target.value;
        setCellParams((state) => {return {...state, inputParams: {...state.inputParams, [fieldName]: value}}});
    }

    const updateOutputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = event.target.value;
        setCellParams((state) => {return {...state, outputs: {...state.outputs, [fieldName]: value}}});
    }

    const submitInputsHandler = async (event: FormEvent<HTMLButtonElement>) => {
        const elem = cellParams;
        const toUpdate: {path: string, data_column: string, field: string}[] = [];
        for (const key in elem.inputsPath) {
            const path = elem.inputsPath[key];
            const dataColumn = elem.selectedInputsColumn[key];
            if (path !== null && dataColumn !== null) {
                toUpdate.push({path: path, data_column: dataColumn, field: key});
            }
        }
        dispatch(updateInputs({cellId: cellInfo.id, inputs: toUpdate}));
        event.preventDefault();
    }

    const submitParamsHandler = async (event: FormEvent<HTMLButtonElement>) => {
        const toUpdate: {field: string, value: string | boolean | number}[] = [];
        for (const key in cellParams.inputParams) {
            const notNumberValue = cellParams.inputParams[key];
            const paramType = functionInfo ? functionInfo.input_params[key] : 0;
            const value = (paramType === "int" || paramType === "float") ? Number(notNumberValue) : notNumberValue;
            toUpdate.push({field: key, value: value});
        }
        dispatch(updateParams({cellId: cellInfo.id, params: toUpdate}));
        event.preventDefault();
    }

    const saveFilesHandler = (event: FormEvent<HTMLButtonElement>) => {
        const elem = cellParams;
        for (const key in elem.outputs) {
            const value = elem.outputs[key];
            if (value !== "" && value != null) {
                const path = cellInfo.outputs[key];
                if (path !== null) {
                    dispatch(saveFile({path: path, name: value}));
                }
            }
        }
        event.preventDefault();
    }

    const executeHandler = async (event: FormEvent<HTMLButtonElement>) => {
        dispatch(executeCell({cellId: cellInfo.id}));
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

    const updateShowGraphOutputHandler = (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = event.currentTarget.checked;
        setCellParams((state) => {return {...state, graphOutputs: {...state.graphOutputs, [fieldName]: value}}});
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
                             cellParams={cellParams}
                             updateShowGraphHandler={updateShowGraphOutputHandler}/>
                    <Graphs cellId={cellInfo.id} cellParams={cellParams} outputs={cellInfo.outputs}/>
                </div>
                <button className="block-button cell-execute-button" key={cellInfo.id + "execute"}
                        onClick={executeHandler}>
                    Execute
                </button>
            </div>
        </Draggable>);
}

export default Cell;
