import { createSlice } from '@reduxjs/toolkit';
import { ReducerName } from '../../enums/reducer-name';
import PipelineReducerState from '../../types/pipeline-reducer-state';
import {
	createCell,
	deleteCell,
	executeCell,
	fetchCellInfo,
	fetchPipeline,
	getFileTimeSeries,
	updateInputs,
	updateParams,
} from './actions';
import getCellStatus from '../../utils/get-cell-status';
import { CellStatus } from '../../enums/cell-status';

const initialState: PipelineReducerState = {
	cellsStatus: {},
	currentPipeline: null,
	graphs: {},
	isPipelineLoading: false,
};

export const pipelineReducer = createSlice({
	name: ReducerName.PIPELINE,
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPipeline.pending, (state) => {
				state.isPipelineLoading = true;
			})
			.addCase(fetchPipeline.fulfilled, (state, action) => {
				state.isPipelineLoading = false;
				state.currentPipeline = action.payload;
				state.currentPipeline.cells.forEach((cell) => {
					state.cellsStatus = { ...state.cellsStatus, [cell.id]: getCellStatus(cell, CellStatus.NOT_EXECUTED) };
				});
			})
			.addCase(updateParams.pending, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
					state.cellsStatus[action.meta.arg.cellId] = CellStatus.SAVING;
				}
			})
			.addCase(updateParams.fulfilled, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
					state.cellsStatus[action.payload.cellId] = CellStatus.SAVED;
				}
			})
			.addCase(updateParams.rejected, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
					const errorMessage = action.error.message;
					state.cellsStatus[action.meta.arg.cellId] = errorMessage === undefined ? CellStatus.NOT_SAVED : errorMessage;
				}
			})
			.addCase(updateInputs.pending, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
					state.cellsStatus[action.meta.arg.cellId] = CellStatus.SAVING;
				}
			})
			.addCase(updateInputs.fulfilled, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
					state.cellsStatus[action.payload.cellId] = CellStatus.SAVED;
				}
			})
			.addCase(updateInputs.rejected, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROCESS) {
					const errorMessage = action.error.message;
					state.cellsStatus[action.meta.arg.cellId] = errorMessage === undefined ? CellStatus.NOT_SAVED : errorMessage;
				}
			})
			.addCase(getFileTimeSeries.fulfilled, (state, action) => {
				state.graphs[action.payload.cellId] = {
					...state.graphs[action.payload.cellId],
					[action.payload.name]: action.payload.timeSeries,
				};
			})
			.addCase(deleteCell.fulfilled, (state, action) => {
				if (state.currentPipeline) {
					state.currentPipeline.cells = state.currentPipeline.cells
						.filter((cell) => cell.id !== action.payload.cellId);
				}
			})
			.addCase(executeCell.fulfilled, (state, action) => {
				state.cellsStatus = { ...state.cellsStatus, [action.payload.cellId]: CellStatus.IN_PROCESS };
			})
			.addCase(executeCell.rejected, (state, action) => {
				state.cellsStatus = {
					...state.cellsStatus,
					[action.meta.arg.cellId]: CellStatus.HAS_ERROR,
				};
			})
			.addCase(fetchCellInfo.fulfilled, (state, action) => {
				if (state.currentPipeline) {
					state.currentPipeline.cells = state.currentPipeline.cells
						.map((cell) => (cell.id === action.payload.id ? action.payload : cell));
				}
				if (state.cellsStatus[action.payload.id] === CellStatus.IN_PROCESS) {
					state.cellsStatus = {
						...state.cellsStatus,
						[action.payload.id]: getCellStatus(action.payload, CellStatus.IN_PROCESS),
					};
				}
			})
			.addCase(createCell.fulfilled, (state, action) => {
				if (state.currentPipeline) {
					state.currentPipeline.cells.push(action.payload);
				}
				state.cellsStatus[action.payload.id] = CellStatus.NOT_EXECUTED;
			});
	},
});
