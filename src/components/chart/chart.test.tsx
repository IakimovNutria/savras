import React from 'react';
import {mount} from 'enzyme';
import Chart from './chart';
import ApexChart from 'react-apexcharts';
import ResizeObserver from 'resize-observer-polyfill';

describe('chart tests', () => {
	it('should render correctly', () => {
		global.ResizeObserver = ResizeObserver;
		const component = mount(
			<Chart timeSeries={[{datetime: '1', value: 1}, {datetime: '2', value: 2}, {datetime: '3', value: 3}]}
				name={'123'}
				width={100}
				height={100}
			/>
		);
		expect(component.find(ApexChart).length).toBe(1);
	});
});
