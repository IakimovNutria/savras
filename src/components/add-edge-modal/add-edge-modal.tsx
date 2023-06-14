import Modal from '../modal/modal';
import React, {useCallback, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {Button} from '../button/button';
import './add-edge-modal.css';
import {ButtonSize} from '../../enums/button-size';
import {getCurrentPipeline} from '../../store/pipeline-reducer/selectors';
import {addEdge} from '../../store/pipeline-reducer/actions';

type AddEdgeModalProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    childCellId: string;
    parentCellId: string;
}

export default function AddEdgeModal({setShowModal, parentCellId, childCellId}: AddEdgeModalProps): JSX.Element {
	const dispatch = useAppDispatch();
	const cells = useAppSelector(getCurrentPipeline)?.cells;
	const childCell = useMemo(() => cells?.find((cell) => cell.id === childCellId), [childCellId]);
	const parentCell = useMemo(() => cells?.find((cell) => cell.id === parentCellId), [parentCellId]);
	const childCellInputs = useMemo(() => childCell?.inputs ? Object.keys(childCell?.inputs) : [], [childCell?.inputs]);
	const parentCellOutputs = useMemo(() => parentCell?.outputs ? Object.keys(parentCell?.outputs) : [], [parentCell?.outputs]);
	const [chosenOutput, setChosenOutput] = useState<undefined | string>(undefined);
	const [chosenInput, setChosenInput] = useState<undefined | string>(undefined);
	const updateInputHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const name = (selectedIndex !== -1) ? options[selectedIndex].dataset.name : null;
		setChosenInput(name || undefined);
	}, [setChosenInput]);
	const updateOutputHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		const select = event.target;
		const { options } = select;
		const { selectedIndex } = options;
		const name = (selectedIndex !== -1) ? options[selectedIndex].dataset.name : null;
		setChosenOutput(name || undefined);
	}, [setChosenOutput]);
	const closeModal = useCallback(() => setShowModal(false),
		[setShowModal]);
	const confirmHandle = useCallback(() => {
		if (chosenInput && chosenOutput) {
			dispatch(addEdge({parent_cell: parentCellId, child_cell: childCellId, parent_output: chosenOutput, child_input: chosenInput}));
			closeModal();
		}
	}, [dispatch, parentCellId, childCellId, chosenOutput, chosenInput, closeModal]);

	return (
		<Modal title="Add edge"
			closeModal={closeModal}>
			<div className="add-edge-modal">
				<div className="add-edge-modal__head-text">
                    Choose output and input
				</div>
				<div className="add-edge-modal__selects">
					<div className="add-edge-modal__select">
						<span className="add-edge-modal__text">output</span>
						<select value={chosenOutput ?? 'choose output'}
							onChange={updateOutputHandler}
						>
							{chosenOutput || <option>choose output</option>}
							{
								parentCellOutputs.map((output) =>
									<option key={output}
										data-name={output}>{output}</option>
								)
							}
						</select>
					</div>
					<div className="add-edge-modal__select">
						<span>input</span>
						<select value={chosenInput ?? 'choose input'}
							onChange={updateInputHandler}
						>
							{chosenInput || <option>choose input</option>}
							{
								childCellInputs.map((input) =>
									<option key={input}
										data-name={input}>{input}</option>
								)
							}
						</select>
					</div>
				</div>
				<div className="add-edge-modal__buttons">
					<Button size={ButtonSize.MEDIUM}
						onClick={confirmHandle}
						disabled={!(chosenInput && chosenOutput)}
					>
                        Confirm
					</Button>
					<Button onClick={closeModal}
						hasShadow
						size={ButtonSize.MEDIUM}
					>
                        Exit
					</Button>
				</div>
			</div>
		</Modal>
	);
}
