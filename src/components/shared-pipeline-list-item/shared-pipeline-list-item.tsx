import ShortPipelineInfo from '../../types/short-pipeline-info';
import {Button} from '../button/button';
import {ButtonSize} from '../../enums/button-size';
import {forkPipeline} from '../../store/main-reducer/actions';
import React, {useCallback} from 'react';
import {useAppDispatch} from '../../hooks';
import {MainListItemName} from '../main-list-item-name/main-list-item-name';

type SharedPipelineListItemProps = {
	pipeline: ShortPipelineInfo;
}

export function SharedPipelineListItem({pipeline}: SharedPipelineListItemProps): JSX.Element {
	const dispatch = useAppDispatch();
	const forkPipelineHandler = useCallback(() => dispatch(forkPipeline({ pipelineId: pipeline.id })),
		[pipeline.id, dispatch]);
	return (
		<>
			<Button id={pipeline.id}
				linkTo={`/pipeline/${pipeline.id}`}
				size={ButtonSize.SMALL}
			>
				Open
			</Button>
			<MainListItemName name={pipeline.name} />
			<Button id={pipeline.id}
				size={ButtonSize.SMALL}
				onClick={forkPipelineHandler}
			>
				Fork
			</Button>
		</>
	);
}
