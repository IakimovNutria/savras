import React from 'react';
import {mount} from 'enzyme';
import {MainListItemName} from './main-list-item-name';

describe('main-list-item-name tests', () => {
	it('should render correctly', () => {
		const component = mount(
			<MainListItemName name={'item-name'} />
		);
		expect(component.find('span').length).toBe(1);
		expect(component.html().includes('item-name')).toBe(true);
	});
});
