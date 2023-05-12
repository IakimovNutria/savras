import {MemoryRouter} from 'react-router-dom';
import React from 'react';
import {Authorization} from './authorization';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';

describe('authorization tests', () => {
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
			files: [],
			userPipelines: [],
			sharedPipelines: [],
			functions: [],
			filesColumns: {}
		}
	});

	it('should render correctly', () => {
		const eventOnSubmit = jest.fn();
		const component = mount(
			<Provider store={store}>
				<MemoryRouter>
					<Authorization onSubmit={eventOnSubmit}
						mainTitle={'mainTitle'}
						error={'error'}
						linkTitle={'linkTitle'}
						linkTo={'/'}
						linkName={'linkName'}
					/>
				</MemoryRouter>
			</Provider>
		);
		expect(component.html().includes('mainTitle')).toBe(true);
		expect(component.html().includes('error')).toBe(true);
		expect(component.html().includes('linkTitle')).toBe(true);
		expect(component.html().includes('linkName')).toBe(true);
	});

	it('should call onSubmit when click the button', () => {
		const eventOnSubmit = jest.fn();
		const component = mount(
			<Provider store={store}>
				<MemoryRouter>
					<Authorization onSubmit={eventOnSubmit}
						mainTitle={'mainTitle'}
						error={'error'}
						linkTitle={'linkTitle'}
						linkTo={'/'}
						linkName={'linkName'}
					/>
				</MemoryRouter>
			</Provider>
		);
		component.find('button').simulate('submit');
		expect(eventOnSubmit).toHaveBeenCalled();
	});
});
