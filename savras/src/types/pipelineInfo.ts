import CellInfo from "./cellInfo";

type PipelineInfo = {
    id: string,
    name: string,
    cells: CellInfo[],
    edges: []
};

export default PipelineInfo;
