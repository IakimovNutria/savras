import {
	fetchFilesAction,
	fetchCellsFunctionsInfo,
	fetchFileColumns,
	deleteFile,
	fetchSharedPipelinesAction,
	fetchUserPipelinesAction,
	createPipeline,
	forkPipeline,
	saveFile,
	uploadFile,
	deletePipeline
} from './actions';
import {mainReducer} from './index';
import MainReducerState from '../../types/main-reducer-state';
import CellFunction from '../../types/cells-function';
import FileInfo from '../../types/file-info';
import ShortPipelineInfo from '../../types/short-pipeline-info';

describe('main-reducer', () => {
	let state: MainReducerState;
	const mockFiles: FileInfo[] = [{name: 'string', path: 'string'}, {name: 'string1', path: 'string1'}];
	const mockFunctionsInfo: CellFunction[] = [
		{
			function: 'func1',
			name: 'name1',
			group: 'group1',
			inputs: [],
			input_params: {},
			doc: 'doc'
		},
		{
			function: 'func2',
			name: 'name2',
			group: 'group1',
			inputs: [],
			input_params: {},
			doc: 'doc'
		},
		{
			function: 'func3',
			name: 'name3',
			group: 'group2',
			inputs: [],
			input_params: {},
			doc: 'doc'
		}
	];
	const mockPipelines: ShortPipelineInfo[] = [
		{name: 'string', id: 'string'},
		{name: 'string', id: 'string1'},
		{name: 'string', id: 'string2'},
		{name: 'string', id: 'string3'}
	];

	beforeEach(() => {
		state = {
			sharedPipelines: [],
			userPipelines: [],
			filesColumns: {},
			files: [],
			functions: null
		};
	});

	it('without additional parameters should return initial state', () => {
		expect(mainReducer.reducer(void 0, { type: 'UNKNOWN_ACTION' }))
			.toEqual({
				sharedPipelines: [],
				userPipelines: [],
				filesColumns: {},
				files: [],
				functions: null
			});
	});

	describe('fetch-files-action test', () => {
		it('should set files on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: fetchFilesAction.fulfilled.type, payload: mockFiles}).files)
				.toEqual(mockFiles);
		});
	});

	describe('fetch-cells-functions-info test', () => {
		it('should set functions on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: fetchCellsFunctionsInfo.fulfilled.type, payload: mockFunctionsInfo}).functions)
				.toEqual(mockFunctionsInfo);
		});
	});

	describe('fetch-file-columns test', () => {
		it('should set fileColumns on fulfilled', () => {
			expect(mainReducer.reducer(state, { type: fetchFileColumns.fulfilled.type, payload: {
				columns: ['a', 'b', 'c'],
				path: 'aaa'
			}}).filesColumns).toEqual({['aaa']: ['a', 'b', 'c']});
		});
	});

	describe('delete-file test', () => {
		beforeEach(() => {
			state = {
				sharedPipelines: [],
				userPipelines: [],
				filesColumns: {['file-path']: ['a', 'b', 'c']},
				files: [{name: 'file-name', path: 'file-path'}],
				functions: []
			};
		});
		it('should delete file and fileColumns on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: 'unknown'}).files)
				.toEqual([{name: 'file-name', path: 'file-path'}]);
			expect(mainReducer.reducer(state, {type: 'unknown'}).filesColumns)
				.toEqual({['file-path']: ['a', 'b', 'c']});
			expect(mainReducer.reducer(state, { type: deleteFile.fulfilled.type, payload: {path: 'file-path'}}).filesColumns)
				.toEqual({});
			expect(mainReducer.reducer(state, { type: deleteFile.fulfilled.type, payload: {path: 'file-path'}}).files)
				.toEqual([]);
		});
	});

	describe('fetch-shared-pipelines test', () => {
		it('should set shared pipelines on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: fetchSharedPipelinesAction.fulfilled.type, payload: mockPipelines}).sharedPipelines)
				.toEqual(mockPipelines);
		});
	});

	describe('fetch-user-pipelines test', () => {
		it('should set user pipelines on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: fetchUserPipelinesAction.fulfilled.type, payload: mockPipelines}).userPipelines)
				.toEqual(mockPipelines);
		});
	});

	describe('create-pipeline test', () => {
		it('should set pipeline on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: createPipeline.fulfilled.type, payload: mockPipelines[0]}).userPipelines)
				.toEqual([mockPipelines[0]]);
		});
	});

	describe('fork-pipeline test', () => {
		it('should set pipeline on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: forkPipeline.fulfilled.type, payload: mockPipelines[0]}).userPipelines)
				.toEqual([mockPipelines[0]]);
		});
	});

	describe('save-file test', () => {
		it('should set file on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: saveFile.fulfilled.type, payload: mockFiles[0]}).files)
				.toEqual([mockFiles[0]]);
		});
	});

	describe('upload-file test', () => {
		it('should set file on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: uploadFile.fulfilled.type, payload: mockFiles[0]}).files)
				.toEqual([mockFiles[0]]);
		});
	});

	describe('delete-pipeline test', () => {
		beforeEach(() => {
			state = {
				sharedPipelines: [],
				userPipelines: mockPipelines,
				filesColumns: {},
				files: [],
				functions: []
			};
		});
		it('should delete pipeline on fulfilled', () => {
			expect(mainReducer.reducer(state, {type: deletePipeline.fulfilled.type, payload: {pipelineId: mockPipelines[0].id}}).userPipelines)
				.toEqual(mockPipelines.slice(1));
		});
	});
});
