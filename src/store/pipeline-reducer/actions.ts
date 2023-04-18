import {createAsyncThunk} from '@reduxjs/toolkit';
import TimeSeries from '../../types/time-series';
import {AppDispatch, State} from '../../types/state';
import {AxiosInstance} from 'axios';
import {ApiRoute} from '../../enums/api-route';
import CellInfo from '../../types/cell-info';
import PipelineInfo from '../../types/pipeline-info';

export const getFileTimeSeries = createAsyncThunk<
	{cellId: string, name: string, timeSeries: TimeSeries},
	{path: string, dataColumn: string, cellId: string, graphName: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES_TIME_SERIES,
	async ({
		path, dataColumn, cellId, graphName,
	}, { extra: api }) => {
		const { data } = await api.get<TimeSeries>(ApiRoute.FILES_TIME_SERIES, { params: { path, data_column: dataColumn } });
		return { cellId, name: graphName, timeSeries: data };
	},
);


export const fetchCellInfo = createAsyncThunk<CellInfo, {cellId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS,
	async ({ cellId }, { extra: api }) => {
		const { data } = await api.get(ApiRoute.CELLS, { params: { cell_id: cellId } });
		return data;
	},
);

export const fetchPipeline = createAsyncThunk<PipelineInfo, {pipelineId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES,
	async ({ pipelineId }, { extra: api }) => {
		const { data } = await api.get<PipelineInfo>(ApiRoute.PIPELINES, { params: { pipeline_id: pipelineId } });
		return data;
	},
);

export const createCell = createAsyncThunk<CellInfo, {pipelineId: string, functionName: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS_CREATE,
	async ({ pipelineId, functionName }, { extra: api }) => {
		const { data } = await api.post(ApiRoute.CELLS_CREATE, { pipeline_id: pipelineId, function: functionName });
		return data;
	},
);


export const addEdge = createAsyncThunk<void, {cellIdFrom: string, cellIdTo: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_EDGE,
	async ({ cellIdFrom, cellIdTo }, { extra: api }) => {
		await api.post(ApiRoute.PIPELINES_EDGE, { cell_id_from: cellIdFrom, cell_id_to: cellIdTo });
	},
);

export const deleteEdge = createAsyncThunk<void, {cellIdFrom: string, cellIdTo: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_EDGE,
	async ({ cellIdFrom, cellIdTo }, { extra: api }) => {
		await api.delete(ApiRoute.PIPELINES_EDGE, { params: { cell_id_from: cellIdFrom, cell_id_to: cellIdTo } });
	},
);


export const deleteCell = createAsyncThunk<{cellId: string, pipelineId: string}, {cellId: string, pipelineId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	'/cells/delete',
	async ({ cellId, pipelineId }, { extra: api }) => {
		await api.delete(ApiRoute.CELLS, { params: { cell_id: cellId } });
		return { cellId, pipelineId };
	},
);

export const moveCell = createAsyncThunk<{cellId: string, x: number, y: number}, {cellId: string, x: number, y: number}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS_MOVE,
	async ({ cellId, x, y }, { extra: api }) => {
		await api.post(ApiRoute.CELLS_MOVE, { cell_id: cellId, x, y });
		return { cellId, x, y };
	},
);

export const updateParams = createAsyncThunk<
	{cellId: string, params: {field: string, value: string | boolean | number}[]},
	{cellId: string, params: {field: string, value: string | boolean | number}[]}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS_UPDATE_PARAMS,
	async ({ cellId, params }, { extra: api }) => {
		await api.post(ApiRoute.CELLS_UPDATE_PARAMS, { cell_id: cellId, params });
		return { cellId, params };
	},
);

export const updateInputs = createAsyncThunk<
	{cellId: string, inputs: {field: string, path: string, data_column: string}[]},
	{cellId: string, inputs: {field: string, path: string, data_column: string}[]}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS_UPDATE_INPUTS,
	async ({ cellId, inputs }, { extra: api }) => {
		await api.post(ApiRoute.CELLS_UPDATE_INPUTS, { cell_id: cellId, inputs });
		return { cellId, inputs };
	},
);

export const executeCell = createAsyncThunk<{cellId: string}, {cellId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS_EXECUTE,
	async ({ cellId }, { extra: api }) => {
		await api.post(ApiRoute.CELLS_EXECUTE, { cell_id: cellId });
		return { cellId };
	},
);
