import React, {MouseEventHandler} from 'react';
import './button.css';
import cn from 'classnames';


type ButtonProps = {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	type?: 'button' | 'submit' | 'reset';
	className?: string;
	children?: JSX.Element | string;
	hasShadow?: boolean;
};

export const Button: React.FC<ButtonProps> = ({onClick, type, children, hasShadow, className}: ButtonProps) => {
	return (
		<button className={cn('button', hasShadow && 'button_has-shadow', className)}
			onClick={onClick}
			type={type}>{children}
		</button>
	);
};
