import {createAction} from '@reduxjs/toolkit';
import FileInfo from '../types/fileInfo';
import CellInfo from "../types/cellInfo";
import PipelineInfo from "../types/pipelineInfo";
import CellsFunction from "../types/cellsFunction";
import ShortPipelineInfo from "../types/shortPipelineInfo";

const Action = {
    SET_USER_PIPELINES: "SET_USER_PIPELINES",
    SET_FILES: "SET_FILES",
    SET_SHARED_PIPELINES: "SET_SHARED_PIPELINES",
    SET_AUTHORIZATION: "SET_AUTHORIZATION",
    SET_CELLS_FUNCTIONS: "SET_CELLS_FUNCTIONS",
    SET_CELLS_INFO: "SET_CELLS_INFO",
    SET_PIPELINE: "SET_PIPELINE",
    ADD_CELL: "ADD_CELL"
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
