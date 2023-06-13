import {createAsyncThunk} from '@reduxjs/toolkit';
import FileInfo from '../../types/file-info';
import {AppDispatch, State} from '../../types/state';
import {AxiosInstance} from 'axios';
import {ApiRoute} from '../../enums/api-route';
import ShortPipelineInfo from '../../types/short-pipeline-info';
import CellsFunction from '../../types/cells-function';

export const fetchFilesAction = createAsyncThunk<FileInfo[], undefined, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES,
	async (_arg, { extra: api }) => {
		const { data } = await api.get<FileInfo[]>(ApiRoute.FILES);
		return data;
	},
);

export const fetchFileColumns = createAsyncThunk<{columns: string[], path: string}, {path: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES_COLUMNS,
	async ({ path }, { extra: api }) => {
		const { data } = await api.get<string[]>(ApiRoute.FILES_COLUMNS, { params: { path } });
		return { columns: data, path };
	}
);

export const fetchUserPipelinesAction = createAsyncThunk<ShortPipelineInfo[], undefined, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_OWN,
	async (_arg, { extra: api }) => {
		const { data } = await api.get<ShortPipelineInfo[]>(ApiRoute.PIPELINES_OWN);
		return data;
	},
);

export const fetchSharedPipelinesAction = createAsyncThunk<ShortPipelineInfo[], undefined, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_SHARED,
	async (_arg, { extra: api }) => {
		const { data } = await api.get<ShortPipelineInfo[]>(ApiRoute.PIPELINES_SHARED);
		return data;
	},
);


export const fetchCellsFunctionsInfo = createAsyncThunk<CellsFunction[], undefined, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS_FUNCTIONS,
	async (_arg, { extra: api }) => {
		const { data } = await api.get(ApiRoute.CELLS_FUNCTIONS);
		return data;
	},
);

export const uploadFile = createAsyncThunk<FileInfo, {formData: FormData}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES_UPLOAD,
	async ({ formData }, { extra: api }) => {
		const { data } = await api.post<FileInfo>(ApiRoute.FILES_UPLOAD, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
		return data;
	},
);


export const renameFile = createAsyncThunk<{path: string, newName: string}, {path: string, newName: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES_RENAME,
	async ({ path, newName }, { extra: api }) => {
		await api.post(ApiRoute.FILES_RENAME, { new_name: newName, path });
		return { path, newName };
	},
);

export const createPipeline = createAsyncThunk<ShortPipelineInfo, {name: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_CREATE,
	async ({ name }, { extra: api }) => {
		const { data } = await api.post<ShortPipelineInfo>(ApiRoute.PIPELINES_CREATE, { name });
		return data;
	},
);

export const deletePipeline = createAsyncThunk<{pipelineId: string}, {pipelineId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	'/pipelines-section/delete',
	async ({ pipelineId }, { extra: api }) => {
		await api.delete(ApiRoute.PIPELINES, { params: { pipeline_id: pipelineId } });
		return { pipelineId };
	},
);

export const sharePipeline = createAsyncThunk<void, {username: string, pipelineId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_SHARE,
	async ({ username, pipelineId }, { extra: api }) => {
		await api.post(ApiRoute.PIPELINES_SHARE, { added_user: username, pipeline_id: pipelineId });
	},
);

export const renamePipeline = createAsyncThunk<{pipelineId: string, newName: string}, {newName: string, pipelineId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_RENAME,
	async ({ newName, pipelineId }, { extra: api }) => {
		await api.post(ApiRoute.PIPELINES_RENAME, { new_name: newName, pipeline_id: pipelineId });
		return { pipelineId, newName };
	},
);

export const forkPipeline = createAsyncThunk<ShortPipelineInfo, {pipelineId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_FORK,
	async ({ pipelineId }, { extra: api }) => {
		const { data } = await api.post<ShortPipelineInfo>(ApiRoute.PIPELINES_FORK, { pipeline_id: pipelineId });
		return data;
	},
);

export const saveFile = createAsyncThunk<FileInfo, {path: string, name: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES_SAVE,
	async ({ path, name }, { extra: api }) => {
		await api.post(ApiRoute.FILES_SAVE, { path, name });
		return { path, name };
	},
);

export const deleteFile = createAsyncThunk<{path: string}, {path: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES_DELETE,
	async ({ path }, { extra: api }) => {
		await api.delete(ApiRoute.FILES_DELETE, { params: { path } });
		return { path };
	},
);

export const fetchFileName = createAsyncThunk<{path: string, name: string}, {path: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES_FILENAME,
	async ({ path }, { extra: api }) => {
		const {data} = await api.get<string>(ApiRoute.FILES_FILENAME, { params: { path } });
		return { path, name: data };
	},
);