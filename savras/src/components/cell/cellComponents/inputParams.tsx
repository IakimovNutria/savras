import React, {ChangeEvent, FormEvent, useContext, useState} from "react";
import {useAppSelector} from "../../../hooks";
import Input from "../cellTypes/input";
import CellContext from "../cellContext";
import ParamInput from "../cellTypes/paramInput";


type InputParamsProps = {
    inputParams: {},
    cellId: string,
    functionName: string,
    updateParamHandler: (event: ChangeEvent<HTMLInputElement>) => void,
    submitParamsHandler: (event: FormEvent<HTMLButtonElement>) => void
};

function InputParams({cellId, functionName, updateParamHandler, submitParamsHandler, inputParams}: InputParamsProps): JSX.Element {
    const functionsInfo = useAppSelector((state) => state.cellsFunctions);
    const functionInfo = functionsInfo.find((elem) => (elem.function === functionName));
    const cellParams = useContext(CellContext);

    const params: ParamInput[] = [];

    if (functionInfo !== undefined) {
        for (const key in functionInfo.input_params) {
            const fieldType = functionInfo.input_params[key as keyof typeof functionInfo.input_params];
            const toPush: ParamInput = {
                name: key,
                type: "",
                pattern: "*",
                value: inputParams[key as keyof typeof inputParams]
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
            params.push(toPush);
        }
    }


    return (
        <React.Fragment>
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
                                        {
                                            param.type === "checkbox" ?
                                                // @ts-ignore
                                                (<input checked={cellParams.inputParams[param.name] === null ? false : cellParams.inputParams[param.name]}
                                                        id={param.name} type={param.type}
                                                        className="cell-inside-block-element"
                                                        style={{transform: "translate(9px, 0)"}}
                                                        pattern={param.pattern} onChange={updateParamHandler} />
                                                ) :
                                                // @ts-ignore
                                                (<input value={cellParams.inputParams[param.name] === null ? "" : cellParams.inputParams[param.name]}
                                                        id={param.name} type={param.type}
                                                        className="text-input cell-inside-block-element"
                                                        style={{height: "35px", width: "80px"}}
                                                        pattern={param.pattern}
                                                        onChange={updateParamHandler}/>)
                                        }
                                    </li>
                                )
                            }
                        )
                    }
                </ul>
                <button className="block-button cell-button cell-inside-button" onClick={submitParamsHandler}>Save params</button>
            </div>
        </React.Fragment>);
}

export default InputParams;