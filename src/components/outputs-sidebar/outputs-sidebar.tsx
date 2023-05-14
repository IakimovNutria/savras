import React, {FormEvent, useCallback, useMemo, useState} from 'react';
import Output from '../output/output';
import {saveFile} from '../../store/main-reducer/actions';
import {useAppDispatch} from '../../hooks';
import {Sidebar} from '../sidebar/sidebar';
import CellInfo from '../../types/cell-info';

type OutputsParams = {
    cell: CellInfo;
};

function OutputsSidebar({cell}: OutputsParams): JSX.Element | null {
	const dispatch = useAppDispatch();
	const initialLocalOutputs = useMemo(() => {
		const value: {[key: string]: string | null} = {};
		for (const key in cell.outputs) {
			value[key] = null;
		}
		return value;
	}, [cell.outputs]);
	const [localOutputs, setLocalOutputs] = useState(initialLocalOutputs);
	const saveFilesHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!cell.outputs) {
			return;
		}
		for (const key in localOutputs) {
			const value = localOutputs[key];
			if (value !== '' && value != null) {
				const path = cell.outputs[key];
				if (path !== null) {
					dispatch(saveFile({ path, name: value }));
				}
			}
		}
	}, [dispatch, localOutputs, cell.outputs]);
	const outputNames: string[] = useMemo(() => {
		const newOutputNames = [];
		for (const key in cell.outputs) {
			if (cell.outputs[key] !== null) {
				newOutputNames.push(key);
			}
		}
		return newOutputNames;
	}, [cell.outputs]);
	const keyExtractor = useCallback((output: string) => cell.id + output, [cell.id]);
	const renderItem = useCallback((output: string) => (
		<Output outputName={output}
			outputValue={localOutputs[output] ?? ''}
			setOutputs={setLocalOutputs}
		/>
	), [localOutputs, setLocalOutputs]);

	return localOutputs && (
		<Sidebar items={outputNames}
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			title="Outputs"
			buttonTitle="Save Output Files"
			buttonClickHandler={saveFilesHandler}
		/>
	);
}

export default OutputsSidebar;
