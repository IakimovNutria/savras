import React, {useCallback, useContext} from 'react';
import ParamInput from '../../types/param-input';
import {CellContext} from '../../contexts/cell-context';

type CellParamInputProps = {
	param: ParamInput;
	checked: boolean;
	value: string | number | boolean;
};

function CellParamInput({param, checked, value}: CellParamInputProps): JSX.Element {
	const {setCellParams} = useContext(CellContext);
	const updateParamHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.type === 'checkbox' ? event.target.checked : event.target.value;
		setCellParams((state) => ({ ...state, inputParams: { ...state.inputParams, [fieldName]: value } }));
	}, []);
	return (
		<>
			<span>
				{param.name}:
			</span>
			<input
				checked={checked}
				value={value?.toString()}
				id={param.name}
				type={param.type}
				className={param.type !== 'checkbox' ? 'cell__text-input' : ''}
				pattern={param.pattern}
				onChange={updateParamHandler}
			/>
		</>
	);
}

export default CellParamInput;
