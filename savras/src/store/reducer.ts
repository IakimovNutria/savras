import {createReducer} from '@reduxjs/toolkit';
import AuthorizationStatus from "../types/authorization-status";
import FileInfo from '../types/file-info';


import {
    setUserPipelines, setFiles,
    setAuthorization, setSharedPipelines,
    setCellsFunctions, setPipeline, addCell, addGraphData
} from './actions';
import {
    fetchPipeline, getFileTimeSeries, deleteFile,
    saveFile, deleteCell, uploadFile,
    fetchFileColumns, executeCell,
    deletePipeline, fetchFilesAction,
    fetchCellsFunctionsInfo, createCell,
    createPipeline, addEdge, deleteEdge,
    forkPipeline, fetchSharedPipelinesAction,
    checkAuthAction, fetchUserPipelinesAction,
    fetchCellInfo, renameFile, renamePipeline,
    signInAction, signUpAction, updateInputs,
    updateParams
} from './api-actions';
import PipelineInfo from "../types/pipeline-info";
import CellsFunction from "../types/cells-function";
import ShortPipelineInfo from "../types/short-pipeline-info";
import TimeSeries from "../types/time-series";
import {CellStatus} from "../types/cell-status";
import getCellStatus from "../utils/get-cell-status";
import cell from "../components/cell/cell";
import cellInfo from "../types/cell-info";


type State = {
    authorization: string;
    filesList: FileInfo[];
    userPipelinesList: ShortPipelineInfo[];
    sharedPipelinesList: ShortPipelineInfo[];
    cellsFunctions: CellsFunction[];
    currentPipeline: PipelineInfo | null;
    graphs: {[cellId: string]: {[name: string]: TimeSeries}};
    isPipelineLoading: boolean;
    cellsStatus: {[cellId: string]: string};
    fileColumns: {[path: string]: string[]};
}

const initialState: State = {
    authorization: AuthorizationStatus.IN_PROCESS,
    filesList: [],
    userPipelinesList: [],
    sharedPipelinesList: [],
    cellsFunctions: [],
    currentPipeline: null,
    graphs: {},
    isPipelineLoading: false,
    cellsStatus: {},
    fileColumns: {}
};

