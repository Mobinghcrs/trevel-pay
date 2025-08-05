
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white border border-gray-200/80 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;