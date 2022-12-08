import {createAction} from '@reduxjs/toolkit';
import authorizationInfoType from '../types/authorizationInfoType';
import authorizationStatus from "../types/authorizationStatus";

const Action = {
    CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
    SIGN_IN: 'SIGN_IN',
    SIGN_UP: 'SIGN_UP',
    SIGN_OUT: 'SIGN_OUT',
    CREATE_PIPELINE: 'CREATE_PIPELINE',
    DELETE_PIPELINE: 'DELETE_PIPELINE'
};

export const checkAuthorization = createAction(Action.CHECK_AUTHORIZATION);
export const signUp = createAction(Action.SIGN_UP,
    (authorizationInfo: authorizationInfoType) => {return {payload: authorizationInfo};});
export const signIn = createAction(Action.SIGN_IN,
    (authorizationInfo: authorizationInfoType) => {return {payload: authorizationInfo};});
export const signOut = createAction(Action.SIGN_OUT);
export const addPipeline = createAction(Action.CREATE_PIPELINE,
    (pipelineName: string) => {return {payload: pipelineName};});
export const deletePipelineAction = createAction(Action.DELETE_PIPELINE,
    (id: string) => {return {payload: id};});
