import React from 'react';
import {mount} from 'enzyme';
import Modal from './modal';

describe('modal tests', () => {
	it('should render correctly', () => {
		const mockClose = jest.fn();
		const component = mount(
			<Modal closeModal={mockClose}
				title={'4242'}>
				testtest
			</Modal>
		);
		expect(component.html().includes('testtest')).toBe(true);
		expect(component.html().includes('4242')).toBe(true);
	});

	it('should close on click', () => {
		const mockClose = jest.fn();
		const component = mount(
			<Modal closeModal={mockClose}
				title={'4242'}>
				testtest
			</Modal>
		);
		component.simulate('click');
		expect(mockClose).toHaveBeenCalled();
	});

	it('should not close on body click', () => {
		const mockClose = jest.fn();
		const component = mount(
			<Modal closeModal={mockClose}
				title={'4242'}>
				testtest
			</Modal>
		);
		component.find('.modal__content').simulate('click');
		expect(mockClose).toHaveBeenCalledTimes(0);
	});
});
