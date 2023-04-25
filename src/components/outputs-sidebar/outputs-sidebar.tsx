import React, {FormEvent, useCallback, useMemo, useState} from 'react';
import Output from '../output/output';
import {saveFile} from '../../store/main-reducer/actions';
import {useAppDispatch} from '../../hooks';
import {Sidebar} from '../sidebar/sidebar';

type OutputsParams = {
    cellId: string;
    outputs: {[key: string]: string | null};
};

function OutputsSidebar({cellId, outputs}: OutputsParams): JSX.Element {
	const dispatch = useAppDispatch();
	const [localOutputs, setLocalOutputs] = useState(outputs);
	const saveFilesHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		for (const key in localOutputs) {
			const value = localOutputs[key];
			if (value !== '' && value != null) {
				const path = localOutputs[key];
				if (path !== null) {
					dispatch(saveFile({ path, name: value }));
				}
			}
		}
	}, [dispatch, localOutputs]);
	const outputNames: string[] = useMemo(() => {
		const newOutputNames = [];
		for (const key in outputs) {
			if (outputs[key] !== null) {
				newOutputNames.push(key);
			}
		}
		return newOutputNames;
	}, [outputs]);

	return (
		<Sidebar items={outputNames}
			keyExtractor={(output) => cellId + output}
			renderItem={(output) => (
				<Output output={output}
					outputName={outputs[output] ?? ''}
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
