'use client';

import { exit } from 'process';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react';
import Button from './Button';
import FailedModal from './FailedModal';
import SuccessModal from './SuccessModal';
import ConfirmModal from './ConfirmModal';

interface RemoveEntryBtnProps {
    entryId: string;
    first_name: string;
    last_name: string;
}

const RemoveEntryBtn: React.FC<RemoveEntryBtnProps> = ({ entryId, first_name, last_name }) => {
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/deleteEntry`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entry_id: entryId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            setShowSuccessModal(true);
            setShowConfirmModal(false);
        } catch (error) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              setError('Failed to remove entry');
            }
          }
    };

    return (
        <div className='mt-4'>
            <Button variant="primary" onClick={() => setShowConfirmModal(true)} className="ml-4 flex items-center justify-center space-x-1">
                <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                </svg>
                <span>Delete Entry</span>
            </Button>
            {showConfirmModal && (
                <ConfirmModal
                message={`Are you sure you want to remove ${first_name} ${last_name}?`}
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={() => {
                  handleSubmit();
                }}
              />
            )}
            {showSuccessModal && (
                <SuccessModal
                    message="Entry removed successfully!"
                    onClose={() => {setShowSuccessModal(false)
                        router.push('/entry');
                    }

                    }
                />
            )}
            {error && (
                <FailedModal
                    message={error}
                    onClose={() => setError(null)}
                />
            )}
        </div>
    );
};

export default RemoveEntryBtn;
