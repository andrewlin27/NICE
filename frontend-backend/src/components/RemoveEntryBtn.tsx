'use client';

import React, { use, useState } from 'react';

const RemoveEntryBtn: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [entryId, setEntryId] = useState('');

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
            setEntryId('');
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-600 hover:scale-105">Remove Entry</button>
            {/* {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h2 className="text-2xl mb-4 text-black">Remove Entry</h2>
                        <div className="mb-2">
                            <label className="text-slate-800 block font-medium capitalize">
                                Entry ID:
                            </label>
                            <input
                                type="text"
                                name="entry_id"
                                value={entryId}
                                onChange={(e) => setEntryId(e.target.value)}
                                className="border p-2 w-full rounded text-slate-800"
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setIsOpen(false)} className="mr-2 text-gray-500 transition duration-300 ease-in-out hover:text-red-400 hover:scale-105">Cancel</button>
                            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600 hover:scale-105">Submit</button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default RemoveEntryBtn;
