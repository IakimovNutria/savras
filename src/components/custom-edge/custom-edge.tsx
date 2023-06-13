import React, {useMemo, useState} from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import ChangeEdgeModal from '../change-edge-modal/change-edge-modal';
import {useAppSelector} from '../../hooks';
import {getEdges} from '../../store/pipeline-reducer/selectors';


export default function CustomEdge({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
	source,
	target
}: EdgeProps) {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const [showModal, setShowModal] = useState(false);
	const edges = useAppSelector(getEdges);
	const edge = useMemo(() => edges?.find((edge) => edge.child_cell === target && edge.parent_cell === source), [edges]);
	const nowChosenOutput = edge?.parent_output;
	const nowChosenInput = edge?.child_input;
	return (
		<>
			<BaseEdge path={edgePath}
				markerEnd={markerEnd}
				style={style}
			/>
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 12,
						pointerEvents: 'all',
					}}
					className="nodrag nopan"
				>
					<div onClick={(e) => {e.stopPropagation(); setShowModal(true);}}>
						<div>{nowChosenOutput}</div>
						<div>{nowChosenInput}</div>
					</div>
				</div>
			</EdgeLabelRenderer>
			{
				showModal && <ChangeEdgeModal setShowModal={setShowModal}
					childCellId={target}
					parentCellId={source}
					nowChosenInput={nowChosenInput}
					nowChosenOutput={nowChosenOutput}
				/>
			}
		</>
	);
}
