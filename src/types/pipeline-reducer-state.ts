import PipelineInfo from "./pipeline-info";
import TimeSeries from "./time-series";
import {CellStatus} from "../enums/cell-status";

type PipelineReducerState = {
    currentPipeline: PipelineInfo | null;
    graphs: {[cellId: string]: {[name: string]: TimeSeries}};
    isPipelineLoading: boolean;
    cellsStatus: {[cellId: string]: CellStatus | string};
}

export default PipelineReducerState;
