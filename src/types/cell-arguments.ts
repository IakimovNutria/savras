type CellArguments = {
    inputParams: {[param: string]: string | number | boolean};
    outputs: {[outputName: string]: string | null};
    inputsPath: {[inputName: string]: string | null};
    selectedInputsColumn: {[inputColumn: string]: string | null};
    graphInputs: {[name: string]: boolean};
    graphOutputs: {[name: string]: boolean};
};

export default CellArguments;
