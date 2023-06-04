import {ParamType} from '../enums/param-type';

type CellFunction = {
    function: string;
    name: string;
    group: string;
    inputs: Record<string, boolean>;
    outputs: Record<string, boolean>;
    input_params: Record<string, ParamType>;
    doc: string;
};

export default CellFunction;
