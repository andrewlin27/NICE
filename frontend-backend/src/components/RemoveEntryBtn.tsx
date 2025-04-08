'use client';

import { exit } from 'process';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react';
import Button from './Button';

interface RemoveEntryBtnProps {
    entryId: string;
    first_name: string;
    last_name: string;
}

const RemoveEntryBtn: React.FC<RemoveEntryBtnProps> = ({ entryId, first_name, last_name }) => {
    const [isOpen, setIsOpen] = useState(false);
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

            alert('Entry removed successfully!');
            setIsOpen(false);
            router.push('/entry');
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <div className='mt-4'>
            <Button variant="primary" onClick={() => setIsOpen(true)} className="ml-4 flex items-center justify-center space-x-1">
                <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                </svg>
                <span>Delete Entry</span>
            </Button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h2 className="text-2xl mb-4 text-black">Confirm Removal</h2>
                        <p className="mb-4 text-[#FB0202] font-bold text-lg">
                            Are you sure you want to remove {first_name} {last_name}?
                        </p>
                        <div className="flex justify-end">
                            <Button variant="danger" className="mr-2" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button variant="secondary" onClick={handleSubmit}>Confirm</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RemoveEntryBtn;
