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
    return (
        <React.Fragment>
                <div className="cell-inside-block row-elements">
                    <h3 className="cell-inside-block-element">Outputs</h3>
                    <ul className="row-elements cell-inside-ul">
                        {
                            outputNames.map((output) => {
                                return (
                                    <li key={cellId + output} className="row-elements">
                                        <h3 className="cell-inside-block-element">{output}:</h3>
                                        <input value={cellParams.outputs[output as keyof typeof cellParams.outputs]}
                                               className="cell-inside-block-element text-input"
                                               type="text" id={output}
                                               style={{height: "35px", width: "80px"}}
                                               onChange={updateOutputNameHandler}/>
                                    </li>);
                            })
                        }
                    </ul>
                    <button className="block-button cell-button cell-inside-button" onClick={saveFilesHandler}
                            key={cellId + "output"}>
                        Save output files
                    </button>
                </div>
            </React.Fragment>);
}

export default Outputs;
