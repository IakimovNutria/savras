type CellInfo = {
    id: string;
    function: string;
    inputs: {[inputName: string]: string | null};
    data_columns: {[dataColumnName: string]: string | null};
    outputs: {[outputName: string]: string | null};
    input_params: {[param: string]: any};
    output_params: {[outputParam: string]: any};
    error: string;
    x: number;
    y: number;
};

export default CellInfo;
