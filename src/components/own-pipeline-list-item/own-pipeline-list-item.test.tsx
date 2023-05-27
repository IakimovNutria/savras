import React from 'react';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import {Button} from '../button/button';
import {MainListItemName} from '../main-list-item-name/main-list-item-name';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import {OwnPipelineListItem} from './own-pipeline-list-item';
import ShortPipelineInfo from '../../types/short-pipeline-info';
import {MemoryRouter} from 'react-router-dom';
import ShareModal from '../share-modal/share-modal';

describe('own-pipeline-list-item tests', () => {
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
					<OwnPipelineListItem pipeline={mockPipeline} />
				</Provider>
			</MemoryRouter>
		);
		expect(component.find(Button).length).toBe(4);
		expect(component.find(MainListItemName).length).toBe(1);
	});

	it('should open modal on delete', () => {
		const component = mount(
			<MemoryRouter>
				<Provider store={store}>
					<OwnPipelineListItem pipeline={mockPipeline} />
				</Provider>
			</MemoryRouter>
		);
		expect(component.find(ConfirmationModal).length).toBe(0);
		component.find(Button).filterWhere((button) => button.html().includes('Delete')).simulate('click');
		expect(component.find(ConfirmationModal).length).toBe(1);
	});

	it('should open modal on share', () => {
		const component = mount(
			<MemoryRouter>
				<Provider store={store}>
					<OwnPipelineListItem pipeline={mockPipeline} />
				</Provider>
			</MemoryRouter>
		);
		expect(component.find(ShareModal).length).toBe(0);
		component.find(Button).filterWhere((button) => button.html().includes('Share')).simulate('click');
		expect(component.find(ShareModal).length).toBe(1);
	});
});
