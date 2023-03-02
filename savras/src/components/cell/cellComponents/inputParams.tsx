import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useAppSelector} from "../../../hooks";
import ParamInput from "../cellTypes/paramInput";
import CellParams from "../cellTypes/cellParams";
import {getFunctions} from "../../../store/main-reducer/selectors";


type InputParamsProps = {
    inputParams: {[key: string]: any},
    cellId: string,
    functionName: string,
    updateParamHandler: (event: ChangeEvent<HTMLInputElement>) => void,
    submitParamsHandler: (event: FormEvent<HTMLButtonElement>) => void,
    cellParams: CellParams
};

function InputParams({cellId, functionName, updateParamHandler, submitParamsHandler, inputParams, cellParams}: InputParamsProps): JSX.Element {
    const functionsInfo = useAppSelector(getFunctions);
    const functionInfo = functionsInfo.find((elem) => (elem.function === functionName));

    const defaultParams: ParamInput[] = [];
    const [params, setParams] = useState(defaultParams);
    const defaultInputsChecked: {[key: string]: boolean} = {};
    const [inputsChecked, setInputsChecked] = useState(defaultInputsChecked);
    const defaultInputsValues: {[key: string]: any} = {};
    const [inputsValues, setInputsValues] = useState(defaultInputsValues);

    useEffect(() => {
        const newParams = [];
        if (functionInfo !== undefined) {
            for (const key in functionInfo.input_params) {
                const fieldType = functionInfo.input_params[key];
                const toPush: ParamInput = {
                    name: key,
                    type: "",
                    pattern: "*",
                    value: inputParams[key]
                };
                if (fieldType === "bool") {
                    toPush.type = "checkbox";
                    toPush.pattern = '';
                    if (toPush.value === null) {
                        toPush.value = false;
                    }
                } else if (fieldType === "str") {
                    toPush.type = "text";
                    if (toPush.value === null) {
                        toPush.value = "";
                    }
                } else if (fieldType === "int") {
                    toPush.type = "number";
                    toPush.pattern = "\\d*";
                    if (toPush.value === null) {
                        toPush.value = 0;
                    }
                } else if (fieldType === "float") {
                    toPush.type = "number";
                    toPush.pattern = "*";
                    if (toPush.value === null) {
                        toPush.value = 0;
                    }
                }
                newParams.push(toPush);
            }
        }
        setParams(newParams);
    }, [functionInfo, inputParams]);

    useEffect(() => {
        params.forEach((param) => {
           if (param.type === "checkbox") {
               setInputsChecked((state) => {return {...state, [param.name]: cellParams.inputParams[param.name]}});
           } else {
               if (cellParams.inputParams[param.name] !== null) {
                   setInputsValues((state) => {
                       return {...state, [param.name]: cellParams.inputParams[param.name]}
                   });
               }
           }
        });
    }, [cellParams, params]);

    return (
        <div className="cell-inside-block row-elements">
            <h3 className="cell-inside-block-element">Params</h3>
            <ul className="row-elements cell-inside-ul">
                {
                    params.map((param) => {
                            return (
                                <li className="row-elements"
                                    key={cellId + param.name}>
                                    <h3 className="cell-inside-block-element"
                                        style={param.type === "checkbox" ? {transform: "translate(9px, 0)"} : {}}>
                                        {param.name}:
                                    </h3>
                                    <input checked={inputsChecked[param.name]}
                                           value={inputsValues[param.name]}
                                           id={param.name} type={param.type}
                                           className={`cell-inside-block-element ${param.type !== "checkbox" ? "text-input" : ""}`}
                                           style={param.type === "checkbox" ? {transform: "translate(9px, 0)"} : {height: "35px", width: "80px"}}
                                           pattern={param.pattern} onChange={updateParamHandler}
                                    />
                                </li>
                            )
                        }
                    )
                }
            </ul>
            <button className="block-button cell-inside-button" onClick={submitParamsHandler}>Save params</button>
        </div>);
}

export default InputParams;
