import React, {ChangeEvent, FormEvent, useContext, useState} from "react";
import Output from "../cellTypes/output";
import CellContext from "../cellContext";

type OutputsParams = {
    cellId: string,
    outputs: {},
    updateOutputNameHandler: (event: ChangeEvent<HTMLInputElement>) => void,
    saveFilesHandler: (event: FormEvent<HTMLButtonElement>) => void
};

function Outputs({cellId, outputs, updateOutputNameHandler, saveFilesHandler}: OutputsParams): JSX.Element {
    const outputNames: string[] = [];
    const cellParams = useContext(CellContext);
    for (const key in outputs) {
        if (outputs[key as keyof typeof outputs] !== null) {
            outputNames.push(key);
        }
    }
    return (<div>
                <div className="sign-in-block cell-inside-block column-elements">
                    <h3 className="cell-inside-block-element">outputs</h3>
                    <ul className="column-elements cell-inside-ul">
                        {
                            outputNames.map((output) => {
                                return (
                                    <li key={cellId + output} className="column-elements">
                                        <h5 className="cell-inside-block-element">{output}</h5>
                                        <input value={cellParams.outputs[output as keyof typeof cellParams.outputs]}
                                               className="cell-inside-block-element cell-text-input"
                                               type="text" id={output}
                                               onChange={updateOutputNameHandler}/>
                                    </li>);
                            })
                        }
                    </ul>
                </div>
                <div className="cell-inside-button-block column-elements">
                    <button className="block-button cell-button" onClick={saveFilesHandler}
                            key={cellId + "output"}>
                        save output files
                    </button>
                </div>
            </div>);
}

export default Outputs;
