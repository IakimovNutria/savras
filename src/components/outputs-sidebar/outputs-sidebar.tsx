import React, {FormEvent, useCallback, useMemo, useState} from 'react';
import Output from '../output/output';
import {saveFile} from '../../store/main-reducer/actions';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {Sidebar} from '../sidebar/sidebar';
import {getCurrentPipeline} from '../../store/pipeline-reducer/selectors';

type OutputsParams = {
    cellId: string;
};

function OutputsSidebar({cellId}: OutputsParams): JSX.Element | null {
	const dispatch = useAppDispatch();
	const outputsPaths = useAppSelector(getCurrentPipeline)?.cells.find((cell) => cell.id === cellId)?.outputs;
	if (!outputsPaths) {
		return null;
	}
	const initialLocalOutputs = useMemo(() => {
		const value: {[key: string]: string | null} = {};
		for (const key in outputsPaths) {
			value[key] = null;
		}
		return value;
	}, []);
	const [localOutputs, setLocalOutputs] = useState(initialLocalOutputs);
	const saveFilesHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		for (const key in localOutputs) {
			const value = localOutputs[key];
			if (value !== '' && value != null) {
				const path = outputsPaths[key];
				if (path !== null) {
					dispatch(saveFile({ path, name: value }));
				}
			}
		}
	}, [dispatch, localOutputs, outputsPaths]);
	const outputNames: string[] = useMemo(() => {
		const newOutputNames = [];
		for (const key in outputsPaths) {
			if (outputsPaths[key] !== null) {
				newOutputNames.push(key);
			}
		}
		return newOutputNames;
	}, [outputsPaths]);

	return localOutputs && (
		<Sidebar items={outputNames}
			keyExtractor={(output) => cellId + output}
			renderItem={(output) => (
				<Output output={output}
					outputName={localOutputs[output] ?? ''}
					setOutputs={setLocalOutputs}
				/>
			)}
			title="Outputs"
			buttonTitle="Save Output Files"
			buttonClickHandler={saveFilesHandler}
		/>
	);
}

export default OutputsSidebar;
