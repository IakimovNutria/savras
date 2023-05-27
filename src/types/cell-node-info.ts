import {CellNodeData} from './cell-node-data';

export type CellNodeInfo = {
	id: string,
	type: 'cell',
	position: { x: number, y: number }
} & CellNodeData
