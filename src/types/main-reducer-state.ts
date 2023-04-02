import ShortPipelineInfo from './short-pipeline-info';
import CellsFunction from './cells-function';
import FileInfo from './file-info';

type MainReducerState = {
    files: FileInfo[];
    userPipelines: ShortPipelineInfo[];
    sharedPipelines: ShortPipelineInfo[];
    functions: CellsFunction[];
    filesColumns: {[path: string]: string[]};
}

export default MainReducerState;
