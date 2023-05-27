import React, {FormEvent, useCallback, useContext} from 'react';
import './sidebar.css';
import {Button} from '../button/button';
import {ButtonSize} from '../../enums/button-size';
import {PipelineContext} from '../../contexts/pipeline-context';

type SidebarProps<T> = {
	items: T[];
	keyExtractor: (item: T) => React.Key;
	renderItem: (item: T) => JSX.Element;
	title: string;
	buttonTitle: string;
	buttonClickHandler: (event: FormEvent<HTMLButtonElement>) => void;
}

export function Sidebar<T>({title, keyExtractor, renderItem, items, buttonTitle, buttonClickHandler}: SidebarProps<T>): JSX.Element {
	const {setSidebar} = useContext(PipelineContext);
	const closeSidebar = useCallback(() => setSidebar && setSidebar({id: null, name: null}), [setSidebar]);

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
				<Button onClick={buttonClickHandler}
					hasShadow
					size={ButtonSize.SMALL}
				>
					{buttonTitle}
				</Button>
			</div>
			<button onClick={closeSidebar}
				className="sidebar__back-button"
			/>
		</div>
	);
}
