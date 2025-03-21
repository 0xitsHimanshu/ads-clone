// apps/web/components/Modal.tsx
import { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}