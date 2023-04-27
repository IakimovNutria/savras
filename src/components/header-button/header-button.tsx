import React, {useMemo} from 'react';
import './header-button.css';
import {Link} from 'react-router-dom';
import cs from 'classnames';

type HeaderButtonProps = {
	children?: JSX.Element | string;
	icon?: JSX.Element;
	linkTo?: string;
	withoutLeftBorder?: boolean;
	withoutRightBorder?: boolean;
	[key: string]: unknown;
};

export const HeaderButton: React.FC<HeaderButtonProps> = ({children, icon, linkTo, withoutLeftBorder, withoutRightBorder, ...buttonProps}: HeaderButtonProps) => {
	const className = useMemo(() =>
		cs(['header-button', withoutLeftBorder && 'header-button_without-left', withoutRightBorder && 'header-button_without-right']),
	[withoutRightBorder, withoutLeftBorder]);
	return (
		linkTo ? (
			<Link className={className}
				to={linkTo}
				{...buttonProps}>
				{children}
				{icon}
			</Link>
		) : (
			<button className={className}
				{...buttonProps}
			>
				{children}
				{icon}
			</button>
		)
	);
};
