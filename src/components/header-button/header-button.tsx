import React from 'react';
import './header-button.css';


type HeaderButtonProps = {
	children?: JSX.Element | string;
	[key: string]: unknown;
};

export const HeaderButton: React.FC<HeaderButtonProps> = ({children, ...buttonProps}: HeaderButtonProps) => {
	return (
		<button className="header-button"
			{...buttonProps}
		>
			{children}
		</button>
	);
};
