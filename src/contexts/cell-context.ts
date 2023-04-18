import React, { createContext } from 'react';
import CellParams from '../types/cell-params';

type CellContextType = {
	cellParams: CellParams;
	setCellParams: React.Dispatch<React.SetStateAction<CellParams>>;
}

const defaultValue: CellContextType = {
	cellParams: {
		inputsPath: {},
		inputParams: {},
		outputs: {},
		selectedInputsColumn: {},
		graphInputs: {},
		graphOutputs: {},
	},
	setCellParams: () => null
};

export const CellContext = createContext(defaultValue as CellContextType);
