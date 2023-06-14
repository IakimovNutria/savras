import {CellStatus} from '../enums/cell-status';

type CellInfo = {
    id: string;
    function: string;
    inputs: Record<string, {path: string | null, data_column: string | null}[] | null>;
    outputs: Record<string, string[] | null>;
    input_params: Record<string, string | number | boolean>;
    output_params: Record<string, string>;
    error: string;
    x: number;
    y: number;
    status: CellStatus;
};

export default CellInfo;
