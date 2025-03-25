"use client";

import React, { useState, useEffect} from 'react'
import Link from 'next/link';


interface Entry {
    entry_id: number;
    first_name: string;
    last_name: string;
    age: number;
}

const EntryPage = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            let url = "";
            let options = {};

            if (searchTerm) {
                url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getEntryByName`;
                options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ searchTerm }),
                };
            }
            else {
                url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getAllEntries`;
                options = { cache : "no-store" };
            }

            const repsonse = await fetch(url, options);
            const data = await repsonse.json();

            if (repsonse.ok) {
                setEntries(data);
            } else {
                console.error("Error fetching entries:", data.error);
            }
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchEntries();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Entries</h1>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <input 
                type = "text"
                value = {searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name i.e. Jane Doe"
                className='mb-4 p-2 border border-gray-300 rounded-md w-full text-black'
                />

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : entries.length === 0 ? (
                    <p className="text-center text-gray-600">No entries available.</p>
                ) : (
                    <ul className="space-y-4">
                        {entries.map((entry) => (
                            <li key={entry.entry_id} className="p-4 border-b border-gray-300">
                                <Link href={`/entry/${entry.entry_id}`} className="block text-lg font-semibold text-blue-600 hover:underline">
                                    {entry.first_name} {entry.last_name} (Age: {entry.age})
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};


export default EntryPage