import React from 'react';
import {mount} from 'enzyme';
import Loading from './loading';

describe('loading tests', () => {
	it('should render correctly', () => {
		const component = mount(
			<Loading />
		);
		expect(component.html().includes('Loading...')).toBe(true);
	});
});
