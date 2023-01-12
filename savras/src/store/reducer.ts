import {createReducer} from '@reduxjs/toolkit';
import AuthorizationStatus from "../types/authorizationStatus";
import FileInfo from '../types/fileInfo';

import {
    setUserPipelines, setFiles,
    setAuthorization, setSharedPipelines,
    setCellsFunctions, setPipeline, addCell, addGraphData
} from './actions';
import PipelineInfo from "../types/pipelineInfo";
import CellsFunction from "../types/cellsFunction";
import ShortPipelineInfo from "../types/shortPipelineInfo";
import TimeSeries from "../types/timeSeries";


type stateType = {
    authorization: string;
    filesList: FileInfo[];
    userPipelinesList: ShortPipelineInfo[];
    sharedPipelinesList: ShortPipelineInfo[];
    cellsFunctions: CellsFunction[];
    currentPipeline: PipelineInfo | null;
    graphs: {[cellId: string]: {[name: string]: TimeSeries}};
}

const initialState: stateType = {
    authorization: AuthorizationStatus.IN_PROCESS,
    filesList: [],
    userPipelinesList: [],
    sharedPipelinesList: [],
    cellsFunctions: [],
    currentPipeline: null,
    graphs: {}
};

export const reducer = createReducer(initialState, (builder) => {
  builder
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
