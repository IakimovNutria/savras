import React from 'react';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import {SidebarTabs} from './sidebar-tabs';
import {SidebarName} from '../../enums/sidebar-name';
import FileInputsSidebar from '../file-inputs-sidebar/file-inputs-sidebar';
import ParamInputsSidebar from '../param-inputs-sidebar/param-inputs-sidebar';
import OutputsSidebar from '../outputs-sidebar/outputs-sidebar';
import {ParamType} from '../../enums/param-type';
import {CellStatus} from "../../enums/cell-status";

describe('param-inputs-sidebar tests', () => {
	const store = mockStore({
		[ReducerName.AUTHORIZATION]: {
			authorization: AuthorizationStatus.AUTHORIZED
		},
		[ReducerName.PIPELINE]: {
			currentPipeline: {
				id: 'pipeline-id',
				name: 'pipeline-name',
				cells: [
					{
						id: 'cell-id',
						function: 'func',
						inputs: {'input-name': [{path: 'input-file-path', data_column: 'input-data-column'}]},
						outputs: {'output-name': ['output-value']},
						input_params: {'param-name': false},
						output_params: {},
						error: 'error',
						x: 10,
						y: 20,
						status: CellStatus.NOT_EXECUTED
					}
				],
				edges: []
			},
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
			functions: [
				{
					function: 'func',
					name: 'func',
					group: 'func',
					inputs: {},
					outputs: {},
					input_params: {'param-name': ParamType.STR},
					doc: 'string'
				}
			],
			filesColumns: {'file-path': ['column1', 'column2']}
		}
	});

	it('should render correctly', () => {
		const fileInputComponent = mount(
			<Provider store={store}>
				<SidebarTabs sidebarId={'cell-id'}
					sidebarName={SidebarName.INPUTS}
				/>
			</Provider>
		);
		expect(fileInputComponent.find(FileInputsSidebar).length).toBe(1);
		const paramInputComponent = mount(
			<Provider store={store}>
				<SidebarTabs sidebarId={'cell-id'}
					sidebarName={SidebarName.PARAMS}
				/>
			</Provider>
		);
		expect(paramInputComponent.find(ParamInputsSidebar).length).toBe(1);
		const outputInputComponent = mount(
			<Provider store={store}>
				<SidebarTabs sidebarId={'cell-id'}
					sidebarName={SidebarName.OUTPUTS}
				/>
			</Provider>
		);
		expect(outputInputComponent.find(OutputsSidebar).length).toBe(1);
	});

	it('should return null if something went wrong', () => {
		const component = mount(
			<Provider store={store}>
				<SidebarTabs sidebarId={'cell-not-id'}
					sidebarName={SidebarName.INPUTS}
				/>
			</Provider>
		);
		expect(component.isEmptyRender()).toBe(true);
		const component2 = mount(
			<Provider store={store}>
				<SidebarTabs sidebarId={'cell-not-id'}
					//eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					sidebarName={'haha'}
				/>
			</Provider>
		);
		expect(component2.isEmptyRender()).toBe(true);
	});
});
