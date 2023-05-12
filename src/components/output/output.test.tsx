import React from 'react';
import {mount} from 'enzyme';
import Output from './output';
import {FormField} from '../form-field/form-field';

describe('output tests', () => {
	it('should render correctly', () => {
		const component = mount(
			<Output outputName={'output-name'}
				outputValue={'output-value'}
				setOutputs={() => {/*do nothing*/}}
			/>
		);
		expect(component.html().includes('output-name')).toBe(true);
		expect(component.html().includes('output-value')).toBe(true);
		expect(component.find(FormField).length).toBe(1);
	});
});
