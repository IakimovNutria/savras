import React from 'react';
import './main-list-item-name.css';

type MainListItemNameProps = {
	name: string;
}

export function MainListItemName({name}: MainListItemNameProps) {
	return <span className="main-list-item-name">{name}</span>;
}
