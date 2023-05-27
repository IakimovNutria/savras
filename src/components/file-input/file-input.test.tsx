import React from 'react';
import FileInput from './file-input';
import {mount} from 'enzyme';
import {mockStore} from '../../test-utils';
import {ReducerName} from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import {Provider} from 'react-redux';
import {FormField} from '../form-field/form-field';

describe('file-input tests', () => {
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

	it('should render correctly when input not chosen', () => {
		const component = mount(
			<Provider store={store}>
				<FileInput input={{name: 'input-name', fileName: null, path: null, inputColumn: null}}
					setInputsColumns={() => {/*do nothing*/}}
					setInputsPaths={() => {/*do nothing*/}}
				/>
			</Provider>
		);
		expect(component.html().includes('input-name')).toBe(true);
		expect(component.html().includes('file-name')).toBe(true);
		expect(component.html().includes('choose file')).toBe(true);
		expect(component.html().includes('choose column')).toBe(false);
		expect(component.find('select').length).toBe(1);
		expect(component.find(FormField).length).toBe(1);
	});

	it('should render correctly when input chosen', () => {
		const component = mount(
			<Provider store={store}>
				<FileInput input={{name: 'input-name', fileName: 'file-name', path: 'file-path', inputColumn: null}}
					setInputsColumns={() => {/*do nothing*/}}
					setInputsPaths={() => {/*do nothing*/}}
				/>
			</Provider>
		);
		expect(component.html().includes('input-name')).toBe(true);
		expect(component.html().includes('file-name')).toBe(true);
		expect(component.html().includes('choose file')).toBe(false);
		expect(component.html().includes('choose column')).toBe(true);
		expect(component.html().includes('column1')).toBe(true);
		expect(component.html().includes('column2')).toBe(true);
		expect(component.find('select').length).toBe(2);
		expect(component.find(FormField).length).toBe(1);
	});
});
