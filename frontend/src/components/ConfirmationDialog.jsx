import Modal from './Modal';
import Button from './Button';

// Used before every destructive action (deleting a student, course,
// etc.) so a misclick never silently deletes a record.
function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message, isConfirming = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-ink-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isConfirming}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isConfirming}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmationDialog;
