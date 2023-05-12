import React from 'react';
import {mount} from 'enzyme';
import PrivateRoute from './private-route';
import {MemoryRouter, Navigate} from 'react-router-dom';
import Loading from '../loading/loading';

describe('private-route tests', () => {
	it('should navigate when has access', () => {
		const component = mount(
			<MemoryRouter>
				<PrivateRoute hasAccess
					navigateTo={<Loading />}
				/>
			</MemoryRouter>
		);
		expect(component.find(Loading).length).toBe(1);
	});

	it('should navigate to sign-in when has no access', () => {
		const component = mount(
			<MemoryRouter>
				<PrivateRoute hasAccess={false}
					navigateTo={<Loading />}
				/>
			</MemoryRouter>
		);
		expect(component.find(Navigate).length).toBe(1);
	});
});
