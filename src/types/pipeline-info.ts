import CellInfo from './cell-info';
import Edge from './edge';

type PipelineInfo = {
    id: string;
    name: string;
    cells: CellInfo[];
    edges: Edge[];
};

export default PipelineInfo;
