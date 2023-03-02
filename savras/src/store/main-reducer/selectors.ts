import {State} from '../../types/state';
import {ReducerName} from "../../enums/reducer-name";
import FileInfo from "../../types/file-info";
import ShortPipelineInfo from "../../types/short-pipeline-info";
import CellFunction from "../../types/cells-function";

export const getFiles = (state: State): FileInfo[] => state[ReducerName.Main].files;
export const getUserPipelines = (state: State): ShortPipelineInfo[] => state[ReducerName.Main].userPipelines;
export const getSharedPipelines = (state: State): ShortPipelineInfo[] => state[ReducerName.Main].sharedPipelines;
export const getFunctions = (state: State): CellFunction[] => state[ReducerName.Main].functions;
export const getFilesColumns  = (state: State): {[path: string]: string[]} => state[ReducerName.Main].filesColumns;