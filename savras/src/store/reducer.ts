import {createReducer} from '@reduxjs/toolkit';
import AuthorizationStatus from "../types/authorizationStatus";
import authenticateUser from "./requests/authenticate";
import createPipeline from "./requests/create-pipeline";
import deletePipeline from "./requests/delete-pipeline";
import getFiles from "./requests/get-files";
import getSharedPipelines from "./requests/get-shared-pipelines";
import getUser from "./requests/get-user";
import getUserPipelines from "./requests/get-user-pipelines";
import registerUser from "./requests/register";
import uploadFile from "./requests/upload-file";


import {
    signOut,
    signIn,
    addPipeline,
    deletePipelineAction,
    signUp,
    checkAuthorization
} from './actions';


type stateType = {
    authorization: string,
    filesList: [],
    userPipelinesList: [],
    sharedPipelinesList: []
}

const initialState: stateType = {
    authorization: AuthorizationStatus.NOT_AUTHORIZED,
    filesList: [],
    userPipelinesList: [],
    sharedPipelinesList: []
};

function setReceivedUserPipelines(state: stateType) {
    getUserPipelines()
        .then((response) => {
            if (response === null) {
              return [];
            }
            return response.json();
        })
        .then((j) => state.userPipelinesList = (j.map((elem: any) => {return {name: elem['name'], id: elem['id']};})));
}

function setReceivedFiles(state: stateType) {
    getFiles()
        .then((response) => {
            if (response === null) {
              return [];
            }
            return response.json();
        })
        .then((j) => state.filesList = (j.map((elem: any) => {return {name: elem['name'], id: elem['id']};})));
}

function setReceivedSharedPipelines(state: stateType) {
  getSharedPipelines()
      .then((response) => {
        if (response === null) {
          return [];
        }
        return response.json();
      })
      .then((j) => state.sharedPipelinesList = (j.map((elem: any) => {return {name: elem['name'], id: elem['id']};})));
}

function authorize(response: Response | null, state: stateType) {
    state.authorization = AuthorizationStatus.IN_PROCESS;
    if (response === null) {
        state.authorization = AuthorizationStatus.SERVER_PROBLEM;
    } else if (response.ok) {
        state.authorization = AuthorizationStatus.AUTHORIZED;
        setReceivedFiles(state);
        setReceivedUserPipelines(state);
        setReceivedSharedPipelines(state);
    } else {
        state.authorization = AuthorizationStatus.BAD_AUTHORIZE;
    }
}


export const reducer = createReducer(initialState, (builder) => {
  builder
      .addCase(checkAuthorization, (state) => {
          state.authorization = AuthorizationStatus.IN_PROCESS;
          getUser().then((response) => {
              if (response === null) {
                  state.authorization = AuthorizationStatus.SERVER_PROBLEM;
              } else if (response.ok) {
                  state.authorization = AuthorizationStatus.AUTHORIZED;
              } else {
                  state.authorization = AuthorizationStatus.BAD_AUTHORIZE;
              }
          });
      })
      .addCase(signUp, (state, action) => {
          registerUser(action.payload).then((response) => {
              authorize(response, state);
          });
      })
      .addCase(signIn, (state, action) => {
        authenticateUser(action.payload).then((response) => {
          authorize(response, state);
        });
      })
      .addCase(signOut, (state) => {
          state.authorization = AuthorizationStatus.NOT_AUTHORIZED;
          state.filesList = [];
          state.sharedPipelinesList = [];
          state.userPipelinesList = [];
      })
      .addCase(addPipeline, (state, action) => {
        createPipeline(action.payload).then((response) => {
          if (response === null) {

          } else if (response.ok) {
            setReceivedUserPipelines(state);
          }
        });
      })
      .addCase(deletePipelineAction, (state, action) => {
          deletePipeline(action.payload).then((response) => {
             if (response === null) {

             } else if (response.ok) {
                 setReceivedUserPipelines(state);
             }
          });
      });
});
