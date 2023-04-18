import React, {
	FormEvent, useCallback, useContext, useMemo,
} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import ParamInput from '../../types/param-input';
import { getFunctions } from '../../store/main-reducer/selectors';
import CellParamInput from '../cell-param-input/cell-param-input';
import {updateParams} from '../../store/pipeline-reducer/actions';
import {CellContext} from '../../contexts/cell-context';

type InputParamsProps = {
    inputParams: {[key: string]: string | number | boolean},
    cellId: string,
    functionName: string
};

function CellParamInputs({cellId, functionName, inputParams}: InputParamsProps): JSX.Element {
	const {cellParams} = useContext(CellContext);
	const dispatch = useAppDispatch();
	const functionsInfo = useAppSelector(getFunctions);
	const functionInfo = functionsInfo.find((elem) => (elem.function === functionName));
	const params = useMemo(() => {
		const newParams = [];
		if (functionInfo !== undefined) {
			for (const key in functionInfo.input_params) {
				const fieldType = functionInfo.input_params[key];
				const toPush: ParamInput = {
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
		return newParams;
	}, [functionInfo, inputParams]);
	const inputsChecked: {[key: string]: boolean} = useMemo(() => {
		const newInputsChecked: {[key: string]: boolean} = {};
		params.forEach((param) => {
			if (param.type === 'checkbox' && typeof cellParams.inputParams[param.name] === 'boolean') {
				newInputsChecked[param.name] = Boolean(cellParams.inputParams[param.name]);
			}
		});
		return newInputsChecked;
	}, [params, cellParams]);

	const inputsValues: {[key: string]: string | number | boolean} = useMemo(() => {
		const newInputsValues: {[key: string]: string | number | boolean} = {};
		params.forEach((param) => {
			if ((cellParams.inputParams[param.name] !== null) && (param.type !== 'checkbox' || typeof cellParams.inputParams[param.name] !== 'boolean')) {
				newInputsValues[param.name] = cellParams.inputParams[param.name];
			}
		});
		return newInputsValues;
	}, [params, cellParams]);

	const submitParamsHandler = useCallback(async (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const toUpdate: {field: string, value: string | boolean | number}[] = [];
		for (const key in cellParams.inputParams) {
			const notNumberValue = cellParams.inputParams[key];
			const paramType = functionInfo ? functionInfo.input_params[key] : 0;
			const value = (paramType === 'int' || paramType === 'float') ? Number(notNumberValue) : notNumberValue;
			toUpdate.push({ field: key, value });
		}
		dispatch(updateParams({ cellId: cellId, params: toUpdate }));
	}, [cellParams, cellId, dispatch]);

	return (
		<div className="cell__params">
			<h3>Params</h3>
			<ul className="cell__param-items">
				{
					params.map((param) => (
						<li className="cell__param-item"
							key={cellId + param.name}>
							<CellParamInput param={param}
								checked={inputsChecked[param.name]}
								value={inputsValues[param.name]}
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
