import React, {FormEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import ParamInputInfo from '../../types/param-input-info';
import { getFunctions } from '../../store/main-reducer/selectors';
import ParamInput from '../param-input/param-input';
import {updateParams} from '../../store/pipeline-reducer/actions';
import {Sidebar} from '../sidebar/sidebar';
import {ParamType} from '../../enums/param-type';
import {getCurrentPipeline} from '../../store/pipeline-reducer/selectors';

type InputParamsProps = {
    cellId: string
};

function ParamInputsSidebar({cellId}: InputParamsProps): JSX.Element | null {
	const dispatch = useAppDispatch();
	const functionsInfo = useAppSelector(getFunctions);
	const cell = useAppSelector(getCurrentPipeline)?.cells.find((cell) => cell.id === cellId);
	if (!cell) {
		return null;
	}
	const functionInfo = useMemo(() => functionsInfo.find((elem) => (elem.function === cell.function)),
		[functionsInfo, cell.function]);
	const inputParams = useMemo(() => cell.input_params, [cell.input_params]);
	const params = useMemo(() => {
		const newParams = [];
		if (functionInfo !== undefined) {
			for (const key in functionInfo.input_params) {
				const fieldType = functionInfo.input_params[key];
				const toPush: ParamInputInfo = {
					name: key,
					type: '',
					pattern: '*',
					value: inputParams[key],
				};
				if (fieldType === ParamType.BOOL) {
					toPush.type = 'checkbox';
					toPush.pattern = '';
					toPush.value = Boolean(toPush.value);
				} else if (fieldType === ParamType.STR) {
					toPush.type = 'text';
					if (toPush.value === null) {
						toPush.value = '';
					}
				} else if (fieldType === ParamType.INT) {
					toPush.type = 'number';
					toPush.pattern = '\\d*';
				} else if (fieldType === ParamType.FLOAT) {
					toPush.type = 'number';
					toPush.pattern = '*';
				}
				newParams.push(toPush);
			}
		}
		return newParams;
	}, [functionInfo, inputParams]);

	const [localParams, setLocalParams] = useState(params);
	useEffect(() => setLocalParams(params), [params]);

	const submitParamsHandler = useCallback(async (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const toUpdate: {field: string, value: string | boolean | number}[] = [];
		localParams.forEach((param) => {
			const notNumberValue = param.value;
			const paramType = functionInfo ? functionInfo.input_params[param.name] : 0;
			const value = (paramType === ParamType.INT || paramType === ParamType.FLOAT) ? Number(notNumberValue) : notNumberValue;
			toUpdate.push({ field: param.name, value });
		});
		dispatch(updateParams({ cellId: cellId, params: toUpdate }));
	}, [cellId, dispatch]);

	return (
		<Sidebar items={localParams}
			keyExtractor={(param) => cellId + param.name}
			renderItem={(param) => (
				<ParamInput param={param}
					setParams={setLocalParams}
				/>
			)}
			title="Params"
			buttonTitle="Save params"
			buttonClickHandler={submitParamsHandler}
		/>
	);
}

export default ParamInputsSidebar;
