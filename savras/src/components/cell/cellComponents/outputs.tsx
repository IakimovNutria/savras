import React, {ChangeEvent, FormEvent} from "react";
import CellParams from "../cellTypes/cellParams";

type OutputsParams = {
    cellId: string;
    outputs: {};
    updateOutputNameHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    saveFilesHandler: (event: FormEvent<HTMLButtonElement>) => void;
    cellParams: CellParams;
};

function Outputs({cellId, outputs, updateOutputNameHandler, saveFilesHandler, cellParams}: OutputsParams): JSX.Element {
    const outputNames: string[] = [];
    for (const key in outputs) {
        if (outputs[key as keyof typeof outputs] !== null) {
            outputNames.push(key);
        }
    }
    return (
        <div className="row-elements cell-inside-block">
            <div className="cell-inside-block row-elements">
                <h3 className="cell-inside-block-element">outputs</h3>
                <ul className="row-elements cell-inside-ul">
                    {
                        outputNames.map((output) => {
                            return (
                                <li key={cellId + output} className="row-elements">
                                    <h5 className="cell-inside-block-element">{output}</h5>
                                    {/*@ts-ignore*/}
                                    <input value={cellParams.outputs[output] === null ? undefined : cellParams.outputs[output]}
                                           className="cell-inside-block-element text-input"
                                           type="text" id={output}
                                           style={{height: "35px", width: "80px"}}
                                           onChange={updateOutputNameHandler}/>
                                </li>);
                        })
                    }
                </ul>
            </div>
            <button className="block-button cell-button cell-inside-button" onClick={saveFilesHandler}
                    key={cellId + "output"}>
                Save output files
            </button>
        </div>);
}

export default Outputs;
