import React, {MouseEvent, useCallback, useMemo, useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createCell } from '../../store/pipeline-reducer/actions';
import { getFunctions } from '../../store/main-reducer/selectors';
import './cell-creation.css';
import cn from 'classnames';

type CreateButtonsProps = {
	pipelineId: string;
	changeVisible: () => void;
};

function CellCreation({ pipelineId, changeVisible }: CreateButtonsProps) : JSX.Element {
	const functions = useAppSelector(getFunctions);
	const dispatch = useAppDispatch();
	const [currentGroup, setCurrentGroup] = useState(functions.length !== 0 ? functions[0].group : '');

	const handleCreate = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(createCell({ pipelineId, functionName: event.currentTarget.id }));
		changeVisible();
	}, [pipelineId, dispatch]);
	const groups = useMemo(() => [...new Set(functions.map((func) => func.group))],
		[functions]);
	const groupFunctions = useMemo(() => functions.filter((func) => func.group === currentGroup),
		[functions, currentGroup]);

	return (
		<section className="cell-creation">
			<ul className="cell-creation__func-types">
				{
					groups.map((group) => (
						<li key={group}>
							<button
								onClick={() => setCurrentGroup(group)}
								className={cn('cell-creation__func-type', group === currentGroup && 'cell-creation__func-type_active')}
							>
								{group}
							</button>
						</li>))
				}
			</ul>
			<ul className="cell-creation__create-buttons">
				{
					groupFunctions.map((func) => (
						<li key={func.function}>
							<button
								id={func.function}
								onClick={handleCreate}
								className="cell-creation__create-button"
							>
								{func.name}
							</button>
						</li>
					))
				}
			</ul>
		</section>
	);
}

export default CellCreation;
