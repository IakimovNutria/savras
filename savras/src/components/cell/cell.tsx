import {Navigate} from 'react-router-dom';
import CellInfo from "../../types/cellInfo";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {useAppSelector} from "../../hooks";


type CellProps = {
    cellInfo: CellInfo;
};


function Cell({cellInfo}: CellProps): JSX.Element {
    const functionsInfo = useAppSelector((state) => state.cellsFunctions);
    const eventHandler = (event: DraggableEvent, data: DraggableData) => {
        console.log('Event Type', event.type);
        console.log({event, data});
    }
    return (
        <Draggable handle=".handle" onStop={eventHandler} defaultPosition={{x: cellInfo.x, y: cellInfo.y}}>
            <div className="block">
                <div style={{backgroundColor: "green", width: "30%"}} className="handle">
                    Drag from here
                </div>
                <div>This readme is really dragging on...</div>
            </div>
        </Draggable>);
}

export default Cell;
