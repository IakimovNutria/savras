import React, {
	ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { useAppSelector } from '../../hooks';
import CellParamInput from '../../types/cell-param-input';
import CellArguments from '../../types/cell-arguments';
import { getFunctions } from '../../store/main-reducer/selectors';

type InputParamsProps = {
    inputParams: {[key: string]: string | number | boolean},
    cellId: string,
    functionName: string,
    updateParamHandler: (event: ChangeEvent<HTMLInputElement>) => void,
    submitParamsHandler: (event: FormEvent<HTMLButtonElement>) => void,
    cellParams: CellArguments
};

function CellParamInputs({cellId, functionName, updateParamHandler, submitParamsHandler, inputParams, cellParams}: InputParamsProps): JSX.Element {
	const functionsInfo = useAppSelector(getFunctions);
	const functionInfo = functionsInfo.find((elem) => (elem.function === functionName));

	const defaultParams: CellParamInput[] = [];
	const [params, setParams] = useState(defaultParams);
	const defaultInputsChecked: {[key: string]: boolean} = {};
	const [inputsChecked, setInputsChecked] = useState(defaultInputsChecked);
	const defaultInputsValues: {[key: string]: string | number | boolean} = {};
	const [inputsValues, setInputsValues] = useState(defaultInputsValues);

	useEffect(() => {
		const newParams = [];
		if (functionInfo !== undefined) {
			for (const key in functionInfo.input_params) {
				const fieldType = functionInfo.input_params[key];
				const toPush: CellParamInput = {
					name: key,
					type: '',
					pattern: '*',
					value: inputParams[key],
				};
				if (fieldType === 'bool') {
					toPush.type = 'checkbox';
					toPush.pattern = '';
					if (toPush.value === null) {
						toPush.value = false;
					}
				} else if (fieldType === 'str') {
					toPush.type = 'text';
					if (toPush.value === null) {
						toPush.value = '';
					}
				} else if (fieldType === 'int') {
					toPush.type = 'number';
					toPush.pattern = '\\d*';
					if (toPush.value === null) {
						toPush.value = 0;
					}
				} else if (fieldType === 'float') {
					toPush.type = 'number';
					toPush.pattern = '*';
					if (toPush.value === null) {
						toPush.value = 0;
					}
				}
				newParams.push(toPush);
			}
		}
		setParams(newParams);
	}, [functionInfo, inputParams]);

	useEffect(() => {
		params.forEach((param) => {
			if (param.type === 'checkbox' && typeof cellParams.inputParams[param.name] === 'boolean') {
				setInputsChecked((state) => ({ ...state, [param.name]: Boolean(cellParams.inputParams[param.name]) }));
			} else if (cellParams.inputParams[param.name] !== null) {
				setInputsValues((state) => ({ ...state, [param.name]: cellParams.inputParams[param.name] }));
			}
		});
	}, [cellParams, params]);

	return (
		<div className="cell__params">
			<h3>Params</h3>
			<ul className="cell__param-items">
				{
					params.map((param) => (
						<li className="cell__param-item"
							key={cellId + param.name}>
							<span>
								{param.name}
    :
							</span>
							<input
								checked={inputsChecked[param.name]}
								value={inputsValues[param.name].toString()}
								id={param.name}
								type={param.type}
								className={param.type !== 'checkbox' ? 'cell__text-input' : ''}
								pattern={param.pattern}
								onChange={updateParamHandler}
							/>
						</li>
					))
				}
			</ul>
			<button className="cell__save-button"
				onClick={submitParamsHandler}>Save params</button>
		</div>);
}

export default CellParamInputs;
