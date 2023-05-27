import React from 'react';
import {mount} from 'enzyme';
import Main from './main';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import PipelinesSection from '../../components/pipelines-section/pipelines-section';
import FilesSection from '../../components/files-section/files-section';

describe('main tests', () => {
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
					<Main />
				</Provider>
			</MemoryRouter>
		);
		expect(component.find(PipelinesSection).length).toBe(1);
		expect(component.find(FilesSection).length).toBe(1);
	});
});
