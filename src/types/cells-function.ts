type CellFunction = {
    function: string;
    name: string;
    group: string;
    inputs: string[];
    input_params: {[key: string]: string};
};

export default CellFunction;
