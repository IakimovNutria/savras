import React from 'react';
import {mount} from 'enzyme';
import NotFound from './not-found';

describe('not-found tests', () => {
	it('should render correctly', () => {
		const component = mount(
			<NotFound />
		);
		expect(component.html().includes('Not found')).toBe(true);
	});
});
