import {CellStatusStyle} from '../enums/cell-status';

export const getStatusStyle = (status: string) => {
	if (Object.prototype.hasOwnProperty.call(CellStatusStyle, status)) {
		return CellStatusStyle[status as keyof typeof CellStatusStyle];
	}
	return { color: 'red' };
};
