import React from 'react';
import {mount} from 'enzyme';
import CellCharts from './cell-charts';
import CellInfo from '../../types/cell-info';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import Chart from '../chart/chart';
import {CellStatus} from '../../enums/cell-status';

describe('cell-charts tests', () => {
	const mockCell: CellInfo = {
		id: 'id',
		function: 'function',
		inputs: {'string1': null},
		outputs: {},
		input_params: {['string']: false},
		output_params: {},
		error: '',
		x: 10,
		y: 20,
		status: CellStatus.NOT_EXECUTED
	};
	const store = mockStore({
		[ReducerName.AUTHORIZATION]: {
			authorization: AuthorizationStatus.AUTHORIZED
		},
		[ReducerName.PIPELINE]: {
			currentPipeline: {
				cells: [
					mockCell,
					{
						id: 'id2',
						function: 'function',
						inputs: {},
						outputs: {},
						input_params: {},
						output_params: {},
						error: 'error',
						x: 20,
						y: 20,
						status: CellStatus.NOT_EXECUTED
					}
				],
				edges: [],
				id: 'pipeline',
				name: 'pipeline'
			},
			graphs: {},
			isPipelineLoading: false,
			cellsStatus: {}
		},
		[ReducerName.MAIN]: {
			files: [],
			userPipelines: [{name: '1234', id: '1234'}],
			sharedPipelines: [],
			functions: [
				{
					function: 'function',
					name: 'name',
					group: 'group',
					inputs: {},
					outputs: {},
					input_params: {},
					doc: 'string'
				}
			],
			filesColumns: {}
		}
	});
	it('should render correctly', () => {
		const component = mount(
			<Provider store={store}>
				<CellCharts cellId={mockCell.id}
					outputs={mockCell.outputs}
					inputs={mockCell.inputs}
				/>
			</Provider>
		);
		expect(component.find('select').length).toBe(2);
		expect(component.find(Chart).length).toBe(1);
	});
});
