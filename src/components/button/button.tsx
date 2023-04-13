import React, {MouseEventHandler} from 'react';
import './button.css';

type ButtonProps = {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	type?: 'button' | 'submit' | 'reset';
	children?: JSX.Element | string;
	hasShadow?: boolean;
	width: number;
	height: number;
	borderRadius: string;
};

export const Button: React.FC<ButtonProps> = ({onClick, type, children, hasShadow, width, height, borderRadius}: ButtonProps) => {
	return (
		<button className={`button ${hasShadow ? 'button_has-shadow' : ''}`}
			style={{width: width, height: height, borderRadius: borderRadius}}
			onClick={onClick}
			type={type}>{children}
		</button>
	);
};
