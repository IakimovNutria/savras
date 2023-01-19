import React, {useEffect, useState} from "react";
import Graph from "../../graph/graph";
import {getFileTimeSeries} from "../../../store/api-actions";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import TimeSeries from "../../../types/timeSeries";
import CellParams from "../cellTypes/cellParams";


type GraphsParams = {
    cellId: string;
    cellParams: CellParams;
};

function Graphs({cellId, cellParams}: GraphsParams): JSX.Element {
    const graphsInfo = useAppSelector((state) => state.graphs)[cellId];
    const dispatch = useAppDispatch();
    const defaultGraphsValue: {name: string, timeSeries: TimeSeries}[] = [];
    const [graphs, setGraphs] = useState(defaultGraphsValue);
    useEffect(() => {
        for (const key in cellParams.graphInputs) {
            const path = cellParams.inputsPath[key];
            const dataColumn = cellParams.selectedInputsColumn[key];
            if (cellParams.graphInputs[key] && cellParams.graphInputs[key] !== null && path !== null && dataColumn !== null) {
                dispatch(getFileTimeSeries({
                    path: path,
                    graphName: key,
                    cellId: cellId,
                    dataColumn: dataColumn
                }));
            }
        }
        for (const key in cellParams.graphOutputs) {
            const path = cellParams.inputsPath[key];
            const dataColumn = cellParams.selectedInputsColumn[key];
            if (cellParams.graphOutputs[key] && cellParams.graphOutputs[key] !== null && path !== null && dataColumn !== null) {
                dispatch(getFileTimeSeries({
                    path: path,
                    graphName: key,
                    cellId: cellId,
                    dataColumn: dataColumn
                }));
            }
        }
        const newGraphs = [];
        for (const key in graphsInfo) {
            console.log(graphsInfo[key], cellParams.graphInputs[key]);
            if (graphsInfo[key] && cellParams.graphInputs[key]) {
                newGraphs.push({name: key, timeSeries: graphsInfo[key]});
            }
        }
        setGraphs(newGraphs);
    }, [cellParams, graphsInfo]);


    return (graphs.length !== 0) ? (
        <ul className="block cell-inside-graphs row-elements cell-inside-ul">
            {
                graphs.map((graph) => {
                    return (
                        <li key={graph.name} className="column-elements">
                            <h5 className="cell-inside-block-element" style={{margin: 0}}>{graph.name}</h5>
                            <Graph name={graph.name} timeSeries={graph.timeSeries} width={400} height={150}/>
                        </li>);
                })
            }
        </ul>
    ) : <></>;
}

export default Graphs;
