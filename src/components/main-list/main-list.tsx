import React from 'react';

interface MainListProps<T> {
	items: T[];
	getItemKey: (item: T) => React.Key;
	renderItem: (item: T) => JSX.Element;
}


function MainList<T> ({items, getItemKey, renderItem}: MainListProps<T>): JSX.Element {
	return (
		<ul className="main__list">
			{
				items.map((item, index) => (
					<li className={`main__list-item ${index % 2 === 0 ? 'main__list-item_even' : 'main__list-item_odd'}`}
						key={getItemKey(item)}>
						{renderItem(item)}
					</li>
				))
			}
		</ul>
	);
}

export default MainList;
