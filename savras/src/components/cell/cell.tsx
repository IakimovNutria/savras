import {Navigate} from 'react-router-dom';

type CellProps = {
    cellType: string;
};

function Cell(props: CellProps): JSX.Element {
    return <Navigate to={'/login'} />;
}

export default Cell;
