import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import CellParams from "../cellTypes/cellParams";

type OutputsParams = {
    cellId: string;
    outputs: {[key: string]: string | null};
    updateOutputNameHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    saveFilesHandler: (event: FormEvent<HTMLButtonElement>) => void;
    cellParams: CellParams;
    updateShowGraphHandler: (event: FormEvent<HTMLInputElement>) => void;
};

function Outputs({cellId, outputs, updateOutputNameHandler, saveFilesHandler, cellParams, updateShowGraphHandler}: OutputsParams): JSX.Element {
    const defaultOutputNames: string[] = [];
    const [outputNames, setOutputNames] = useState(defaultOutputNames);
    const defaultIsShowGraph: {[key: string]: boolean} = {};
    const [isShowGraph, setIsShowGraph] = useState(defaultIsShowGraph);
    const defaultName: {[key: string]: string} = {};
    const [names, setNames] = useState(defaultName);

    useEffect(() => {
        const newOutputNames = [];
        for (const key in outputs) {
            if (outputs[key] !== null) {
                newOutputNames.push(key);
            }
        }
        setOutputNames(newOutputNames);
    }, [outputs]);

    useEffect(() => {
        for (const key in outputs) {
            const graphOutput = cellParams.graphOutputs[key];
            setIsShowGraph((state) => {return {...state, [key]: graphOutput}});
        }
        for (const key in cellParams.outputs) {
            const output = cellParams.outputs[key];
            setNames((state) => {return {...state, [key]: output === null ? "" : output}});
        }
    }, [cellParams, outputs]);


    return (
        <div className="row-elements cell-inside-block">
            <h3 className="cell-inside-block-element">outputs</h3>
            <ul className="row-elements cell-inside-ul">
                {
                    outputNames.map((output) => {
                        return (
                            <li key={cellId + output} className="row-elements">
                                <div className="column-elements cell-inside-block" style={{justifyContent: "normal"}}>
                                    <div className="row-elements" style={{margin: 0, justifyContent: "center"}}>
                                        <h5 style={{margin: 0}}>show graph</h5>
                                        <input type="checkbox" style={{margin: 0, marginLeft: "2px"}}
                                               checked={isShowGraph[output]}
                                               id={output} onChange={updateShowGraphHandler}/>
                                    </div>
                                    <h3 className="cell-inside-block-element" style={{marginBottom: 0, marginTop: 0}}>{output}:</h3>
                                </div>
                                <input value={names[output]}
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
        </div>);
}

export default Outputs;
