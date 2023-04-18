import { State } from '../../types/state';
import { ReducerName } from '../../enums/reducer-name';
import { CellStatus } from '../../enums/cell-status';
import PipelineInfo from '../../types/pipeline-info';
import TimeSeries from '../../types/time-series';

export const getCellsStatus = (state: State): {[cellId: string]: CellStatus | string} => state[ReducerName.PIPELINE].cellsStatus;
export const getCurrentPipeline = (state: State): PipelineInfo | null => state[ReducerName.PIPELINE].currentPipeline;
export const getGraphs = (state: State): {[cellId: string]: {[name: string]: TimeSeries}} => state[ReducerName.PIPELINE].graphs;
export const getIsPipelineLoading = (state: State): boolean => state[ReducerName.PIPELINE].isPipelineLoading;
