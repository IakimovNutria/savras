type CellInfo = {
    id: string;
    function: string;
    inputs: Record<string, string | null>;
    data_columns: Record<string, string | null>;
    outputs: Record<string, string | null>;
    input_params: Record<string, string | number | boolean>;
    output_params: Record<string, string>;
    error: string;
    x: number;
    y: number;
};

export default CellInfo;
