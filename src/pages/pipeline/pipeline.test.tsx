import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import ResizeObserver from 'resize-observer-polyfill';
import Pipeline from './pipeline';
import {SidebarTabs} from '../../components/sidebar-tabs/sidebar-tabs';
import Graph from '../../components/graph/graph';
import CellCreation from '../../components/cell-creation/cell-creation';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {HeaderButton} from '../../components/header-button/header-button';

describe('pipeline tests', () => {
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
			sharedPipelines: [{name: '1235', id: '1235'}],
			functions: [],
			filesColumns: {}
		}
	});

	it('should render correctly on can edit', () => {
		global.ResizeObserver = ResizeObserver;
		const component = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/pipeline/1234']}>
					<Routes>
						<Route path="/pipeline/:id"
							element={<Pipeline />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		);
		expect(component.find(SidebarTabs).length).toBe(1);
		expect(component.find(Graph).length).toBe(1);
		expect(component.find(CellCreation).length).toBe(0);
		expect(component.find(HeaderButton).length).toBe(2);
	});

	it('should render correctly on can not edit', () => {
		global.ResizeObserver = ResizeObserver;
		const component = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/pipeline/1235']}>
					<Routes>
						<Route path="/pipeline/:id"
							element={<Pipeline />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		);
		expect(component.find(SidebarTabs).length).toBe(1);
		expect(component.find(Graph).length).toBe(1);
		expect(component.find(CellCreation).length).toBe(0);
		expect(component.find(HeaderButton).length).toBe(1);
	});

	it('should open cell creation', () => {
		global.ResizeObserver = ResizeObserver;
		const component = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/pipeline/1234']}>
					<Routes>
						<Route path="/pipeline/:id"
							element={<Pipeline />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		);
		expect(component.find(CellCreation).length).toBe(0);
		component.find(HeaderButton).filterWhere((button) => button.html().includes('Create')).simulate('click');
		expect(component.find(CellCreation).length).toBe(1);
	});
});
