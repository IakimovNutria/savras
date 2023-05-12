import React from 'react';
import {mount} from 'enzyme';
import CellCreation from './cell-creation';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';

describe('cell creation tests', () => {
	const store = mockStore({
		[ReducerName.AUTHORIZATION]: {
			authorization: AuthorizationStatus.AUTHORIZED
		},
		[ReducerName.PIPELINE]: {
			currentPipeline: {
				id: '1234',
				name: '1234',
				cells: [],
				edges: []
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
					function: 'function1',
					name: 'function1',
					group: 'group1',
					inputs: [],
					input_params: {},
					doc: 'haha'
				},
				{
					function: 'function2',
					name: 'function2',
					group: 'group1',
					inputs: [],
					input_params: {},
					doc: 'haha'
				},
				{
					function: 'function3',
					name: 'function3',
					group: 'group2',
					inputs: [],
					input_params: {},
					doc: 'haha'
				},
				{
					function: 'function4',
					name: 'function4',
					group: 'group2',
					inputs: [],
					input_params: {},
					doc: 'haha'
				},
				{
					function: 'function5',
					name: 'function5',
					group: 'group2',
					inputs: [],
					input_params: {},
					doc: 'haha'
				}
			],
			filesColumns: {}
		}
	});

	it('should render correctly', () => {
		const changeVisible = jest.fn();
		const component = mount(
			<Provider store={store}>
				<CellCreation pipelineId={'1234'}
					changeVisible={changeVisible}
				/>
			</Provider>
		);
		expect(component.html().match(/group1/g)?.length).toBe(1);
		expect(component.html().match(/group2/g)?.length).toBe(1);
		expect(component.html().match(/function1/g)?.length).toBe(2);
		expect(component.html().match(/function2/g)?.length).toBe(2);
		expect(component.html().includes('function3')).toBe(false);
		expect(component.html().includes('function4')).toBe(false);
		expect(component.html().includes('function5')).toBe(false);
	});
});
