import React from 'react';
import {CellNodeData} from '../../types/cell-node-data';
//import {Handle, Position} from 'react-flow-renderer';
import Cell from '../cell/cell';
import './cell-node.css';


export default function CellNode({data}: CellNodeData): JSX.Element {
	return (
		<>
			{/*<Handle type="target"
				position={Position.Top}
				id={data.cellInfo.id}
				className="cell-node__handle"
			/>*/}
			<Cell cellInfo={data.cellInfo} />
			{/*<Handle type="source"
				position={Position.Bottom}
				id={data.cellInfo.id}
				className="cell-node__handle"
			/>*/}
		</>
	);
}
