import React from 'react';
import './button.css';
import cn from 'classnames';


type ButtonProps = {
	className?: string;
	children?: JSX.Element | string;
	hasShadow?: boolean;
	[key: string]: unknown;
};

export const Button: React.FC<ButtonProps> = ({children, hasShadow, className, ...buttonProps}: ButtonProps) => {
	return (
		<button className={cn('button', hasShadow && 'button_has-shadow', className)}
			{...buttonProps}
		>
			{children}
		</button>
	);
};
