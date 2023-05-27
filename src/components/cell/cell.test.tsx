import React from 'react';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import {PipelineContext} from '../../contexts/pipeline-context';
import Cell from './cell';
import CellInfo from '../../types/cell-info';
import {Button} from '../button/button';
import {HeaderButton} from '../header-button/header-button';
import {CellStatus} from '../../enums/cell-status';
import Modal from '../modal/modal';

describe('loading tests', () => {
	const mockCell: CellInfo = {
		id: 'id',
		function: 'function',
		inputs: {'string1': null},
		data_columns: {'string1': null},
		outputs: {},
		input_params: {['string']: false},
		output_params: {},
		error: '',
		x: 10,
		y: 20
	};
	const store = mockStore({
		[ReducerName.AUTHORIZATION]: {
			authorization: AuthorizationStatus.AUTHORIZED
		},
		[ReducerName.PIPELINE]: {
			currentPipeline: {
				cells: [
					mockCell,
					{
						id: 'id2',
						function: 'function',
						inputs: {},
						data_columns: {},
						outputs: {},
						input_params: {},
						output_params: {},
						error: 'error',
						x: 20,
						y: 20
					}
				],
				edges: [['first', 'second']],
				id: 'pipeline',
				name: 'pipeline'
			},
			graphs: {},
			isPipelineLoading: false,
			cellsStatus: {}
		},
		[ReducerName.MAIN]: {
			files: [],
			userPipelines: [{name: '1234', id: '1234'}],
			sharedPipelines: [],
			functions: [
				{
					function: 'function',
					name: 'name',
					group: 'group',
					inputs: [],
					input_params: {},
					doc: 'string'
				}
			],
			filesColumns: {}
		}
	});
	it('should render correctly on not canEdit', () => {
		const component = mount(
			<Provider store={store}>
				<PipelineContext.Provider value={{setSidebar: () => {/*do nothing*/}, canEdit: false, pipelineId: 'pipeline'}}>
					<Cell cellInfo={mockCell} />
				</PipelineContext.Provider>
			</Provider>

		);
		expect(component.find(Button).length).toBe(3);
		expect(component.find(HeaderButton).length).toBe(0);
		expect(component.html().includes(CellStatus.NOT_EXECUTED));
		expect(component.html().includes('function'));
	});

	it('should render correctly on canEdit', () => {
		const component = mount(
			<Provider store={store}>
				<PipelineContext.Provider value={{setSidebar: () => {/*do nothing*/}, canEdit: true, pipelineId: 'pipeline'}}>
					<Cell cellInfo={mockCell} />
				</PipelineContext.Provider>
			</Provider>

		);
		expect(component.find(Button).length).toBe(4);
		expect(component.find(HeaderButton).length).toBe(1);
		expect(component.html().includes(CellStatus.NOT_EXECUTED));
		expect(component.html().includes('function'));
	});

	it('should open modal on info', () => {
		const component = mount(
			<Provider store={store}>
				<PipelineContext.Provider value={{setSidebar: () => {/*do nothing*/}, canEdit: true, pipelineId: 'pipeline'}}>
					<Cell cellInfo={mockCell} />
				</PipelineContext.Provider>
			</Provider>

		);
		expect(component.find(Modal).length).toBe(0);
		component.find('.cell__function-info-icon').simulate('click');
		expect(component.find(Modal).length).toBe(1);
	});
});
