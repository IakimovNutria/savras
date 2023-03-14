import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch, State} from '../types/state';
import {AxiosInstance} from 'axios';
import AuthorizationInfo from "../types/authorization-info";
import FileInfo from "../types/file-info";
import {saveAs} from "file-saver";
import TimeSeries from "../types/time-series";
import PipelineInfo from "../types/pipeline-info";
import ShortPipelineInfo from "../types/short-pipeline-info";
import CellInfo from "../types/cell-info";
import CellsFunction from "../types/cells-function";

export const fetchFilesAction = createAsyncThunk<FileInfo[], undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<FileInfo[]>('/files');
        return data;
    }
);

export const fetchFileColumns = createAsyncThunk<{columns: string[], path: string}, {path: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>('/files/columns',async ({path}, {extra: api}) => {
        const {data} = await api.get<string[]>('/files/columns', {params: {path: path}});
        return {columns: data, path: path};
    }
);

export const fetchUserPipelinesAction = createAsyncThunk<ShortPipelineInfo[], undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/own',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<ShortPipelineInfo[]>('/pipelines/own');
        return data;
    },
);

export const fetchSharedPipelinesAction = createAsyncThunk<ShortPipelineInfo[], undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/shared',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<ShortPipelineInfo[]>('/pipelines/shared');
        return data;
    },
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/user',
    async (_arg, {extra: api}) => {
        await api.get("/user");
    },
);

export const signInAction = createAsyncThunk<void, AuthorizationInfo, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/user/authentication',
    async ({login, password}, {extra: api}) => {
        await api.post("/user/authentication", `username=${login}&password=${password}`);
    },
);

export const signUpAction = createAsyncThunk<void, AuthorizationInfo, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/user/registration',
    async ({login, password}, {extra: api}) => {
        await api.post("/user/registration", {username: login, password: password});
    },
);

export const fetchCellInfo = createAsyncThunk<CellInfo, {cellId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells',
    async ({cellId}, {extra: api}) => {
        const {data} = await api.get("/cells", {params: {cell_id: cellId}});
        return data;
    },
);

export const fetchCellsFunctionsInfo = createAsyncThunk<CellsFunction[], undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/functions',
    async (_arg, {extra: api}) => {
        const {data} = await api.get("/cells/functions");
        return data;
    },
);

export const fetchPipeline = createAsyncThunk<PipelineInfo, {pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines',
    async ({pipelineId}, {extra: api}) => {
        const {data} = await api.get<PipelineInfo>("/pipelines", {params: {pipeline_id: pipelineId}});
        return data;
    },
);

export const createCell = createAsyncThunk<CellInfo, {pipelineId: string, functionName: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/create',
    async ({pipelineId, functionName}, {extra: api}) => {
        const {data} = await api.post("/cells/create", {pipeline_id: pipelineId, function: functionName});
        return data;
    },
);

export const uploadFile = createAsyncThunk<FileInfo, {formData: FormData}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/upload',
    async ({formData}, {extra: api}) => {
        const {data} = await api.post<FileInfo>('/files/upload', formData, {headers: {"Content-Type": "multipart/form-data"}});
        return data;
    },
);

export const downloadFile = createAsyncThunk<void, {path: string, name: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/download',
    async ({path, name}, {extra: api}) => {
        api.get('/files/download', {params: {path: path}, responseType: "blob"})
            .then((r) => saveAs(r.data, name));
    },
);

export const deleteFile = createAsyncThunk<{path: string}, {path: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/delete',
    async ({path}, {dispatch, extra: api}) => {
        await api.delete('/files/delete', {params: {path: path}});
        return {path: path};
    },
);

export const getFileTimeSeries = createAsyncThunk<
    {cellId: string, name: string, timeSeries: TimeSeries},
    {path: string, dataColumn: string, cellId: string, graphName: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/time_series',
    async ({path, dataColumn, cellId, graphName}, {extra: api}) => {
        const {data} = await api.get<TimeSeries>('/files/time_series', {params: {path: path, data_column: dataColumn}});
        return {cellId: cellId, name: graphName, timeSeries: data};
    },
);

