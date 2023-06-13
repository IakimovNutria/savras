import { createSlice } from '@reduxjs/toolkit';
import { ReducerName } from '../../enums/reducer-name';
import PipelineReducerState from '../../types/pipeline-reducer-state';
import {
	addEdge,
	createCell,
	deleteCell,
	deleteEdge,
	executeCell,
	fetchCellInfo,
	fetchPipeline,
	getFileTimeSeries, moveCell,
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
			.addCase(fetchPipeline.rejected, (state) => {
				state.isPipelineLoading = false;
			})
			.addCase(updateParams.pending, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROGRESS) {
					state.cellsStatus[action.meta.arg.cellId] = CellStatus.SAVING;
				}
			})
			.addCase(updateParams.fulfilled, (state, action) => {
				if (state.cellsStatus[action.payload.cellId] !== CellStatus.IN_PROGRESS) {
					state.cellsStatus[action.payload.cellId] = CellStatus.SAVED;
				}
				if (state.currentPipeline) {
					state.currentPipeline.cells = state.currentPipeline.cells.map((cell) => {
						if (cell.id !== action.payload.cellId) {
							return cell;
						}
						return {
							...cell,
							input_params:
								{
									...cell.input_params,
									...action.payload.params.reduce((result: {[key: string]: string | number | boolean}, item) => {
										result[item.field] = item.value;
										return result;
									}, {})
								}
						};
					});
				}
			})
			.addCase(updateParams.rejected, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROGRESS) {
					state.cellsStatus[action.meta.arg.cellId] = action.error.message ?? CellStatus.NOT_SAVED;
				}
			})
			.addCase(updateInputs.pending, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROGRESS) {
					state.cellsStatus[action.meta.arg.cellId] = CellStatus.SAVING;
				}
			})
			.addCase(updateInputs.fulfilled, (state, action) => {
				if (state.cellsStatus[action.payload.cellId] !== CellStatus.IN_PROGRESS) {
					state.cellsStatus[action.payload.cellId] = CellStatus.SAVED;
				}
				if (state.currentPipeline) {
					state.currentPipeline.cells = state.currentPipeline.cells.map((cell) => {
						if (cell.id !== action.payload.cellId) {
							return cell;
						}
						return {
							...cell,
							inputs:
								{
									...cell.inputs,
									...action.payload.inputs.reduce((result: Record<string, {path: string, data_column: string}[] | null>, item) => {
										result[item.field] = item.values;
										return result;
									}, {})
								}
						};
					});
				}
			})
			.addCase(updateInputs.rejected, (state, action) => {
				if (state.cellsStatus[action.meta.arg.cellId] !== CellStatus.IN_PROGRESS) {
					state.cellsStatus[action.meta.arg.cellId] = action.error.message ?? CellStatus.NOT_SAVED;
				}
			})
			.addCase(getFileTimeSeries.fulfilled, (state, action) => {
				state.graphs[action.payload.path] = action.payload.timeSeries;
			})
			.addCase(deleteCell.fulfilled, (state, action) => {
				if (state.currentPipeline) {
					state.currentPipeline.cells = state.currentPipeline.cells
						.filter((cell) => cell.id !== action.payload.cellId);
				}
			})
			.addCase(executeCell.fulfilled, (state, action) => {
				state.cellsStatus = { ...state.cellsStatus, [action.payload.cellId]: CellStatus.IN_PROGRESS };
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
				if (state.cellsStatus[action.payload.id] === CellStatus.IN_PROGRESS) {
					state.cellsStatus = {
						...state.cellsStatus,
						[action.payload.id]: getCellStatus(action.payload, CellStatus.IN_PROGRESS),
					};
				}
			})
			.addCase(createCell.fulfilled, (state, action) => {
				if (state.currentPipeline) {
					state.currentPipeline.cells.push(action.payload);
				}
				state.cellsStatus[action.payload.id] = CellStatus.NOT_EXECUTED;
			})
			.addCase(moveCell.fulfilled, (state, action) => {
				if (state.currentPipeline) {
					state.currentPipeline.cells = state.currentPipeline.cells.map((cell) => {
						if (cell.id === action.payload.cellId) {
							return {...cell, x: action.payload.x, y: action.payload.y};
						}
						return cell;
					});
				}
			})
			.addCase(addEdge.fulfilled, (state, action) => {
				if (state.currentPipeline) {
					state.currentPipeline.edges = [...state.currentPipeline.edges, action.payload];
				}
			})
			.addCase(deleteEdge.fulfilled, (state, action) => {
				if (state.currentPipeline) {
					state.currentPipeline.edges = state.currentPipeline.edges.filter((edge) =>
						edge.child_cell !== action.payload.child_cell ||
						edge.child_input !== action.payload.child_input ||
						edge.parent_cell !== action.payload.parent_cell ||
						edge.parent_output !== action.payload.parent_output
					);
				}
			});
	},
});
