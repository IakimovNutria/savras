import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlowProvider,
	useNodesState,
	Node, useEdgesState, Connection
} from 'reactflow';
import CellNode from '../cell-node/cell-node';
import './graph.css';
import {CellNodeInfo} from '../../types/cell-node-info';
import {moveCell} from '../../store/pipeline-reducer/actions';
import {useAppDispatch} from '../../hooks';
import {GraphEdge} from '../../types/graph-edge';
import AddEdgeModal from '../add-edge-modal/add-edge-modal';
import CustomEdge from '../custom-edge/custom-edge';
import 'reactflow/dist/style.css';


const nodeTypes = {
	cell: CellNode
};

const edgeTypes = {
	custom: CustomEdge
};

type GraphProps = {
	cellNodes: CellNodeInfo[];
	graphEdges: GraphEdge[];
};

const Graph = ({cellNodes, graphEdges}: GraphProps) => {
	const [nodes, setNodes, onNodesChange] = useNodesState(cellNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);
	const [showModal, setShowModal] = useState(false);
	const [connection, setConnection] = useState({parentCellId: '', childCellId: ''});
	const dispatch = useAppDispatch();
	useEffect(() => setEdges(graphEdges), [graphEdges]);
	useEffect(() => setNodes(cellNodes), [cellNodes]);
	const stopHandler = useCallback((event: React.MouseEvent, node: Node) => {
		dispatch(moveCell({ cellId: node.id, x: node.position.x, y: node.position.y }));
	}, [dispatch]);
	const onConnect = useCallback((params: Connection) => {
		if (params.source && params.target) {
			setConnection({parentCellId: params.source, childCellId: params.target});
			setShowModal(true);
		}
	}, [dispatch]);

	return (
		<>
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
					edgeTypes={edgeTypes}
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
			{
				showModal && <AddEdgeModal setShowModal={setShowModal}
					{...connection} />
			}
		</>
	);
};

export default Graph;
