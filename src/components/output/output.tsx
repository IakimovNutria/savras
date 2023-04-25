import React, {Dispatch, SetStateAction, useCallback} from 'react';

type CellOutputProps = {
	output: string;
	outputName: string;
	setOutputs: Dispatch<SetStateAction<{[p: string]: string | null}>>
}

function Output({output, outputName, setOutputs}: CellOutputProps): JSX.Element {
	const updateOutputNameHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const fieldName = event.currentTarget.id;
		const { value } = event.target;
		setOutputs((state) => ({...state, [fieldName]: value}));
	}, []);

	return (
		<span className="output">
			<span className="output__name">
				{output}:
			</span>
			<input
				value={outputName}
				className="output__text-input"
				type="text"
				id={output}
				onChange={updateOutputNameHandler}
			/>
		</span>
	);
}

export default Output;
