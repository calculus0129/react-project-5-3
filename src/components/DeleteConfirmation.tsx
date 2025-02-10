import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const TIMER_INTERVAL = 1000;
const TIMER_DURATION = 3000;

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onConfirm, onCancel }) => {
  // const timerRef = useRef<number | null>(null);
  const [countDown, setCountDown] = useState(TIMER_DURATION / TIMER_INTERVAL);

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
    }, TIMER_INTERVAL);
    return () => clearTimeout(timer);
  }, [countDown, onConfirm]);

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
      <ProgressBar duration={TIMER_DURATION} />
    </div>
  );
};
export default DeleteConfirmation;
