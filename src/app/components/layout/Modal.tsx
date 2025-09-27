import { useEffect } from "react";
import ReactModal from "react-modal";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    ReactModal.setAppElement(document.body);
  }, []);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-[#0f0f0f80] flex items-center justify-center z-80"
      className="flex flex-col  bg-background lg:border lg:border-gray p-4 lg:p-6 lg:rounded-2xl shadow-lg w-full mx-auto max-w-2xl 2xl:max-h-8/10 lg:h-fit text-sm"
      contentLabel="Modal"
    >
      {children}
    </ReactModal>
  );
}
