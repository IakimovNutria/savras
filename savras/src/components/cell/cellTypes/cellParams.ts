import Input from "./input";
import Output from "./output";


type CellParams = {
    inputParams: {[param: string]: any};
    outputs: {[outputName: string]: string | null};
    inputsPath: {[inputName: string]: string | null};
    selectedInputsColumn: {[inputColumn: string]: string | null};
    graphInputs: string[];
    graphOutputs: string[];
};

export default CellParams;