import React from 'react';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import {Button} from '../button/button';
import {MainListItemName} from '../main-list-item-name/main-list-item-name';
import {SharedPipelineListItem} from './shared-pipeline-list-item';
import ShortPipelineInfo from '../../types/short-pipeline-info';
import {MemoryRouter} from 'react-router-dom';

describe('shared-pipeline-list-item tests', () => {
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
			functions: [],
			filesColumns: {'file-path': ['column1', 'column2']}
		}
	});

	const mockPipeline = {
		name: 'pipeline-name',
		id: 'pipeline-id'
	} as ShortPipelineInfo;

	it('should render correctly', () => {
		const component = mount(
			<MemoryRouter>
				<Provider store={store}>
					<SharedPipelineListItem pipeline={mockPipeline} />
				</Provider>
			</MemoryRouter>
		);
		expect(component.find(Button).length).toBe(2);
		expect(component.find(MainListItemName).length).toBe(1);
	});
});
