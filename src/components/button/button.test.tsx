import {Link} from 'react-router-dom';
import React from 'react';
import {mount, shallow} from 'enzyme';
import {Button} from './button';
import {ButtonSize} from '../../enums/button-size';

describe('button tests', () => {

	it('should render correctly', () => {
		const component = mount(
			<Button size={ButtonSize.SMALL}>
				testchild
			</Button>);
		expect(component.html().includes('testchild')).toBe(true);
	});

	it('classNames', () => {
		const component = mount(
			<Button size={ButtonSize.SMALL}
				hasShadow
				plainLeft
				plainRight
			/>
		);
		expect(component.find('button').get(0).props.className).toBe(`button button_has-shadow button_${ButtonSize.SMALL} button_plain-left button_plain-right`);
	});

	it('should render link when set linkTo', () => {
		const component = shallow(
			<Button size={ButtonSize.SMALL}
				linkTo={'/'}
			/>
		);
		expect(component.find(Link).length).toBe(1);
	});
});
