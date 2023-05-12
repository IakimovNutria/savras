import React from 'react';
import './form-field.css';

type FormFieldProps = {
	name: string;
	input: JSX.Element;
};

export function FormField({name, input}: FormFieldProps): JSX.Element {
	return (
		<span className="form-field">
			<span className="form-field__name">
				{name}:
			</span>
			{input}
		</span>
	);
}
