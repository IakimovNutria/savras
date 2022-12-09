import {createAction} from '@reduxjs/toolkit';
import File from '../types/file';

const Action = {
    SET_USER_PIPELINES: "SET_USER_PIPELINES",
    SET_FILES: "SET_FILES",
    SET_SHARED_PIPELINES: "SET_SHARED_PIPELINES",
    SET_AUTHORIZATION: "SET_AUTHORIZATION"
};


export const setUserPipelines = createAction(Action.SET_USER_PIPELINES,
    (pipelines: File[]) => {return {payload: pipelines};});
export const setFiles = createAction(Action.SET_FILES,
    (files: File[]) => {return {payload: files};});
export const setSharedPipelines = createAction(Action.SET_SHARED_PIPELINES,
    (pipelines: File[]) => {return {payload: pipelines};});
export const setAuthorization = createAction(Action.SET_AUTHORIZATION,
    (authorizationStatus: string) => {return {payload: authorizationStatus};});

