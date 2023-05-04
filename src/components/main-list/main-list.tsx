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
					items.map((item) => (
						<li className="main-list__item"
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
