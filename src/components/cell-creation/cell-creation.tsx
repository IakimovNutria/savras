import React, {MouseEvent, useCallback, useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createCell } from '../../store/api-actions';
import { getFunctions } from '../../store/main-reducer/selectors';
import './cell-creation.css';

type CreateButtonsProps = {
    pipelineId: string;
};

function CellCreation({ pipelineId }: CreateButtonsProps) : JSX.Element {
	const functions = useAppSelector(getFunctions);
	const dispatch = useAppDispatch();
	const [currentGroup, setCurrentGroup] = useState(functions[0].group);

	const handleCreate = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(createCell({ pipelineId, functionName: event.currentTarget.id }));
	}, [pipelineId, dispatch]);

	return (
		<section className="cell-creation">
			{
				<ul className="cell-creation__func-types">
					{
						[...new Set(functions.map((func) => func.group))].map((group) => (
							<li key={group}>
								<button
									onClick={() => setCurrentGroup(group)}
									className={`cell-creation__func-type ${group === currentGroup ? 'cell-creation__func-type_active' : ''}`}
								>
									{group}
								</button>
							</li>))
					}
				</ul>
			}
			{
				(<ul className="cell-creation__create-buttons">
					{
						functions.filter((func) => func.group === currentGroup).map((func) => (
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
				</ul>)
			}
		</section>);
}

export default CellCreation;
