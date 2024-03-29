import CellInfo from '../types/cell-info';
import { CellStatus } from '../enums/cell-status';

function getCellStatus(cell: CellInfo, defaultStatus: string): string {
	const { error } = cell;
	const haveOutputs = Object.keys(cell.outputs).some((key) => cell.outputs[key]);
	if (error && error !== '') {
		return 'error';
	}
	if (haveOutputs) {
		return CellStatus.SUCCEED;
	}
	return defaultStatus;
}

export default getCellStatus;