export const reducer = createReducer(initialState, (builder) => {
  builder
      .addCase(fetchPipeline.pending, (state, action) => {
          state.isPipelineLoading = true;
      })
      .addCase(fetchPipeline.fulfilled, (state, action) => {
          state.isPipelineLoading = false;
          state.currentPipeline = action.payload;
          state.currentPipeline.cells.forEach((cell) => {
              state.cellsStatus = {...state.cellsStatus, [cell.id]: getCellStatus(cell, CellStatus.NOT_EXECUTED)};
          });
      })
      .addCase(updateParams.pending, (state, action) => {
          if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
              state.cellsStatus[action.meta.arg.cellId] = CellStatus.SAVING;
          }
      })
      .addCase(updateParams.fulfilled, (state, action) => {
          if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
              state.cellsStatus[action.payload.cellId] = CellStatus.SAVED;
          }
      })
      .addCase(updateParams.rejected, (state, action) => {
          if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
              const errorMessage = action.error.message;
              state.cellsStatus[action.meta.arg.cellId] = errorMessage === undefined ? CellStatus.NOT_SAVED : errorMessage;
          }
      })
      .addCase(updateInputs.pending, (state, action) => {
          if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
              state.cellsStatus[action.meta.arg.cellId] = CellStatus.SAVING;
          }
      })
      .addCase(updateInputs.fulfilled, (state, action) => {
          if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
              state.cellsStatus[action.payload.cellId] = CellStatus.SAVED;
          }
      })
      .addCase(updateInputs.rejected, (state, action) => {
          if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
              const errorMessage = action.error.message;
              state.cellsStatus[action.meta.arg.cellId] = errorMessage === undefined ? CellStatus.NOT_SAVED : errorMessage;
          }
      })
      .addCase(getFileTimeSeries.fulfilled, (state, action) => {
          state.graphs[action.payload.cellId] = {
              ...state.graphs[action.payload.cellId],
              [action.payload.name]: action.payload.timeSeries
          };
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
          state.filesList = state.filesList.filter((file) => file.path !== action.payload.path);
      })
      .addCase(saveFile.fulfilled, (state, action) => {
          state.filesList.push(action.payload);
      })
      .addCase(deleteCell.fulfilled, (state, action) => {
          if (state.currentPipeline) {
              state.currentPipeline.cells = state.currentPipeline.cells
                  .filter((cell) =>
                      cell.id !== action.payload.cellId);
          }
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
          state.filesList.push(action.payload);
      })
      .addCase(fetchFileColumns.fulfilled, (state, action) => {
          state.fileColumns = {...state.fileColumns, [action.payload.path]: action.payload.columns};
      })
      .addCase(executeCell.fulfilled, (state, action) => {
          state.cellsStatus = {...state.cellsStatus, [action.payload.cellId]: CellStatus.IN_PROCESS};
      })
      .addCase(executeCell.rejected, (state, action) => {
          const error = action.error.message;
          state.cellsStatus = {
              ...state.cellsStatus,
              [action.meta.arg.cellId]: error === undefined ? CellStatus.HAS_ERROR : error
          };
      })
      .addCase(deletePipeline.fulfilled, (state, action) => {
          state.userPipelinesList = state.userPipelinesList
              .filter((pipeline) => pipeline.id !== action.payload.pipelineId);
      })
      .addCase(fetchCellInfo.fulfilled, (state, action) => {
          if (state.currentPipeline) {
              state.currentPipeline.cells = state.currentPipeline.cells
                  .map((cell) => cell.id === action.payload.id ? action.payload : cell);
          }
          if (state.cellsStatus[action.payload.id] === CellStatus.IN_PROCESS) {
              state.cellsStatus = {
                  ...state.cellsStatus,
                  [action.payload.id]: getCellStatus(action.payload, CellStatus.IN_PROCESS)
              };
          }
      })
      .addCase(fetchFilesAction.fulfilled, (state, action) => {
          state.filesList = action.payload;
      })
      .addCase(fetchCellsFunctionsInfo.fulfilled, (state, action) => {
          state.cellsFunctions = action.payload;
      })
      .addCase(createCell.fulfilled, (state, action) => {
          if (state.currentPipeline) {
              state.currentPipeline.cells.push(action.payload);
          }
      })
      .addCase(createPipeline.fulfilled, (state, action) => {
          state.userPipelinesList.push(action.payload);
      })
      .addCase(fetchSharedPipelinesAction.fulfilled, (state, action) => {
          state.sharedPipelinesList = action.payload;
      })
      .addCase(checkAuthAction.fulfilled, (state) => {
          state.authorization = AuthorizationStatus.AUTHORIZED;
      })
      .addCase(checkAuthAction.rejected, (state) => {
          state.authorization = AuthorizationStatus.NOT_AUTHORIZED;
      })
      .addCase(checkAuthAction.pending, (state) => {
          state.authorization = AuthorizationStatus.IN_PROCESS;
      })
      .addCase(fetchUserPipelinesAction.fulfilled, (state, action) => {
          state.userPipelinesList = action.payload;
      })
      .addCase(signInAction.fulfilled, (state) => {
          state.authorization = AuthorizationStatus.AUTHORIZED;
      })
      .addCase(signInAction.pending, (state) => {
          state.authorization = AuthorizationStatus.IN_PROCESS;
      })
      .addCase(signInAction.rejected, (state) => {
          state.authorization = AuthorizationStatus.BAD_AUTHENTICATE;
      })
      .addCase(signUpAction.fulfilled, (state) => {
          state.authorization = AuthorizationStatus.AUTHORIZED;
      })
      .addCase(signUpAction.rejected, (state) => {
          state.authorization = AuthorizationStatus.BAD_REGISTER;
      })
      .addCase(signUpAction.pending, (state) => {
          state.authorization = AuthorizationStatus.IN_PROCESS;
      })
      .addCase(setAuthorization, (state, action) => {
          state.authorization = action.payload;
          if (state.authorization !== AuthorizationStatus.AUTHORIZED) {
              state.filesList = [];
              state.sharedPipelinesList = [];
              state.userPipelinesList = [];
          }
      })
      .addCase(setUserPipelines, (state, action) => {
          state.userPipelinesList = action.payload;
      })
      .addCase(setFiles, (state, action) => {
          state.filesList = action.payload;
      })
      .addCase(setSharedPipelines, (state, action) => {
          state.sharedPipelinesList = action.payload;
      })
      .addCase(setCellsFunctions, (state, action) => {
          state.cellsFunctions = action.payload;
      })
      .addCase(setPipeline, (state, action) => {
          state.currentPipeline = action.payload;
      })
      .addCase(addCell, (state, action) => {
          if (state.currentPipeline !== null) {
              state.currentPipeline.cells.push(action.payload);
          }
      })
      .addCase(addGraphData, (state, action) => {
          state.graphs = {...state.graphs,
              [action.payload.cellId]: {...state.graphs[action.payload.cellId],
                  [action.payload.name]: action.payload.timeSeries}};
      });
});
