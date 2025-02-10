import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// export interface ResultModalHandle {
//   open: () => void;
//   close: () => void;
// }

const Modal: React.FC<
  React.PropsWithChildren<{
    // ref: React.Ref<ResultModalHandle>
    modalOpen: boolean;
  }>
> = ({ modalOpen, children }) => {
  const dialog = useRef<HTMLDialogElement | null>(null);

  // Backdrops are shown only if the showModal() is called.

  useEffect(() => {
    if (modalOpen) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [modalOpen]);

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {modalOpen ? children : null}
    </dialog>,
    document.getElementById("modal")!,
  );
};

export default Modal;
