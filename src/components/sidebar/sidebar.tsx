import React, {FormEvent, useContext} from 'react';
import './sidebar.css';
import {Button} from '../button/button';
import {CloseSidebarContext} from '../../contexts/close-sidebar-context';

type SidebarProps<T> = {
	items: T[];
	keyExtractor: (item: T) => React.Key;
	renderItem: (item: T) => JSX.Element;
	title: string;
	buttonTitle: string;
	buttonClickHandler: (event: FormEvent<HTMLButtonElement>) => void;
}

export function Sidebar<T>({title, keyExtractor, renderItem, items, buttonTitle, buttonClickHandler}: SidebarProps<T>): JSX.Element {
	const closeSidebar = useContext(CloseSidebarContext);

	return (
		<div className="sidebar">
			<h2 className="sidebar__title">{title}</h2>
			<ul className="sidebar__list">
				{
					items.map((item) => (
						<li key={keyExtractor(item)}
							className="sidebar__list-item">
							{renderItem(item)}
						</li>
					))
				}
			</ul>
			<div className="sidebar__button-container">
				<Button className="sidebar__button"
					onClick={buttonClickHandler}
					hasShadow
				>
					{buttonTitle}
				</Button>
			</div>
			<button onClick={closeSidebar}
				className="sidebar__back-button"/>
		</div>
	);
}
