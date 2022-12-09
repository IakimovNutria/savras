import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch, State} from '../types/state';
import {AxiosInstance} from 'axios';
import AuthorizationStatus from "../types/authorizationStatus";
import {setAuthorization, setFiles, setSharedPipelines, setUserPipelines} from "./actions";
import AuthorizationInfo from "../types/authorizationInfo";
import {store} from "./index";


export const fetchFileAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files',
    async (_arg, {dispatch, extra: api}) => {
        const {data} = await api.get('/files');
        dispatch(setFiles(data));
    },
);

export const fetchUserPipelinesAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/own',
    async (_arg, {dispatch, extra: api}) => {
        const {data} = await api.get('/pipelines/own');
        dispatch(setUserPipelines(data));
    },
);

export const fetchSharedPipelinesAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/shared',
    async (_arg, {dispatch, extra: api}) => {
        const {data} = await api.get('/pipelines/shared');
        dispatch(setSharedPipelines(data));
    },
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/user',
    async (_arg, {dispatch, extra: api}) => {
        try {
            await api.get("/user");
            dispatch(setAuthorization(AuthorizationStatus.AUTHORIZED));
        } catch {
            dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED));
        }
    },
);

export const signInAction = createAsyncThunk<void, AuthorizationInfo, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/user/authentication',
    async ({login, password}, {dispatch, extra: api}) => {
        const data = await api.post("/user/authentication", `username=${login}&password=${password}`);
        dispatch(setAuthorization(AuthorizationStatus.AUTHORIZED));
        store.dispatch(fetchFileAction());
        store.dispatch(fetchUserPipelinesAction());
        store.dispatch(fetchSharedPipelinesAction());
    },
);

export const signUpAction = createAsyncThunk<void, AuthorizationInfo, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/user/registration',
    async ({login, password}, {dispatch, extra: api}) => {
        const data = await api.post("/user/registration", `username=${login}&password=${password}`);
        console.log(data);
        dispatch(setAuthorization(AuthorizationStatus.AUTHORIZED));
        store.dispatch(fetchFileAction());
        store.dispatch(fetchUserPipelinesAction());
        store.dispatch(fetchSharedPipelinesAction());
    },
);
