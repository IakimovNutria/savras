import {SidebarName} from '../../enums/sidebar-name';
import FileInputsSidebar from '../file-inputs-sidebar/file-inputs-sidebar';
import ParamInputsSidebar from '../param-inputs-sidebar/param-inputs-sidebar';
import OutputsSidebar from '../outputs-sidebar/outputs-sidebar';
import React from 'react';

type SidebarTabsProps = {
	sidebarId: string | null;
	sidebarName: SidebarName | null;
}

export function SidebarTabs({sidebarId, sidebarName}: SidebarTabsProps): JSX.Element | null {
	if (sidebarId === null) {
		return null;
	}
	switch (sidebarName) {
	case SidebarName.INPUTS: {
		return <FileInputsSidebar cellId={sidebarId}/>;
	}
	case SidebarName.PARAMS: {
		return <ParamInputsSidebar cellId={sidebarId}/>;
	}
	case SidebarName.OUTPUTS: {
		return <OutputsSidebar cellId={sidebarId}/>;
	}
	default: {
		return null;
	}
	}
}
