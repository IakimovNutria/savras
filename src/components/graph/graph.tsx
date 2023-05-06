import React, {useCallback, useEffect} from 'react';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlowProvider,
	useNodesState,
	Node, useEdgesState, Connection
} from 'react-flow-renderer';
import CellNode from '../cell-node/cell-node';
import './graph.css';
import {CellNodeInfo} from '../../types/cell-node-info';
import {addEdge, moveCell} from '../../store/pipeline-reducer/actions';
import {useAppDispatch} from '../../hooks';
import {GraphEdge} from '../../types/graph-edge';


const nodeTypes = {
	cell: CellNode
};

type GraphProps = {
	cellNodes: CellNodeInfo[];
	graphEdges: GraphEdge[];
};

const Graph = ({cellNodes, graphEdges}: GraphProps) => {
	const [nodes, setNodes, onNodesChange] = useNodesState(cellNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);
	const dispatch = useAppDispatch();
	useEffect(() => setEdges(graphEdges), [graphEdges]);
	useEffect(() => setNodes(cellNodes), [cellNodes]);
	const stopHandler = useCallback((event: React.MouseEvent, node: Node) => {
		dispatch(moveCell({ cellId: node.id, x: node.position.x, y: node.position.y }));
	}, [dispatch]);
	const onConnect = useCallback((params: Connection) => {
		if (params.source && params.target) {
			//const newEdge = {id: `${params.source}__${params.target}`, source: params.source, target: params.target};
			dispatch(addEdge({cellIdFrom: params.source, cellIdTo: params.target}));
		}
	}, [dispatch]);

	return (
		<ReactFlowProvider>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onNodeDragStop={stopHandler}
				onConnect={onConnect}
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
					nodeColor={'#FFDD2D'}
				/>
			</ReactFlow>
		</ReactFlowProvider>
	);
};

export default Graph;
