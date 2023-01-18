import React, {ChangeEvent, FormEvent, useContext, useEffect, useState} from "react";
import CellContext from "../cellContext";
import Graph from "../../graph/graph";
import {getFileTimeSeries} from "../../../store/api-actions";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import TimeSeries from "../../../types/timeSeries";


type GraphsParams = {
    cellId: string;
};

function Graphs({cellId}: GraphsParams): JSX.Element {
    const cellParams = useContext(CellContext);
    const graphsInfo = useAppSelector((state) => state.graphs)[cellId];
    /*useEffect(() => {
        cellParams.graphOutputs
            .forEach((outputName) => {
                const outputPath = cellParams.outputs[outputName];
                const dataColumn = "";
                if (outputPath !== null) {
                    getFileTimeSeries({path: outputPath, graphName: outputName, cellId: cellId, dataColumn: dataColumn})
                }
            })
    }, [cellParams.graphOutputs]);*/

    return (
        graphsInfo &&
            <ul className="block cell-inside-graphs row-elements cell-inside-ul">
                {
                    cellParams.graphInputs.map((inputName) => {
                        return graphsInfo[inputName] &&
                            (<li key={inputName} className="column-elements">
                                <h5 className="cell-inside-block-element" style={{margin: 0}}>{inputName}</h5>
                                <Graph name={inputName} timeSeries={graphsInfo[inputName]} width={400} height={150}/>
                            </li>);
                    })
                }
            </ul>
    );
}

export default Graphs;
