import React from 'react';
import {mount} from 'enzyme';
import NoAccess from './no-access';

describe('no-access tests', () => {
	it('should render correctly', () => {
		const component = mount(
			<NoAccess />
		);
		expect(component.html().includes('No access')).toBe(true);
	});
});
