import React, {Dispatch, SetStateAction, useCallback, useMemo} from 'react';
import ParamInputInfo from '../../types/param-input-info';
import './param-input.css';
import cn from 'classnames';

type CellParamInputProps = {
	param: ParamInputInfo;
	setParams: Dispatch<SetStateAction<ParamInputInfo[]>>;
};

function ParamInput({param, setParams}: CellParamInputProps): JSX.Element {
	const updateParamHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fieldName = event.currentTarget.id;
		const value = event.currentTarget.type === 'checkbox' ? event.target.checked : event.target.value;
		setParams((state) => state.map((elem) => {
			if (elem.name === fieldName) {
				return {...elem, value};
			}
			return elem;
		}));
	}, [setParams]);

	return (
		<span className="param-input">
			<span className="param-input__name">
				{param.name}:
			</span>
			<input
				checked={typeof param.value === 'boolean' ? param.value : undefined}
				value={typeof param.value !== 'boolean' ? param.value : undefined}
				id={param.name}
				type={param.type}
				className={param.type !== 'checkbox' ? 'param-input__text-input' : ''}
				pattern={param.pattern}
				onChange={updateParamHandler}
			/>
		</span>
	);
}

export default ParamInput;
