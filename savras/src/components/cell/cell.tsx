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
import CellContext from "./cellContext";
import CellParams from "./cellTypes/cellParams";
import InputParams from "./cellComponents/inputParams";
import Outputs from "./cellComponents/outputs";
import {CellStatus, CellStatusStyle} from "../../types/cellStatus";


type CellProps = {
    cellInfo: CellInfo;
    pipelineId: string;
};


function Cell({cellInfo, pipelineId}: CellProps): JSX.Element {
    const dispatch = useAppDispatch();
    const functionsInfo = useAppSelector((state) => state.cellsFunctions);
    const functionInfo = functionsInfo.find((elem) => (elem.function === cellInfo.function));
    const files = useAppSelector((state) => state.filesList);

    const defaultCellsInput: CellParams = {
        inputsPath: cellInfo.inputs,
        inputParams: cellInfo.input_params,
        outputs: {},
        selectedInputsColumn: cellInfo.data_columns
    };
    const [cellParams, setCellParams] = useState(defaultCellsInput);
    const [executeStatus, setExecuteStatus] = useState(CellStatus.NOT_EXECUTED);


    useEffect(() => {
        if (cellInfo.error !== null) {
            setExecuteStatus(cellInfo.error);
        } else {
            for (const key in cellInfo.outputs) {
                if (cellInfo.outputs[key as keyof typeof cellInfo.outputs] !== null) {
                    setExecuteStatus(CellStatus.EXECUTED);
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
        setCellParams({...cellParams,
            inputsPath: {...cellParams.inputsPath, [fieldName]: path}});
    }

    const updateInputColumnHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        const select = event.target;
        const options = select.options;
        const selectedIndex = options.selectedIndex;
        const value = (options.selectedIndex !== -1) ? options[selectedIndex].value : "";
        const fieldName = select.id;
        setCellParams({...cellParams, selectedInputsColumn: {...cellParams.selectedInputsColumn, [fieldName]: value}});
    }

    const updateParamHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = (event.currentTarget.type === "checkbox" ? event.target.checked : event.target.value);
        setCellParams({...cellParams, inputParams: {...cellParams.inputParams, [fieldName]: value}});
    }

    const updateOutputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.currentTarget.id;
        const value = event.target.value;
        setCellParams({...cellParams, outputs: {...cellParams.outputs, [fieldName]: value}});
    }

    const dragHandler = (event: DraggableEvent, data: DraggableData) => {
        event.preventDefault();
        /*setSize((value: {width: number, height: number}) => {
            return {width: Math.max(data.x + 500, value.width), height: Math.max(data.y + 500, value.height)};
        });*/
    }

    const submitInputsHandler = async (event: FormEvent<HTMLButtonElement>) => {
        const elem = cellParams;
        for (const key in elem.inputsPath) {
            const path = elem.inputsPath[key as keyof typeof elem.inputsPath];
            const dataColumn = elem.selectedInputsColumn[key as keyof typeof elem.selectedInputsColumn];
            dispatch(updateInput({cellId: cellInfo.id, path: path, field: key, data_column: dataColumn}));
        }
        event.preventDefault();
    }

    const submitParamsHandler = async (event: FormEvent<HTMLButtonElement>) => {
        const elem = cellParams;
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
        const elem = cellParams;
        for (const key in elem.outputs) {
            const value = elem.outputs[key as keyof typeof elem.outputs];
            if (value !== "") {
                const path = cellInfo.outputs[key as keyof typeof cellInfo.outputs];
                if (path !== null) {
                    dispatch(saveFile({path: path, name: value}));
                }
            }
        }
        event.preventDefault();
    }

    const executeHandler = async (event: FormEvent<HTMLButtonElement>) => {
        await submitParamsHandler(event);
        await submitInputsHandler(event);
        setExecuteStatus(CellStatus.IN_PROCESS);
        dispatch(executeCell({cellId: cellInfo.id, setCellStatus: setExecuteStatus}));
        event.preventDefault();
    }

    const deleteCellHandler = (event: FormEvent<HTMLDivElement>) => {
        event.preventDefault();
        dispatch(deleteCell({cellId: cellInfo.id, pipelineId: pipelineId}));
    }

    return (
        <Draggable handle=".drag-handle" onStop={stopHandler}
                   defaultPosition={{x: cellInfo.x, y: cellInfo.y}}
                   bounds={{left: 0, top: 0}} key={cellInfo.id}>
            <div className="block column-elements cell">
                <div className="drag-handle row-elements">
                    {/*@ts-ignore*/}
                    <h5 style={{color: "red", ...CellStatusStyle[executeStatus], margin: 0, userSelect: "none"}} className="center">{executeStatus}</h5>
                    <h5 style={{margin: 0, marginLeft: "5px", userSelect: "none"}}>{cellInfo.function}</h5>
                    <div className="delete-button" style={{position: "absolute", right:0}} onClick={deleteCellHandler}/>
                </div>
                <CellContext.Provider value={cellParams}>
                <div className="row-elements">
                    <Inputs cellId={cellInfo.id}
                            updateInputHandler={updateInputHandler}
                            updateColumnHandler={updateInputColumnHandler}
                            submitInputsHandler={submitInputsHandler}/>
                    <InputParams cellId={cellInfo.id} functionName={cellInfo.function}
                                 inputParams={cellInfo.input_params}
                                 submitParamsHandler={submitParamsHandler}
                                 updateParamHandler={updateParamHandler}/>
                    <Outputs cellId={cellInfo.id} outputs={cellInfo.outputs}
                             saveFilesHandler={saveFilesHandler}
                             updateOutputNameHandler={updateOutputNameHandler}/>
                </div>
                <button className="block-button cell-execute-button" key={cellInfo.id + "execute"}
                        onClick={executeHandler}>
                    execute
                </button>
                </CellContext.Provider>
            </div>
        </Draggable>);
}

export default Cell;
