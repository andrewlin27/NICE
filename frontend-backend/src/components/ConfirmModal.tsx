'use client';

import React from 'react';
import Button from './Button';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onCancel}>
      <div className="bg-white p-6 rounded-lg shadow-md w-80" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-red-600 mb-4">Warning!!</h2>
        <p className="text-black mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="danger" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
