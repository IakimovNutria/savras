import React from 'react';
import {mount} from 'enzyme';
import {FormField} from '../form-field/form-field';
import ParamInput from './param-input';

describe('param-input tests', () => {
	it('should render correctly', () => {
		const component = mount(
			<ParamInput param={{name: 'param-name', value: false, type: 'checkbox'}}
				setParams={() => {/*do nothing*/}}
			/>
		);
		expect(component.html().includes('param-name')).toBe(true);
		expect(component.find(FormField).length).toBe(1);
	});
});
