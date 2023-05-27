import React, {Dispatch, SetStateAction} from 'react';
import {SidebarName} from '../enums/sidebar-name';

type PipelineContextValue = {
	pipelineId: string;
	canEdit: boolean;
	setSidebar: Dispatch<SetStateAction<{id: string | null, name: SidebarName | null}>> | null;
}

export const PipelineContext = React.createContext({pipelineId: '', canEdit: false, setSidebar: null} as PipelineContextValue);
