import {createPipeline} from '../../store/main-reducer/actions';
import React, {ChangeEvent, FormEvent, useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getSharedPipelines, getUserPipelines} from '../../store/main-reducer/selectors';
import MainList from '../main-list/main-list';
import {Button} from '../button/button';
import './pipelines-section.css';
import {ButtonSize} from '../../enums/button-size';
import {OwnPipelineListItem} from '../own-pipeline-list-item/own-pipeline-list-item';
import {SharedPipelineListItem} from '../shared-pipeline-list-item/shared-pipeline-list-item';
import ShortPipelineInfo from '../../types/short-pipeline-info';

export default function PipelinesSection(): JSX.Element {
	const dispatch = useAppDispatch();
	const userPipelines = useAppSelector(getUserPipelines);
	const sharedPipelines = useAppSelector(getSharedPipelines);
	const [newPipelineName, setNewPipelineName] = useState('');
	const createPipelineHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		dispatch(createPipeline({ name: newPipelineName }));
		setNewPipelineName('');
	}, [newPipelineName, dispatch]);
	const updateNewPipelineName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setNewPipelineName(event.target.value);
	}, []);
	const pipelineKeyExtractor = useCallback((pipeline: ShortPipelineInfo) => pipeline.id, []);
	const renderOwnPipelineItem = useCallback((pipeline: ShortPipelineInfo) => <OwnPipelineListItem pipeline={pipeline}/>,
		[]);
	const renderSharedPipelineItem = useCallback((pipeline: ShortPipelineInfo) => <SharedPipelineListItem pipeline={pipeline} />,
		[]);

	return (
		<>
			<section className="pipelines-section">
				<h2 style={{ display: 'none' }}>pipelines</h2>
				<h3 className="pipelines-section__title">Create new pipeline</h3>
				<form className="pipelines-section__form"
					onSubmit={createPipelineHandler}>
					<input
						required
						className="pipelines-section__input"
						placeholder="Name"
						value={newPipelineName}
						onChange={updateNewPipelineName}
					/>
					<Button type="submit"
						size={ButtonSize.MEDIUM}
						plainLeft
					>
						Create
					</Button>
				</form>
				<MainList items={userPipelines}
					keyExtractor={pipelineKeyExtractor}
					renderItem={renderOwnPipelineItem}
					title="My pipelines"
				/>
				<MainList items={sharedPipelines}
					keyExtractor={pipelineKeyExtractor}
					renderItem={renderSharedPipelineItem}
					title="Shared pipelines"
				/>
			</section>
		</>
	);
}