export const renameFile = createAsyncThunk<{path: string, newName: string}, {path: string, newName: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/rename',
    async ({path, newName}, {dispatch, extra: api}) => {
        await api.post('/files/rename', {new_name: newName, path: path});
        return {path: path, newName: newName};
    },
);

export const createPipeline = createAsyncThunk<ShortPipelineInfo, {name: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    'pipelines/create',
    async ({name}, {extra: api}) => {
        const {data} = await api.post<ShortPipelineInfo>('pipelines/create', {name: name});
        return data;
    },
);

export const deletePipeline = createAsyncThunk<{pipelineId: string}, {pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/delete',
    async ({pipelineId}, {extra: api}) => {
        await api.delete('/pipelines', {params: {pipeline_id: pipelineId}});
        return {pipelineId: pipelineId};
    },
);

export const sharePipeline = createAsyncThunk<void, {username: string, pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/share',
    async ({username, pipelineId}, {dispatch, extra: api}) => {
        await api.post('/pipelines/share', {added_user: username, pipeline_id: pipelineId});
    },
);

export const renamePipeline = createAsyncThunk<{pipelineId: string, newName: string}, {newName: string, pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/rename',
    async ({newName, pipelineId}, {dispatch, extra: api}) => {
        await api.post('/pipelines/rename', {new_name: newName, pipeline_id: pipelineId});
        return {pipelineId: pipelineId, newName: newName};
    },
);

export const addEdge = createAsyncThunk<void, {cellIdFrom: string, cellIdTo: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/edge',
    async ({cellIdFrom, cellIdTo}, {dispatch, extra: api}) => {
        const data = await api.post('/pipelines/edge', {cell_id_from: cellIdFrom, cell_id_to: cellIdTo});
    },
);

export const deleteEdge = createAsyncThunk<void, {cellIdFrom: string, cellIdTo: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/edge',
    async ({cellIdFrom, cellIdTo}, {dispatch, extra: api}) => {
        const data = await api.delete('/pipelines/edge', {params: {cell_id_from: cellIdFrom, cell_id_to: cellIdTo}});
    },
);

export const forkPipeline = createAsyncThunk<ShortPipelineInfo, {pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/fork',
    async ({pipelineId}, {extra: api}) => {
        const {data} = await api.post<ShortPipelineInfo>('/pipelines/fork', {pipeline_id: pipelineId});
        return data;
    },
);

export const deleteCell = createAsyncThunk<{cellId: string, pipelineId: string}, {cellId: string, pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/delete',
    async ({cellId, pipelineId}, {extra: api}) => {
        await api.delete('/cells', {params: {cell_id: cellId}});
        return {cellId: cellId, pipelineId: pipelineId};
    },
);

export const moveCell = createAsyncThunk<{cellId: string, x: number, y: number}, {cellId: string, x: number, y: number}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/move',
    async ({cellId, x, y}, {extra: api}) => {
        await api.post('/cells/move', {cell_id: cellId, x: x, y: y});
        return {cellId: cellId, x: x, y: y};
    },
);

export const updateParams = createAsyncThunk<
    {cellId: string, params: {field: string, value: string | boolean | number}[]},
    {cellId: string, params: {field: string, value: string | boolean | number}[]}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/update/params',
    async ({cellId, params}, {extra: api}) => {
        await api.post('/cells/update/params', {cell_id: cellId, params: params});
        return {cellId: cellId, params: params};
    },
);

export const updateInputs = createAsyncThunk<
    {cellId: string, inputs: {field: string, path: string, data_column: string}[]},
    {cellId: string, inputs: {field: string, path: string, data_column: string}[]}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/update/inputs',
    async ({cellId, inputs}, {extra: api}) => {
        await api.post('/cells/update/inputs', {cell_id: cellId, inputs: inputs});
        return {cellId: cellId, inputs: inputs};
    },
);

export const executeCell = createAsyncThunk<{cellId: string}, {cellId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/execute',
    async ({cellId}, {extra: api}) => {
        await api.post('/cells/execute', {cell_id: cellId});
        return {cellId: cellId};
    },
);

export const saveFile = createAsyncThunk<{path: string, name: string}, {path: string, name: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/save',
    async ({path, name}, {dispatch, extra: api}) => {
        await api.post('/files/save', {path: path, name: name});
        return {path: path, name: name};
    },
);
