// components/Modal.tsx
'use client';

import React from 'react';
import Button from './Button';

interface ModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-green-600 mb-4">Success</h2>
        <p className="text-black mb-4">{message}</p>
        <Button variant="primary" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default SuccessModal;
