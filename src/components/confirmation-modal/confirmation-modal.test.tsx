import {mount} from 'enzyme';
import React from 'react';
import ConfirmationModal from './confirmation-modal';
import Modal from '../modal/modal';
import {Button} from '../button/button';

describe('confirmation modal tests', () => {
	it('should render correctly', () => {
		const onConfirm = jest.fn();
		const component = mount(
			<ConfirmationModal title={'title'}
				text={'text'}
				onConfirm={onConfirm}
				onNotConfirm={onConfirm}
			/>
		);
		expect(component.html().includes('title')).toBe(true);
		expect(component.html().includes('text')).toBe(true);
		expect(component.find(Modal).length).toBe(1);
		expect(component.find(Button).length).toBe(2);
	});
	it('buttons should work', () => {
		const onConfirm = jest.fn();
		const onNotConfirm = jest.fn();
		const component = mount(
			<ConfirmationModal title={'title'}
				text={'text'}
				onConfirm={onConfirm}
				onNotConfirm={onNotConfirm}
			/>
		);
		component.find('button').forEach((button) => button.simulate('click'));
		expect(onConfirm).toHaveBeenCalled();
		expect(onNotConfirm).toHaveBeenCalled();
	});
});
