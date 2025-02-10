import { useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

export interface ResultModalHandle {
  open: () => void;
  close: () => void;
}

const Modal: React.FC<
  React.PropsWithChildren<{ ref: React.Ref<ResultModalHandle> }>
> = ({ ref, children }) => {
  const dialog = useRef<HTMLDialogElement | null>(null);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current?.showModal();
      },
      close: () => {
        dialog.current?.close();
      },
    };
  });

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById("modal")!,
  );
};

export default Modal;
