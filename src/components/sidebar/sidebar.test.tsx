import React from 'react';
import {mount} from 'enzyme';
import {Sidebar} from './sidebar';

describe('main-list tests', () => {
	const mockItems = [42, 37, 1961, 2007];
	const mockKeyExtractor = (num: number) => num + 1;
	const mockRenderItem = (num: number) => <div>{num}</div>;
	const mockTitle = 'numberstest';
	it('should render correctly', () => {
		const component = mount(
			<Sidebar title={mockTitle}
				items={mockItems}
				buttonClickHandler={() => {/*do nothing*/}}
				keyExtractor={mockKeyExtractor}
				renderItem={mockRenderItem}
				buttonTitle={'button-title'}
			/>
		);
		mockItems.forEach((item) => {
			expect(component.html().includes(item.toString())).toBe(true);
		});
		expect(component.html().includes(mockTitle)).toBe(true);
		expect(component.html().includes('button-title')).toBe(true);
		expect(component.find('ul').length).toBe(1);
		expect(component.find('li').length).toBe(4);
	});
});
