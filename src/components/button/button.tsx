import React, {useMemo} from 'react';
import './button.css';
import cn from 'classnames';
import {ButtonSize} from '../../enums/button-size';
import {Link} from 'react-router-dom';


type ButtonProps = {
	children?: JSX.Element | string;
	hasShadow?: boolean;
	size: ButtonSize;
	plainRight?: boolean;
	plainLeft?: boolean;
	linkTo?: string;
	[key: string]: unknown;
};

export const Button: React.FC<ButtonProps> = ({children, hasShadow, size, plainLeft, plainRight, linkTo, ...buttonProps}: ButtonProps) => {
	const className = useMemo(() => cn('button', hasShadow && 'button_has-shadow', `button_${size}`,
		plainLeft && 'button_plain-left', plainRight && 'button_plain-right'), [hasShadow, size, plainRight, plainLeft]);
	return (
		linkTo ? (
			<Link className={className}
				to={linkTo}
				{...buttonProps}
			>
				{children}
			</Link>
		) : (
			<button className={className}
				{...buttonProps}
			>
				{children}
			</button>
		)
	);
};
