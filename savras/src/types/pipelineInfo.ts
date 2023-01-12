import CellInfo from "./cellInfo";
import TimeSeries from "./timeSeries";

type PipelineInfo = {
    id: string;
    name: string;
    cells: CellInfo[];
    edges: [];
};

export default PipelineInfo;
