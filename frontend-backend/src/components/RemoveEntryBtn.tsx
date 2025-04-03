'use client';

import { exit } from 'process';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react';

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
            <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-600 hover:scale-105">Remove Entry</button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h2 className="text-2xl mb-4 text-black">Confirm Removal</h2>
                        <p className="mb-4">
                            Are you sure you want to remove {first_name} {last_name}?
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mr-6 text-gray-500 transition duration-300 ease-in-out hover:text-red-400 hover:scale-105"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600 hover:scale-105"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RemoveEntryBtn;
