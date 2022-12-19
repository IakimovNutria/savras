import React, {useContext} from "react";
import CellParams from "./cellTypes/cellParams";


const defaultValue: CellParams = {
    inputs: {},
    inputParams: {},
    inputsPath: {},
    outputs: {},
    selectedInputsColumn: {}
};
const CellContext = React.createContext(defaultValue)

export default CellContext;
