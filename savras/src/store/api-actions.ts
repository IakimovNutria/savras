import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch, State} from '../types/state';
import {AxiosInstance} from 'axios';
import AuthorizationStatus from "../types/authorizationStatus";
import {
    setAuthorization,
    setCellsFunctions,
    setCellInfo,
    setFiles, setPipeline,
    setSharedPipelines,
    setUserPipelines
} from "./actions";
import AuthorizationInfo from "../types/authorizationInfo";
import FileInfo from "../types/fileInfo";
import {saveAs} from "file-saver";

export const fetchFilesAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files',
    async (_arg, {dispatch, extra: api}) => {
        async function fetchFileColumn(path: string) {
            const {data} = await api.get('/files/columns', {params: {path: path}});
            return data;
        }
        const {data} = await api.get('/files');
        let files: FileInfo[] = [];
        for (const key in data) {
            files.push({...data[key], columns: await fetchFileColumn(data[key].path)});
        }
        dispatch(setFiles(files));
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
        dispatch(fetchFilesAction());
        dispatch(fetchUserPipelinesAction());
        dispatch(fetchSharedPipelinesAction());
    },
);

export const signUpAction = createAsyncThunk<void, AuthorizationInfo, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/user/registration',
    async ({login, password}, {dispatch, extra: api}) => {
        const data = await api.post("/user/registration", {username: login, password: password});
        dispatch(setAuthorization(AuthorizationStatus.AUTHORIZED));
        dispatch(fetchFilesAction());
        dispatch(fetchUserPipelinesAction());
        dispatch(fetchSharedPipelinesAction());
    },
);

export const fetchCellInfo = createAsyncThunk<void, {cellId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells',
    async ({cellId}, {dispatch, extra: api}) => {
        const {data} = await api.get("/cells", {params: {cell_id: cellId}});
        dispatch(setCellInfo(data));
    },
);

export const fetchCellsFunctionsInfo = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/functions',
    async (_arg, {dispatch, extra: api}) => {
        const {data} = await api.get("/cells/functions");
        dispatch(setCellsFunctions(data));
    },
);

export const fetchPipeline = createAsyncThunk<void, {pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines',
    async ({pipelineId}, {dispatch, extra: api}) => {
        const {data} = await api.get("/pipelines", {params: {pipeline_id: pipelineId}});
        dispatch(setPipeline(data));
    },
);

export const createCell = createAsyncThunk<void, {pipelineId: string, functionName: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/create',
    async ({pipelineId, functionName}, {dispatch, extra: api}) => {
        const data = await api.post("/cells/create", {pipeline_id: pipelineId, function: functionName});
        dispatch(fetchPipeline({pipelineId: pipelineId}));
    },
);

export const uploadFile = createAsyncThunk<void, {formData: FormData}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/upload',
    async ({formData}, {dispatch, extra: api}) => {
        const data = await api.post('/files/upload', formData,
            {headers: {"Content-Type": "multipart/form-data"}});
        dispatch(fetchFilesAction());
    },
);

export const downloadFile = createAsyncThunk<void, {path: string, name: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/download',
    async ({path, name}, {dispatch, extra: api}) => {
        api.get('/files/download', {params: {path: path}, responseType: "blob"})
            .then((r) => saveAs(r.data, name));

    },
);

export const deleteFile = createAsyncThunk<void, {path: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/delete',
    async ({path}, {dispatch, extra: api}) => {
        const data = await api.delete('/files/delete', {params: {path: path}});
        dispatch(fetchFilesAction());
    },
);

export const getFileTimeSeries = createAsyncThunk<void, {path: string, dataColumn: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/time_series',
    async ({path, dataColumn}, {dispatch, extra: api}) => {
        const data = await api.get('/files/time_series', {params: {path: path, data_column: dataColumn}});
    },
);

export const getFileColumns = createAsyncThunk<void, {path: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/columns',
    async ({path}, {dispatch, extra: api}) => {
        const data = await api.get('/files/columns', {params: {path: path}});
    },
);

export const renameFile = createAsyncThunk<void, {path: string, newName: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/rename',
    async ({path, newName}, {dispatch, extra: api}) => {
        const data = await api.post('/files/rename', {new_name: newName, path: path});
        dispatch(fetchFilesAction());
    },
);

export const createPipeline = createAsyncThunk<void, {name: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    'pipelines/create',
    async ({name}, {dispatch, extra: api}) => {
        const data = await api.post('pipelines/create', {name: name});
        dispatch(fetchUserPipelinesAction());
    },
);

export const deletePipeline = createAsyncThunk<void, {pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines',
    async ({pipelineId}, {dispatch, extra: api}) => {
        const data = await api.delete('/pipelines', {params: {pipeline_id: pipelineId}});
        dispatch(fetchUserPipelinesAction());
    },
);

export const sharePipeline = createAsyncThunk<void, {username: string, pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/share',
    async ({username, pipelineId}, {dispatch, extra: api}) => {
        const data = await api.post('/pipelines/share', {added_user: username, pipeline_id: pipelineId});
    },
);

export const renamePipeline = createAsyncThunk<void, {newName: string, pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/rename',
    async ({newName, pipelineId}, {dispatch, extra: api}) => {
        const data = await api.post('/pipelines/rename', {new_name: newName, pipeline_id: pipelineId});
        dispatch(fetchUserPipelinesAction());
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
        dispatch(fetchUserPipelinesAction());
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
        dispatch(fetchUserPipelinesAction());
    },
);

export const forkPipeline = createAsyncThunk<void, {pipelineId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/pipelines/fork',
    async ({pipelineId}, {dispatch, extra: api}) => {
        const data = await api.post('/pipelines/fork', {pipeline_id: pipelineId});
        dispatch(fetchUserPipelinesAction());
    },
);

export const deleteCell = createAsyncThunk<void, {cellId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells',
    async ({cellId}, {dispatch, extra: api}) => {
        const data = await api.delete('/cells', {params: {cell_id: cellId}});
        dispatch(fetchUserPipelinesAction());
    },
);

export const moveCell = createAsyncThunk<void, {cellId: string, x: number, y: number}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/move',
    async ({cellId, x, y}, {dispatch, extra: api}) => {
        const data = await api.post('/cells/move', {cell_id: cellId, x: x, y: y});
        dispatch(fetchUserPipelinesAction());
    },
);

export const updateParam = createAsyncThunk<void, {cellId: string, field: string, value: string | boolean | number}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/update/param',
    async ({cellId, field, value}, {dispatch, extra: api}) => {
        const data = await api.post('/cells/update/param', {cell_id: cellId, field: field, value: value});
        await new Promise(f => setTimeout(f, 200));
    },
);

export const updateInput = createAsyncThunk<void, {cellId: string, field: string, path: string, data_column: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/update/input',
    async ({cellId, field, path, data_column}, {dispatch, extra: api}) => {
        const data = await api.post('/cells/update/input',
            {cell_id: cellId, field: field, path: path, data_column: data_column});
        dispatch(fetchUserPipelinesAction());
        await new Promise(f => setTimeout(f, 200));
    },
);

export const executeCell = createAsyncThunk<void, {cellId: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/cells/execute',
    async ({cellId}, {dispatch, extra: api}) => {
        const data = await api.post('/cells/execute', {cell_id: cellId});
    },
);

export const saveFile = createAsyncThunk<void, {path: string, name: string}, {
    dispatch: AppDispatch,
    state: State,
    extra: AxiosInstance
}>(
    '/files/save',
    async ({path, name}, {dispatch, extra: api}) => {
        const data = await api.post('/files/save', {path: path, name: name});
        dispatch(fetchFilesAction());
    },
);

