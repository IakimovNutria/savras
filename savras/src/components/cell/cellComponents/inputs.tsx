import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useAppSelector} from "../../../hooks";
import Input from "../cellTypes/input";
import CellParams from "../cellTypes/cellParams";


type InputProps = {
    cellId: string;
    updateInputHandler: (event: ChangeEvent<HTMLSelectElement>) => void;
    updateShowGraphHandler: (event: FormEvent<HTMLInputElement>) => void;
    updateColumnHandler: (event: ChangeEvent<HTMLSelectElement>) => void;
    submitInputsHandler: (event: FormEvent<HTMLButtonElement>) => void;
    cellParams: CellParams;
};

function Inputs({cellId, updateInputHandler, updateColumnHandler, submitInputsHandler, updateShowGraphHandler, cellParams}: InputProps): JSX.Element {
    const files = useAppSelector((state) => state.filesList);
    const dataColumns = useAppSelector((state) => state.fileColumns);
    const inputPaths = cellParams.inputsPath;
    const inputColumns = cellParams.selectedInputsColumn;
    const defaultInputsArray: Input[] = [];
    const [inputsArray, setInputsArray] = useState(defaultInputsArray);
    const defaultIsShowGraph: {[key: string]: boolean} = {};
    const [isShowGraph, setIsShowGraph] = useState(defaultIsShowGraph);

    useEffect(() => {
        function getFileName(path: string | null) {
            const file = files.find((elem) => elem.path === path);
            if (file === undefined) {
                return null;
            }
            return file.name;
        }
        for (const key in cellParams.inputsPath) {
            const graphInput = cellParams.graphInputs[key];
            setIsShowGraph((state) => {return {...state, [key]: graphInput}});
        }
        const newInputsArray = [];
        for (const key in inputPaths) {
            const toPush: Input = {
                name: key,
                fileName: getFileName(inputPaths[key]),
                inputColumn: inputColumns[key],
                path: inputPaths[key]
            };
            newInputsArray.push(toPush);
        }
        setInputsArray(newInputsArray);
    }, [cellParams, inputColumns, inputPaths, files]);

    const getFileColumns = (path: string | null) => {
        if (path && dataColumns.hasOwnProperty(path)) {
            return dataColumns[path];
        }
        return [];
    }

    return (
        <div className="row-elements cell-inside-block">
            <h3 className="cell-inside-block-element">Inputs</h3>
            <ul className="row-elements cell-inside-ul">
                {
                    inputsArray.map((input) => (
                        <li className="row-elements" key={cellId + input.name}>
                            <div className="row-elements cell-inside-block-element" style={{justifyContent: "normal"}} key={cellId + input.name}>
                                <div className="column-elements" style={{margin: 0, justifyContent: "center", marginRight: "2px"}}
                                     key={cellId + input.name}>
                                    <img alt="graph-icon" src="/img/graph-icon.png" style={{width: "15px", height: "15px"}}/>
                                    <input type="checkbox" style={{margin: 0}}
                                           checked={isShowGraph[input.name]}
                                           id={input.name} onChange={updateShowGraphHandler}/>
                                </div>
                                <h3 style={{marginBottom: 0, marginTop: 0}}>{input.name}:</h3>
                            </div>
                            <select value={(input.fileName === null) ? "choose file" : input.fileName}
                                    onChange={updateInputHandler}
                                    name={input.name} id={input.name}>
                                {
                                    (input.fileName === null) && (<option id={""}>choose file</option>)
                                }
                                {
                                    files.map((file) => (<option id={file.path}>{file.name}</option>))
                                }
                            </select>
                            {
                                (input.fileName !== null) &&
                                    (<select value={input.inputColumn ? input.inputColumn : "choose column"}
                                             onChange={updateColumnHandler} id={input.name}>
                                        {
                                            input.inputColumn || (<option id={""}>choose column</option>)
                                        }
                                        {
                                            getFileColumns(input.path).map((elem) =>
                                                (<option id={input.name + elem}>{elem}</option>))
                                        }
                                    </select>)
                            }
                        </li>
                    ))
                }
            </ul>
            <button className="block-button cell-inside-button" onClick={submitInputsHandler}
                    key={cellId + "inputs"}>
                Save inputs
            </button>
        </div>);
}

export default Inputs;