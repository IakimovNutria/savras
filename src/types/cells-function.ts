import {ParamType} from '../enums/param-type';

type CellFunction = {
    function: string;
    name: string;
    group: string;
    inputs: string[];
    input_params: {[key: string]: ParamType};
    doc: string;
};

export default CellFunction;
