import IconButton from '@/components/buttons/IconButton';
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <dialog
      ref={modalRef}
      className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      onCancel={handleClose}
    >
      <div className="modal-box">
        {/* Close button */}
        <form method="dialog">
          <IconButton icon="close" onClick={handleClose} className="absolute right-2 top-2" />
        </form>
        {children}
      </div>
      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default Modal;
