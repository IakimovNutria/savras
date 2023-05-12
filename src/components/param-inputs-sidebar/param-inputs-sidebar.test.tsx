import React from 'react';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import CellInfo from '../../types/cell-info';
import {Sidebar} from '../sidebar/sidebar';
import ParamInputsSidebar from './param-inputs-sidebar';
import ParamInput from '../param-input/param-input';

describe('param-inputs-sidebar tests', () => {
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
			functions: [
				{
					function: 'func',
					name: 'func',
					group: 'func',
					inputs: [],
					input_params: {'param-name': undefined},
					doc: 'string'
				}
			],
			filesColumns: {'file-path': ['column1', 'column2']}
		}
	});
	const mockCell = {
		id: 'id',
		function: 'func',
		inputs: {'input-name': 'input-file-path'},
		data_columns: {'input-name': 'input-data-column'},
		outputs: {'output-name': 'output-value'},
		input_params: {'param-name': false},
		output_params: {},
		error: 'error',
		x: 10,
		y: 20
	} as CellInfo;

	it('should render correctly', () => {
		const component = mount(
			<Provider store={store}>
				<ParamInputsSidebar cell={mockCell} />
			</Provider>
		);
		expect(component.find(Sidebar).length).toBe(1);
		expect(component.find(ParamInput).length).toBe(1);
	});
});