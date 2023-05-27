import {Link} from 'react-router-dom';
import React from 'react';
import {mount, shallow} from 'enzyme';
import {HeaderButton} from './header-button';

describe('header button tests', () => {

	it('should render correctly', () => {
		const component = mount(
			<HeaderButton>testchild</HeaderButton>
		);
		expect(component.html().includes('testchild')).toBe(true);
	});

	it('classNames', () => {
		const component = mount(
			<HeaderButton withoutLeftBorder
				withoutRightBorder
			/>
		);
		expect(component.find('button').get(0).props.className).toBe('header-button header-button_without-left header-button_without-right');
	});

	it('should render link when set linkTo', () => {
		const component = shallow(
			<HeaderButton linkTo={'/'}/>
		);
		expect(component.find(Link).length).toBe(1);
	});

	it('should render icon', () => {
		const component = mount(
			<HeaderButton icon={<div>testets42</div>}/>
		);
		expect(component.html().includes('testets42')).toBe(true);
	});
});
