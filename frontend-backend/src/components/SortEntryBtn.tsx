import React, { useState } from 'react';
import Button from './Button';

interface Entry {
    entry_id: number;
    first_name: string;
    last_name: string;
}

interface SortEntryBtnProps {
    allEntries: Entry[];
    setAllEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

const SortEntryBtn = ({ allEntries, setAllEntries }: SortEntryBtnProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sortBy, setSortBy] = useState('first_name');
    const [ascending, setAscending] = useState(true);

    const handleSort = () => {
        const sortedEntries = [...allEntries].sort((a, b) => {
            let valueA = a[sortBy as keyof Entry];
            let valueB = b[sortBy as keyof Entry];

            if (ascending) {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            }
        });

        setAllEntries(sortedEntries);
        setIsOpen(false);
    };

    return (
        <div>
            <Button variant="primary" className="ml-4 flex items-center justify-center space-x-2" onClick={() => setIsOpen(!isOpen)}>
                <span>Sort</span>
                <svg className="w-5 h-5 text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25" />
                </svg>
            </Button>
            {isOpen && (
                <div className="absolute bg-slate-300 mt-1 p-4 shadow-lg rounded-md boarder-solid">
                    <h3 className="mb-2 text-black">Sort By:</h3>
                    {['first_name', 'last_name'].map((option) => (
                        <label key={option} className="block mb-2 text-black">
                            <input
                                type="radio"
                                value={option}
                                checked={sortBy === option}
                                onChange={() => setSortBy(option)}
                                className="mr-2"
                            />
                            {option.replace('_', ' ')}
                        </label>
                    ))}
                    <label className="flex items-center mb-4">
                        <span className="mr-2 text-black">Ascending</span>
                        <input
                            type="checkbox"
                            checked={ascending}
                            onChange={() => setAscending((prev) => !prev)}
                        />
                    </label>
                    <Button 
                        variant="primary"
                        onClick={handleSort}>Apply
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SortEntryBtn;
