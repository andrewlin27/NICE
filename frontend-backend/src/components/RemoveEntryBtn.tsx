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
            <Button variant="primary" onClick={() => setIsOpen(true)}>Remove Entry</Button>
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
