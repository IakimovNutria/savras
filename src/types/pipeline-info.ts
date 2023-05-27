import CellInfo from './cell-info';

type PipelineInfo = {
    id: string;
    name: string;
    cells: CellInfo[];
    edges: string[][];
};

export default PipelineInfo;
