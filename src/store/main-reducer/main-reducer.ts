import { createSlice } from '@reduxjs/toolkit';
import { ReducerName } from '../../enums/reducer-name';
import MainReducerState from '../../types/main-reducer-state';
import {
	createPipeline,
	deleteFile, deletePipeline, fetchCellsFunctionsInfo, fetchFileColumns, fetchFilesAction,
	fetchSharedPipelinesAction,
	fetchUserPipelinesAction, forkPipeline,
	saveFile,
	uploadFile,
} from '../api-actions';
import {
	setCellsFunctions, setFiles, setSharedPipelines, setUserPipelines,
} from '../actions';

const initialState: MainReducerState = {
	files: [],
	userPipelines: [],
	sharedPipelines: [],
	functions: [],
	filesColumns: {},
};

export const mainReducer = createSlice({
	name: ReducerName.Main,
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(deleteFile.fulfilled, (state, action) => {
				state.files = state.files.filter((file) => file.path !== action.payload.path);
			})
			.addCase(saveFile.fulfilled, (state, action) => {
				state.files = [action.payload].concat(state.files);
			})
			.addCase(uploadFile.fulfilled, (state, action) => {
				state.files = [action.payload].concat(state.files);
			})
			.addCase(fetchSharedPipelinesAction.fulfilled, (state, action) => {
				state.sharedPipelines = action.payload;
			})
			.addCase(fetchUserPipelinesAction.fulfilled, (state, action) => {
				state.userPipelines = action.payload;
			})
			.addCase(createPipeline.fulfilled, (state, action) => {
				state.userPipelines = [action.payload].concat(state.userPipelines);
			})
			.addCase(forkPipeline.fulfilled, (state, action) => {
				state.userPipelines = [action.payload].concat(state.userPipelines);
			})
			.addCase(fetchFilesAction.fulfilled, (state, action) => {
				state.files = action.payload;
			})
			.addCase(fetchCellsFunctionsInfo.fulfilled, (state, action) => {
				state.functions = action.payload;
			})
			.addCase(deletePipeline.fulfilled, (state, action) => {
				state.userPipelines = state.userPipelines
					.filter((pipeline) => pipeline.id !== action.payload.pipelineId);
			})
			.addCase(fetchFileColumns.fulfilled, (state, action) => {
				state.filesColumns = { ...state.filesColumns, [action.payload.path]: action.payload.columns };
			})
			.addCase(setUserPipelines, (state, action) => {
				state.userPipelines = action.payload;
			})
			.addCase(setFiles, (state, action) => {
				state.files = action.payload;
			})
			.addCase(setSharedPipelines, (state, action) => {
				state.sharedPipelines = action.payload;
			})
			.addCase(setCellsFunctions, (state, action) => {
				state.functions = action.payload;
			});
	},
});
