'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import SortEntryBtn from './SortEntryBtn';

interface Entry {
    entry_id: number;
    first_name: string;
    last_name: string;
}

interface SearchResultsProps {
    refresh: boolean;
  }  

const SearchResults: React.FC<SearchResultsProps> = ({ refresh }) => {
    const [allEntries, setAllEntries] = useState<Entry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchAllEntries = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getAllEntries`, {
                cache: 'no-store',
            });
            const data = await res.json();

            if (res.ok) {
                setAllEntries(data);
                setFilteredEntries(data);
            } else {
                console.error('Error fetching entries:', data.error);
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
        setLoading(false);
    };

    const fuse = useMemo(() => {
        return new Fuse(allEntries, {
            keys: ['first_name', 'last_name'],
            threshold: 0.3, // adjust fuse here
        });
    }, [allEntries]);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim() === '') {
                setFilteredEntries(allEntries);
            } else {
                const results = fuse.search(searchTerm);
                const filtered = results.map((result) => result.item);
                setFilteredEntries(filtered);
            }
        }, 200);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, fuse, allEntries]);

    useEffect(() => {
        fetchAllEntries();
    }, [refresh]);

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex w-full">
                <div className='relative w-[85%]'>
                    <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-800"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                        />
                    </svg>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name i.e. Jane Doe"
                        className="mb-4 p-2 pl-10 border border-gray-300 rounded-md w-full text-black"
                    />
                </div>
                <SortEntryBtn
                    allEntries={allEntries}
                    setAllEntries={setAllEntries}
                />
            </div>


            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : filteredEntries.length === 0 ? (
                <p className="text-center text-gray-600">No entries available.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredEntries.map((entry) => (
                        <li key={entry.entry_id} className="p-4 border-b border-gray-300">
                            <Link
                                href={`/entry/${entry.entry_id}`}
                                className="block text-lg font-semibold text-black hover:underline"
                            >
                                {entry.first_name} {entry.last_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
