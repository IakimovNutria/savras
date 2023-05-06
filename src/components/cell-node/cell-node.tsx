import React from 'react';
import {CellNodeData} from '../../types/cell-node-data';
import Cell from '../cell/cell';


export default function CellNode({data}: CellNodeData): JSX.Element {
	return (
		<Cell cellInfo={data.cellInfo} />
	);
}
