import {SidebarName} from '../../enums/sidebar-name';
import FileInputsSidebar from '../file-inputs-sidebar/file-inputs-sidebar';
import ParamInputsSidebar from '../param-inputs-sidebar/param-inputs-sidebar';
import OutputsSidebar from '../outputs-sidebar/outputs-sidebar';
import React, {useMemo} from 'react';
import {useAppSelector} from '../../hooks';
import {getCurrentPipeline} from '../../store/pipeline-reducer/selectors';

type SidebarTabsProps = {
	sidebarId: string | null;
	sidebarName: SidebarName | null;
}

export function SidebarTabs({sidebarId, sidebarName}: SidebarTabsProps): JSX.Element | null {
	const currentPipeline = useAppSelector(getCurrentPipeline);
	const cell = useMemo(() => currentPipeline?.cells.find((cell) => cell.id === sidebarId),
		[currentPipeline, sidebarId]);
	if (sidebarId === null || !cell) {
		return null;
	}
	switch (sidebarName) {
	case SidebarName.INPUTS: {
		return <FileInputsSidebar cell={cell}/>;
	}
	case SidebarName.PARAMS: {
		return <ParamInputsSidebar cell={cell}/>;
	}
	case SidebarName.OUTPUTS: {
		return <OutputsSidebar cell={cell}/>;
	}
	default: {
		return null;
	}
	}
}
