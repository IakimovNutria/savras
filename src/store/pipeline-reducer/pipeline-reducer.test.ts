import PipelineReducerState from '../../types/pipeline-reducer-state';
import {pipelineReducer} from './index';
import {
	getFileTimeSeries,
	createCell,
	deleteCell,
	executeCell,
	fetchCellInfo,
	moveCell,
	fetchPipeline,
	addEdge,
	updateParams,
	updateInputs
} from './actions';
import PipelineInfo from '../../types/pipeline-info';
import {CellStatus} from '../../enums/cell-status';


describe('pipeline-reducer', () => {
	let state: PipelineReducerState;
	const mockPipeline: PipelineInfo = {
		cells: [
			{
				id: 'id',
				function: 'function',
				inputs: {'string1': null},
				data_columns: {'string1': null},
				outputs: {},
				input_params: {['string']: false},
				output_params: {},
				error: '',
				x: 10,
				y: 20
			},
			{
				id: 'id2',
				function: 'function',
				inputs: {},
				data_columns: {},
				outputs: {},
				input_params: {},
				output_params: {},
				error: 'error',
				x: 20,
				y: 20
			}
		],
		edges: [['first', 'second']],
		id: 'pipeline',
		name: 'pipeline'
	};

	beforeEach(() => {
		state = {
			cellsStatus: {},
			currentPipeline: null,
			graphs: {},
			isPipelineLoading: false
		};
	});

	it('without additional parameters should return initial state', () => {
		expect(pipelineReducer.reducer(void 0, { type: 'UNKNOWN_ACTION' }))
			.toEqual({
				cellsStatus: {},
				currentPipeline: null,
				graphs: {},
				isPipelineLoading: false
			});
	});

	describe('fetch-pipeline test', () => {
		it('should set isPipelineLoading true on pending', () => {
			expect(pipelineReducer.reducer(state, {type: fetchPipeline.pending.type}).isPipelineLoading)
				.toEqual(true);
		});
		it('should set pipeline, isPipelineLoading false, cell statuses on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: fetchPipeline.fulfilled.type, payload: mockPipeline}).currentPipeline)
				.toEqual(mockPipeline);
			expect(pipelineReducer.reducer(state, {type: fetchPipeline.fulfilled.type, payload: mockPipeline}).isPipelineLoading)
				.toEqual(false);
			expect(pipelineReducer.reducer(state, {type: fetchPipeline.fulfilled.type, payload: mockPipeline}).cellsStatus)
				.toEqual({['id']: CellStatus.NOT_EXECUTED, ['id2']: 'error'});
		});
	});

	describe('update-params test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should set cellStatus saving on pending', () => {
			expect(pipelineReducer.reducer(state, {type: updateParams.pending.type, payload: {cellId: 'id', params: [{field: 'string', value: false}]}, meta: {arg: {cellId: 'id'}}}).cellsStatus['id'])
				.toEqual(CellStatus.SAVING);
		});
		it('should set cellStatus saved on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: updateParams.fulfilled.type, payload: {cellId: 'id', params: [{field: 'string', value: false}]}}).cellsStatus['id'])
				.toEqual(CellStatus.SAVED);
		});
		it('should update params on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: updateParams.fulfilled.type, payload: {cellId: 'id', params: [{field: 'string', value: true}]}}).currentPipeline?.cells.find((cell) => cell.id === 'id')?.input_params['string'])
				.toEqual(true);
		});
		it('should set cellStatus NOT_SAVED on rejected if there is not error message', () => {
			expect(pipelineReducer.reducer(state, {type: updateParams.rejected.type, payload: {cellId: 'id', params: [{field: 'string', value: true}]}, meta: {arg: {cellId: 'id'}}, error: {message: null}}).cellsStatus['id'])
				.toEqual(CellStatus.NOT_SAVED);
		});
		it('should set cellStatus error message on rejected if there is error message', () => {
			expect(pipelineReducer.reducer(state, {type: updateParams.rejected.type, payload: {cellId: 'id', params: [{field: 'string', value: true}]}, meta: {arg: {cellId: 'id'}}, error: {message: 'error'}}).cellsStatus['id'])
				.toEqual('error');
		});
	});

	describe('update-inputs test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should set cellStatus saving on pending', () => {
			expect(pipelineReducer.reducer(state, {type: updateInputs.pending.type, payload: {cellId: 'id', inputs: [{data_column: 'string2', field: 'string1', path: 'string3'}]}, meta: {arg: {cellId: 'id'}}}).cellsStatus['id'])
				.toEqual(CellStatus.SAVING);
		});
		it('should set cellStatus saved on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: updateInputs.fulfilled.type, payload: {cellId: 'id', inputs: [{data_column: 'string2', field: 'string1', path: 'string3'}]}}).cellsStatus['id'])
				.toEqual(CellStatus.SAVED);
		});
		it('should update inputs on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: updateInputs.fulfilled.type, payload: {cellId: 'id', inputs: [{data_column: 'string2', field: 'string1', path: 'string3'}]}}).currentPipeline?.cells.find((cell) => cell.id === 'id')?.inputs['string1'])
				.toEqual('string3');
		});
		it('should update columns on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: updateInputs.fulfilled.type, payload: {cellId: 'id', inputs: [{data_column: 'string2', field: 'string1', path: 'string3'}]}}).currentPipeline?.cells.find((cell) => cell.id === 'id')?.data_columns['string1'])
				.toEqual('string2');
		});
		it('should set cellStatus NOT_SAVED on rejected if there is not error message', () => {
			expect(pipelineReducer.reducer(state, {type: updateInputs.rejected.type, payload: {cellId: 'id', inputs: [{data_column: 'string2', field: 'string1', path: 'string3'}]}, meta: {arg: {cellId: 'id'}}, error: {message: null}}).cellsStatus['id'])
				.toEqual(CellStatus.NOT_SAVED);
		});
		it('should set cellStatus error message on rejected if there is error message', () => {
			expect(pipelineReducer.reducer(state, {type: updateInputs.rejected.type, payload: {cellId: 'id', inputs: [{data_column: 'string2', field: 'string1', path: 'string3'}]}, meta: {arg: {cellId: 'id'}}, error: {message: 'error'}}).cellsStatus['id'])
				.toEqual('error');
		});
	});

	describe('add-edge test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should set edge on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: addEdge.fulfilled.type, payload: ['second', 'third']}).currentPipeline?.edges)
				.toEqual(mockPipeline.edges.concat([['second', 'third']]));
		});
	});

	describe('move-cell test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should move cell on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: moveCell.fulfilled.type, payload: {cellId: 'id', x: 100, y: 100}}).currentPipeline?.cells.find((cell) => cell.id === 'id')?.x)
				.toEqual(100);
			expect(pipelineReducer.reducer(state, {type: moveCell.fulfilled.type, payload: {cellId: 'id', x: 100, y: 100}}).currentPipeline?.cells.find((cell) => cell.id === 'id')?.y)
				.toEqual(100);
		});
	});

	describe('fetch-cell-info test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should set cell on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: fetchCellInfo.fulfilled.type, payload: {...mockPipeline.cells[0], error: 'error12'}}).currentPipeline?.cells.find((cell) => cell.id === 'id')?.error)
				.toEqual('error12');
		});
	});

	describe('execute-cell test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should set cell status HAS_ERROR on rejected', () => {
			expect(pipelineReducer.reducer(state, {type: executeCell.rejected.type, payload: {cellId: 'id'}, meta: {arg: {cellId: 'id'}}}).cellsStatus['id'])
				.toEqual(CellStatus.HAS_ERROR);
		});
		it('should set cell status IN_PROCESS on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: executeCell.fulfilled.type, payload: {cellId: 'id'}, meta: {arg: {cellId: 'id'}}}).cellsStatus['id'])
				.toEqual(CellStatus.IN_PROCESS);
		});
	});

	describe('delete-edge test', () => {
		//TODO: написать тест
	});

	describe('delete-cell test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should delete cell on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: deleteCell.fulfilled.type, payload: {cellId: 'id'}, meta: {arg: {cellId: 'id'}}}).currentPipeline?.cells)
				.toEqual(mockPipeline.cells.slice(1));
		});
	});

	describe('create-cell test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should set cell on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: createCell.fulfilled.type, payload: {...mockPipeline.cells[0], id: 'new'}, meta: {arg: {cellId: 'id'}}}).currentPipeline?.cells)
				.toEqual(mockPipeline.cells.concat([{...mockPipeline.cells[0], id: 'new'}]));
		});
		it('should set cell status NOT_EXECUTED on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: createCell.fulfilled.type, payload: {...mockPipeline.cells[0], id: 'new'}, meta: {arg: {cellId: 'id'}}}).cellsStatus['new'])
				.toEqual(CellStatus.NOT_EXECUTED);
		});
	});

	describe('get-file-time-series test', () => {
		beforeEach(() => {
			state.currentPipeline = mockPipeline;
		});
		it('should set timeSeries on fulfilled', () => {
			expect(pipelineReducer.reducer(state, {type: getFileTimeSeries.fulfilled.type, payload: {cellId: 'id', name: 'name', timeSeries: [{datetime: 'string', value: 0}]}}).graphs)
				.toEqual({['id']: {['name']: [{datetime: 'string', value: 0}]}});
		});
	});
});
