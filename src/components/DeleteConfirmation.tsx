import { useCallback, useEffect, useRef, useState } from "react";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onConfirm, onCancel }) => {
  // const timerRef = useRef<number | null>(null);
  const [countDown, setCountDown] = useState(3);

  useEffect(() => {
    console.log("INTERVAL SET!");
    const timer = setTimeout(() => {
      console.log("countDown:", countDown);
      setCountDown((prev) => prev - 1);
      // Because the setCountDown is asynchronous, we need to use the previous value.
      if (countDown <= 1) {
        clearTimeout(timer);
        onConfirm();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countDown]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes ({countDown})
        </button>
      </div>
    </div>
  );
};
export default DeleteConfirmation;
