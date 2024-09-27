import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newTodo: string;
  setNewTodo: (value: string) => void;
}

// Define the Modal component as a regular function
const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  newTodo,
  setNewTodo,
}: ModalProps) => {
  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add a New Task</h2>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter task name"
        />
        <div className="modal-actions">
          <button className="add" onClick={onSubmit}>
            Add Task
          </button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
