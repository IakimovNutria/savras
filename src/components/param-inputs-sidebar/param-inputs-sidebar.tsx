import React, {FormEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import ParamInputInfo from '../../types/param-input-info';
import { getFunctions } from '../../store/main-reducer/selectors';
import ParamInput from '../param-input/param-input';
import {updateParams} from '../../store/pipeline-reducer/actions';
import {Sidebar} from '../sidebar/sidebar';
import {ParamType} from '../../enums/param-type';
import CellInfo from '../../types/cell-info';

type InputParamsProps = {
    cell: CellInfo;
};

function ParamInputsSidebar({cell}: InputParamsProps): JSX.Element | null {
	const dispatch = useAppDispatch();
	const functionsInfo = useAppSelector(getFunctions);
	const functionInfo = useMemo(() => functionsInfo.find((elem) => (elem.function === cell?.function)),
		[functionsInfo, cell?.function]);
	const params = useMemo(() => {
		if (!cell) {
			return [];
		}
		const newParams = [];
		if (functionInfo !== undefined) {
			for (const key in functionInfo.input_params) {
				const fieldType = functionInfo.input_params[key];
				const toPush: ParamInputInfo = {
					name: key,
					type: '',
					pattern: '*',
					value: cell.input_params[key],
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
	}, [functionInfo, cell?.input_params]);

	const [localParams, setLocalParams] = useState(params);
	useEffect(() => setLocalParams(params), [cell.id]);

	const submitParamsHandler = useCallback(async (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const toUpdate: {field: string, value: string | boolean | number}[] = [];
		localParams.forEach((param) => {
			const notNumberValue = param.value;
			const paramType = functionInfo ? functionInfo.input_params[param.name] : 0;
			const value = (paramType === ParamType.INT || paramType === ParamType.FLOAT) ? Number(notNumberValue) : notNumberValue;
			toUpdate.push({ field: param.name, value });
		});
		dispatch(updateParams({ cellId: cell.id, params: toUpdate }));
	}, [cell.id, dispatch, localParams]);
	return (
		<Sidebar items={localParams}
			keyExtractor={(param) => cell.id + param.name}
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
