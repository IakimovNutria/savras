import {createReducer} from '@reduxjs/toolkit';
import AuthorizationStatus from "../types/authorizationStatus";
import File from '../types/file';

import {
    setUserPipelines, setFiles,
    setAuthorization, setSharedPipelines
} from './actions';


type stateType = {
    authorization: string,
    filesList: File[],
    userPipelinesList: File[],
    sharedPipelinesList: File[]
}

const initialState: stateType = {
    authorization: AuthorizationStatus.NOT_AUTHORIZED,
    filesList: [],
    userPipelinesList: [],
    sharedPipelinesList: []
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
      });
});
