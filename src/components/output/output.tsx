import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {FormField} from '../form-field/form-field';

type CellOutputProps = {
	outputName: string;
	outputValue: string;
	setOutputs: Dispatch<SetStateAction<{[p: string]: string | null}>>
}

function Output({outputName, outputValue, setOutputs}: CellOutputProps): JSX.Element {
	const updateOutputNameHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const { value } = event.target;
		setOutputs((state) => ({...state, [fieldName]: value}));
	}, []);

	return (
		<FormField name={outputName}
			input={
				<input
					value={outputValue}
					className="output__text-input"
					type="text"
					id={outputName}
					onChange={updateOutputNameHandler}
				/>
			}
		/>
	);
}

export default Output;
