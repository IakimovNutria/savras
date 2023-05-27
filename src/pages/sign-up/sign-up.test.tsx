import React from 'react';
import {mount} from 'enzyme';
import SignUp from './sign-up';
import {Authorization} from '../../components/authorization/authorization';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';

describe('sign up tests', () => {
	const store = mockStore({
		[ReducerName.AUTHORIZATION]: {
			authorization: AuthorizationStatus.NOT_AUTHORIZED
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
			<MemoryRouter>
				<Provider store={store}>
					<SignUp />
				</Provider>
			</MemoryRouter>
		);
		expect(component.find(Authorization).length).toBe(1);
		expect(component.html().includes('Sign up')).toBe(true);
	});
});
