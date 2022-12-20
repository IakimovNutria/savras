import React, {ChangeEvent, FormEvent, useContext} from "react";
import {useAppSelector} from "../../../hooks";
import Input from "../cellTypes/input";
import CellContext from "../cellContext";


type InputProps = {
    inputs: {},
    cellId: string,
    updateInputHandler: (event: ChangeEvent<HTMLSelectElement>) => void,
    updateColumnHandler: (event: ChangeEvent<HTMLSelectElement>) => void,
    submitInputsHandler: (event: FormEvent<HTMLButtonElement>) => void
};

function Inputs({inputs, cellId, updateInputHandler, updateColumnHandler, submitInputsHandler}: InputProps): JSX.Element {
    const files = useAppSelector((state) => state.filesList);
    const cellParams = useContext(CellContext);
    const inputsArray: Input[] = [];
    for (const key in inputs) {
        const toPush: Input = {name: key, value: inputs[key as keyof typeof inputs]};
        if (toPush.value === null) {
            toPush.value = "";
        }
        inputsArray.push(toPush);
    }


    const getFileColumns = (path: string) => {
        const file = files.find((f) => f.path === path);
        return file === undefined ? [] : file.columns;
    }

    return (
        <div>
            <div className="column-elements block cell-inside-block">
                <h3 className="cell-inside-block-element">inputs</h3>
                <ul className="column-elements cell-inside-ul">
                    {
                        inputsArray.map((input) => (
                            <li className="column-elements" key={cellId + input.name}>
                                <h5 className="cell-inside-block-element">{input.name}</h5>
                                {/*@ts-ignore*/}
                                <select value={cellParams.inputs[input.name] === null ? "choose file" : cellParams.inputs[input.name]}
                                        onChange={updateInputHandler}
                                        name={input.name} id={input.name}>
                                    {
                                        //@ts-ignore
                                        (cellParams.inputs[input.name] === null || cellParams.inputs[input.name] === "") ?
                                            (<option id={""}>выберите файл</option>) : (<></>)
                                    }
                                    {
                                        files.map((file) => (<option id={file.path}>{file.name}</option>))
                                    }
                                </select>
                                {
                                    //@ts-ignore
                                    (cellParams.inputs[input.name] !== null && cellParams.inputs[input.name] !== "") ?
                                        //@ts-ignore
                                        (<select value={cellParams.selectedInputsColumn[input.name] === null ? "choose column" : cellParams.selectedInputsColumn[input.name]}
                                                 onChange={updateColumnHandler} id={input.name}>
                                            {
                                                //@ts-ignore
                                                cellParams.selectedInputsColumn[input.name] === null ? (<option id={""}>choose column</option>) : (<></>)
                                            }
                                            {
                                                //@ts-ignore
                                                getFileColumns(cellParams.inputsPath[input.name]).map((elem) =>
                                                    (<option id={input.name + elem}>{elem}</option>))
                                            }
                                        </select>) :
                                        (<></>)
                                }
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="cell-inside-button-block column-elements">
                <button className="block-button cell-button" onClick={submitInputsHandler}
                        key={cellId + "inputs"}>
                    save inputs
                </button>
            </div>
        </div>);
}

export default Inputs;