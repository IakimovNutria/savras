import React from 'react';
import {mount} from 'enzyme';
import Chart from './chart';
import ApexChart from 'react-apexcharts';
import ResizeObserver from 'resize-observer-polyfill';

describe('chart tests', () => {
	it('should render correctly', () => {
		global.ResizeObserver = ResizeObserver;
		const component = mount(
			<Chart timeSeries={{['123']: [{datetime: '1', value: 1}, {datetime: '2', value: 2}, {datetime: '3', value: 3}]}}
				cellId={'id'}
			/>
		);
		expect(component.find(ApexChart).length).toBe(1);
	});

	it('should not render chart if there is no graph', () => {
		global.ResizeObserver = ResizeObserver;
		const component = mount(
			<Chart timeSeries={{}}
				cellId={'id'}
			/>
		);
		expect(component.find(ApexChart).length).toBe(0);
		expect(component.html().includes('There\'s no graph')).toBe(true);
	});

	it('should render error if datetime not the same', () => {
		global.ResizeObserver = ResizeObserver;
		const component = mount(
			<Chart timeSeries={{['123']: [{datetime: '1', value: 1}], ['124']: [{datetime: '2', value: 1}]}}
				cellId={'id'}
			/>
		);
		expect(component.find(ApexChart).length).toBe(0);
		expect(component.html().includes('Graph series dates are not the same')).toBe(true);
	});
});
