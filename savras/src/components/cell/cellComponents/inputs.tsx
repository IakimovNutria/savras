import React, {ChangeEvent, FormEvent, useContext, useEffect} from "react";
import {useAppSelector} from "../../../hooks";
import Input from "../cellTypes/input";
import CellContext from "../cellContext";


type InputProps = {
    cellId: string,
    updateInputHandler: (event: ChangeEvent<HTMLSelectElement>) => void,
    updateColumnHandler: (event: ChangeEvent<HTMLSelectElement>) => void,
    submitInputsHandler: (event: FormEvent<HTMLButtonElement>) => void
};

function Inputs({cellId, updateInputHandler, updateColumnHandler, submitInputsHandler}: InputProps): JSX.Element {
    const files = useAppSelector((state) => state.filesList);
    const cellParams = useContext(CellContext);
    const inputPaths = cellParams.inputsPath;
    const inputColumns = cellParams.selectedInputsColumn;
    const inputsArray: Input[] = [];
    function getFileName(path: string | null) {
        const file = files.find((elem) => elem.path === path);
        if (file === undefined) {
            return null;
        }
        return file.name;
    }
    for (const key in inputPaths) {
        const toPush: Input = {
            name: key,
            fileName: getFileName(inputPaths[key as keyof typeof inputPaths]),
            inputColumn: inputColumns[key as keyof typeof inputColumns],
            path: inputPaths[key as keyof typeof inputPaths]
        };
        inputsArray.push(toPush);
    }
    const getFileColumns = (path: string | null) => {
        if (path === null) {
            return [];
        }
        const file = files.find((f) => f.path === path);
        return file === undefined ? [] : file.columns;
    }

    return (
        <React.Fragment>
            <div className="row-elements cell-inside-block">
                <h3 className="cell-inside-block-element">Inputs</h3>
                <ul className="row-elements cell-inside-ul">
                    {
                        inputsArray.map((input) => (
                            <li className="row-elements" key={cellId + input.name}>
                                <h3 className="cell-inside-block-element">{input.name}:</h3>
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
                                        (<select value={input.inputColumn === null ? "choose column" : input.inputColumn}
                                                 onChange={updateColumnHandler} id={input.name}>
                                            {
                                                input.inputColumn === null && (<option id={""}>choose column</option>)
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
                <button className="block-button cell-button cell-inside-button" onClick={submitInputsHandler}
                        key={cellId + "inputs"}>
                    Save inputs
                </button>
            </div>
        </React.Fragment>);
}

export default Inputs;