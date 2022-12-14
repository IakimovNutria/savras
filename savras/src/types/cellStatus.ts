export const CellStatus = {
    NOT_EXECUTED: 'not executed',
    EXECUTED: 'executed',
    IN_PROCESS: 'in process',
    HAS_ERROR: 'error',
};

export const CellStatusStyle = {
    [CellStatus.NOT_EXECUTED]: {color: "#707070"},
    [CellStatus.HAS_ERROR]: {color: "red"},
    [CellStatus.IN_PROCESS]: {color: "#4682B4"},
    [CellStatus.EXECUTED]: {color: "green"}
}
