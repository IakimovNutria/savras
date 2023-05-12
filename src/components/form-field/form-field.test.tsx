import React from 'react';
import {mount} from 'enzyme';
import {FormField} from './form-field';

describe('form-field tests', () => {
	it('should render correctly', () => {
		const component = mount(
			<FormField name={'test42'}
				input={<div>testetst</div>}
			/>
		);
		expect(component.html().includes('test42')).toBe(true);
		expect(component.html().includes('testetst')).toBe(true);
	});
});
