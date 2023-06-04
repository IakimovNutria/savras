import React from 'react';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import FileInputsSidebar from './file-inputs-sidebar';
import CellInfo from '../../types/cell-info';
import {Sidebar} from '../sidebar/sidebar';
import FileInput from '../file-input/file-input';

describe('file-inputs-sidebar tests', () => {
	const store = mockStore({
		[ReducerName.AUTHORIZATION]: {
			authorization: AuthorizationStatus.AUTHORIZED
		},
		[ReducerName.PIPELINE]: {
			currentPipeline: null,
			graphs: {},
			isPipelineLoading: false,
			cellsStatus: {}
		},
		[ReducerName.MAIN]: {
			files: [
				{
					name: 'file-name',
					path: 'file-path'
				}
			],
			userPipelines: [],
			sharedPipelines: [],
			functions: [],
			filesColumns: {'file-path': ['column1', 'column2']}
		}
	});
	const mockCell = {
		id: 'id',
		function: 'func',
		inputs: {'input-name': [{path: 'input-file-path', data_column: 'input-data-column'}]},
		outputs: {},
		input_params: {},
		output_params: {},
		error: 'error',
		x: 10,
		y: 20
	} as CellInfo;

	it('should render correctly', () => {
		const component = mount(
			<Provider store={store}>
				<FileInputsSidebar cell={mockCell} />
			</Provider>
		);
		expect(component.find(Sidebar).length).toBe(1);
		expect(component.find(FileInput).length).toBe(1);
	});
});
