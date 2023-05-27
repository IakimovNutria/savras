import { Provider } from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import App from './app';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import React from 'react';
import {mount} from 'enzyme';
import Main from '../../pages/main/main';
import NoAccess from '../../pages/no-access/no-access';
import NotFound from '../../pages/not-found/not-found';
import SignIn from '../../pages/sign-in/sign-in';
import SignUp from '../../pages/sign-up/sign-up';
import {mockStore} from '../../test-utils';
import Pipeline from '../../pages/pipeline/pipeline';
import ResizeObserver from 'resize-observer-polyfill';


describe('logged in routing', () => {
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

	it('should render main page when navigated to "/"', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(Main).length).toBe(1);
	});

	it('should render main page when navigated to "/sign-in"', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/sign-in']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(Main).length).toBe(1);
	});

	it('should render main page when navigated to "/sign-up"', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/sign-up']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(Main).length).toBe(1);
	});

	it('should render pipeline page when navigated to existent pipeline', () => {
		global.ResizeObserver = ResizeObserver;
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/pipeline/1234']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(Pipeline).length).toBe(1);
	});

	it('should render no access page when navigated to non-existent pipeline', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/pipeline/not-exist']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(NoAccess).length).toBe(1);
	});

	it('should render not found when navigated to non-existent route', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/awesometest42']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(NotFound).length).toBe(1);
	});
});

describe('not logged in routing', () => {
	const store = mockStore({
		[ReducerName.AUTHORIZATION]: {
			authorization: AuthorizationStatus.NOT_AUTHORIZED
		},
		[ReducerName.PIPELINE]: {
			currentPipeline: null,
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

	it('should render sign-in page when navigated to "/"', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(SignIn).length).toBe(1);
	});

	it('should render sign-in page when navigated to "/sign-in"', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/sign-in']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(SignIn).length).toBe(1);
	});

	it('should render sign-up page when navigated to "/sign-up"', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/sign-up']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(SignUp).length).toBe(1);
	});

	it('should render sign-in page when navigated to existent pipeline', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/pipeline/1234']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(SignIn).length).toBe(1);
	});

	it('should render sign-in page when navigated to non-existent pipeline', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/pipeline/not-exist']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(SignIn).length).toBe(1);
	});

	it('should render not found when navigated to non-existent route', () => {
		const fakeApp = mount(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/awesometest84']}>
					<App />
				</MemoryRouter>
			</Provider>
		);
		expect(fakeApp.find(NotFound).length).toBe(1);
	});
});

