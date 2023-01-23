import CellInfo from "./cell-info";
import TimeSeries from "./time-series";

type PipelineInfo = {
    id: string;
    name: string;
    cells: CellInfo[];
    edges: [];
};

export default PipelineInfo;
