import {createAction} from '@reduxjs/toolkit';
import FileInfo from '../types/file-info';
import CellInfo from "../types/cell-info";
import PipelineInfo from "../types/pipeline-info";
import CellsFunction from "../types/cells-function";
import ShortPipelineInfo from "../types/short-pipeline-info";
import TimeSeries from "../types/time-series";

const Action = {
    SET_USER_PIPELINES: "SET_USER_PIPELINES",
    SET_FILES: "SET_FILES",
    SET_SHARED_PIPELINES: "SET_SHARED_PIPELINES",
    SET_AUTHORIZATION: "SET_AUTHORIZATION",
    SET_CELLS_FUNCTIONS: "SET_CELLS_FUNCTIONS",
    SET_CELLS_INFO: "SET_CELLS_INFO",
    SET_PIPELINE: "SET_PIPELINE",
    ADD_CELL: "ADD_CELL",
    ADD_GRAPH_DATA: "ADD_GRAPH_DATA"
};


export const setUserPipelines = createAction(Action.SET_USER_PIPELINES,
    (pipelines: ShortPipelineInfo[]) => {return {payload: pipelines};});
export const setFiles = createAction(Action.SET_FILES,
    (files: FileInfo[]) => {return {payload: files};});
export const setSharedPipelines = createAction(Action.SET_SHARED_PIPELINES,
    (pipelines: ShortPipelineInfo[]) => {return {payload: pipelines};});
export const setAuthorization = createAction(Action.SET_AUTHORIZATION,
    (authorizationStatus: string) => {return {payload: authorizationStatus};});
export const setCellInfo = createAction(Action.SET_CELLS_INFO,
    (cellsInfo: CellInfo) => {return {payload: cellsInfo};});
export const setCellsFunctions = createAction(Action.SET_CELLS_FUNCTIONS,
    (cellsFunctions: CellsFunction[]) => {return {payload: cellsFunctions};});
export const setPipeline = createAction(Action.SET_PIPELINE,
    (pipeline: PipelineInfo) => {return {payload: pipeline};});
export const addCell = createAction(Action.ADD_CELL,
    (cell: CellInfo) => {return {payload: cell};});
export const addGraphData = createAction(Action.ADD_GRAPH_DATA,
    (info: {cellId: string, name: string, timeSeries: TimeSeries}) => {return {payload: info};});
