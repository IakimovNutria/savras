import React from 'react';
import {mount} from 'enzyme';
import Graph from './graph';
import ReactFlow, {
	Background,
	Controls,
	MiniMap
} from 'react-flow-renderer';
import {Provider} from 'react-redux';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import ResizeObserver from 'resize-observer-polyfill';

describe('graph tests', () => {
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
		global.ResizeObserver = ResizeObserver;
		const component = mount(
			<Provider store={store}>
				<Graph cellNodes={[]}
					graphEdges={[]}
				/>
			</Provider>
		);
		expect(component.find(ReactFlow).length).toBe(1);
		expect(component.find(Background).length).toBe(1);
		expect(component.find(Controls).length).toBe(1);
		expect(component.find(MiniMap).length).toBe(1);
	});
});
