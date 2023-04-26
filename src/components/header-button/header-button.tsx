import React from 'react';
import './header-button.css';
import {Link} from 'react-router-dom';


type HeaderButtonProps = {
	children?: JSX.Element | string;
	icon?: JSX.Element;
	linkTo?: string;
	[key: string]: unknown;
};

export const HeaderButton: React.FC<HeaderButtonProps> = ({children, icon, linkTo, ...buttonProps}: HeaderButtonProps) => {
	return (
		linkTo ? (
			<Link className="header-button"
				to={linkTo}
				{...buttonProps}>
				{children}
				{icon}
			</Link>
		) : (
			<button className="header-button"
				{...buttonProps}
			>
				{children}
				{icon}
			</button>
		)
	);
};
