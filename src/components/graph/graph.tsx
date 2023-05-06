import React, {useCallback, useEffect} from 'react';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlowProvider,
	useNodesState,
	Node
} from 'react-flow-renderer';
import CellNode from '../cell-node/cell-node';
import './graph.css';
import {CellNodeInfo} from '../../types/cell-node-info';
import {moveCell} from '../../store/pipeline-reducer/actions';
import {useAppDispatch} from '../../hooks';


const nodeTypes = {
	cell: CellNode
};

type GraphProps = {
	cellNodes: CellNodeInfo[];
};

const Graph = ({cellNodes}: GraphProps) => {
	const [nodes, setNodes, onNodesChange] = useNodesState(cellNodes);
	useEffect(() => {setNodes(cellNodes);console.log(nodes);}, [cellNodes]);
	const dispatch = useAppDispatch();
	const stopHandler = useCallback((event: React.MouseEvent, node: Node) => {
		dispatch(moveCell({ cellId: node.id, x: node.position.x, y: node.position.y }));
	}, [dispatch]);
	return (
		<ReactFlowProvider>
			<ReactFlow
				nodes={nodes}
				onNodesChange={onNodesChange}
				onNodeDragStop={stopHandler}
				elementsSelectable={true}
				selectNodesOnDrag={true}
				nodeTypes={nodeTypes}
			>
				<Background variant={BackgroundVariant.Lines}
					gap={24}
					size={1}
				/>
				<Controls />
				<MiniMap
					nodeColor={'red'}
				/>
			</ReactFlow>
		</ReactFlowProvider>
	);
};

export default Graph;
