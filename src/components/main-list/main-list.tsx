import React from 'react';
import './main-list.css';

type MainListProps<T> = {
	items: T[];
	keyExtractor: (item: T) => React.Key;
	renderItem: (item: T) => JSX.Element;
	title: string;
}


function MainList<T> ({items, keyExtractor, renderItem, title}: MainListProps<T>): JSX.Element {
	return (
		<div className="main-list">
			<ul className="main-list__items">
				{
					items.map((item, index) => (
						<li className={`main-list__item ${index % 2 === 0 ? 'main-list__item_even' : 'main-list__item_odd'}`}
							key={keyExtractor(item)}>
							{renderItem(item)}
						</li>
					))
				}
			</ul>
			<h3 className="main-list__title">{title}</h3>
		</div>
	);
}

export default MainList;
