import React from 'react';
import {mount} from 'enzyme';
import CellNode from './cell-node';
import CellInfo from '../../types/cell-info';
import {ReactFlowProvider} from 'reactflow';
import Cell from '../cell/cell';
import {Provider} from 'react-redux';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';

describe('cell-node tests', () => {
	const mockCell: CellInfo = {
		id: 'id',
		function: 'function',
		inputs: {'string1': null},
		outputs: {},
		input_params: {['string']: false},
		output_params: {},
		error: '',
		x: 10,
		y: 20
	};
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
			functions: [],
			filesColumns: {}
		}
	});
	it('should render correctly', () => {
		const component = mount(
			<Provider store={store}>
				<ReactFlowProvider>
					<CellNode data={{cellInfo: mockCell}} />
				</ReactFlowProvider>
			</Provider>
		);
		//expect(component.find(Handle).length).toBe(2);
		expect(component.find(Cell).length).toBe(1);
	});
});
