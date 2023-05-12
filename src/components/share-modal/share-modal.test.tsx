import React from 'react';
import {mount} from 'enzyme';
import ShareModal from './share-modal';
import Modal from '../modal/modal';
import {Provider} from 'react-redux';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';

describe('share-modal tests', () => {
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

	it('should render correctly', () => {
		const component = mount(
			<Provider store={store}>
				<ShareModal setShowShareModal={() => {/*do nothing*/}}
					pipelineId={'pipeline-id'}
				/>
			</Provider>
		);
		expect(component.find(Modal).length).toBe(1);
		expect(component.find('form').length).toBe(1);
	});
});
