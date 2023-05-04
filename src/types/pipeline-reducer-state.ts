import PipelineInfo from './pipeline-info';
import TimeSeries from './time-series';
import { CellStatus } from '../enums/cell-status';

type PipelineReducerState = {
    currentPipeline: PipelineInfo | null;
    graphs: Record<string, Record<string, TimeSeries>>;
    isPipelineLoading: boolean;
    cellsStatus: Record<string, CellStatus | string>;
}

export default PipelineReducerState;
