import {createAsyncThunk} from '@reduxjs/toolkit';
import TimeSeries from '../../types/time-series';
import {AppDispatch, State} from '../../types/state';
import {AxiosInstance} from 'axios';
import {ApiRoute} from '../../enums/api-route';
import CellInfo from '../../types/cell-info';
import PipelineInfo from '../../types/pipeline-info';
import {CellStatus} from '../../enums/cell-status';
import Edge from '../../types/edge';

export const getFileTimeSeries = createAsyncThunk<
	{cellId: string, path: string, timeSeries: TimeSeries},
	{path: string, dataColumn: string, cellId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.FILES_TIME_SERIES,
	async ({path, dataColumn, cellId}, { extra: api }) => {
		const { data } = await api.get<TimeSeries>(ApiRoute.FILES_TIME_SERIES, { params: { path, data_column: dataColumn } });
		return { cellId, path, timeSeries: data };
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
		const { data } = await api.post<CellInfo>(ApiRoute.CELLS_CREATE, { pipeline_id: pipelineId, function: functionName });
		return data;
	},
);


export const addEdge = createAsyncThunk<Edge, Edge, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.PIPELINES_EDGE,
	async ({ child_cell, parent_cell, parent_output, child_input }, { extra: api }) => {
		await api.post(ApiRoute.PIPELINES_EDGE, { parent_cell_id: parent_cell, child_cell_id: child_cell, parent_output, child_input });
		return { parent_cell, child_cell, parent_output, child_input };
	},
);

export const deleteEdge = createAsyncThunk<Edge, Edge, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	'edges/delete',
	async ({ child_cell, child_input, parent_cell, parent_output }, { extra: api }) => {
		await api.delete(ApiRoute.PIPELINES_EDGE, { params: { child_cell_id: child_cell, child_input, parent_cell_id: parent_cell, parent_output } });
		return { child_cell, child_input, parent_cell, parent_output };
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
	{cellId: string, inputs: {field: string, values: {path: string, data_column: string}[]}[]},
	{cellId: string, inputs: {field: string, values: {path: string, data_column: string}[]}[]}, {
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

export const fetchCellStatus = createAsyncThunk<{cellId: string, status: CellStatus}, {cellId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS_STATUS,
	async ({ cellId }, { extra: api, dispatch }) => {
		const { data: {status} } = await api.get<{status: CellStatus}>(ApiRoute.CELLS_STATUS, {params: { cell_id: cellId }});
		if (status !== CellStatus.IN_PROGRESS) {
			dispatch(fetchCellInfo({cellId}));
		}
		return { cellId, status };
	},
);

export const stopCell = createAsyncThunk<{cellId: string}, {cellId: string}, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.CELLS_STOP,
	async ({ cellId }, { extra: api }) => {
		await api.post(ApiRoute.CELLS_STOP, { cell_id: cellId });
		return { cellId };
	},
);
