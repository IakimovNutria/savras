import React from 'react';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import {FileListItem} from './file-list-item';
import FileInfo from '../../types/file-info';
import {Button} from '../button/button';
import {MainListItemName} from '../main-list-item-name/main-list-item-name';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';

describe('file-list-item tests', () => {
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

	const mockFile = {
		name: 'file-name',
		path: 'file-path'
	} as FileInfo;

	it('should render correctly', () => {
		const component = mount(
			<Provider store={store}>
				<FileListItem file={mockFile} />
			</Provider>
		);
		expect(component.find(Button).length).toBe(2);
		expect(component.find(MainListItemName).length).toBe(1);
	});

	it('should open modal on delete', () => {
		const component = mount(
			<Provider store={store}>
				<FileListItem file={mockFile} />
			</Provider>
		);
		expect(component.find(ConfirmationModal).length).toBe(0);
		component.find(Button).filterWhere((button) => button.html().includes('Delete')).simulate('click');
		expect(component.find(ConfirmationModal).length).toBe(1);
	});
});
