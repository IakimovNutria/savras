export enum CellStatus {
    NOT_EXECUTED = 'not executed',
    SUCCEED = 'succeed',
    IN_PROGRESS = 'in progress',
    HAS_ERROR = 'error',
    SAVING = 'saving...',
    SAVED = 'saved',
    NOT_SAVED = 'error on save'
}

export const CellStatusStyle = {
	[CellStatus.NOT_EXECUTED]: { color: '#707070' },
	[CellStatus.HAS_ERROR]: { color: 'red' },
	[CellStatus.IN_PROGRESS]: { color: '#4682B4' },
	[CellStatus.SUCCEED]: { color: 'green' },
	[CellStatus.SAVING]: { color: '#4682B4' },
	[CellStatus.SAVED]: { color: 'green' },
	[CellStatus.NOT_SAVED]: { color: 'red' },
};
