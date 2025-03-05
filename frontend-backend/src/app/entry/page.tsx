import React from 'react'
import Link from 'next/link';

const EntryPage = async () => {

    interface Entry {
        entry_id: number;
        first_name: string;
        last_name: string;
        age: number;
    }

    async function getAllEntries(): Promise<Entry[]> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getAllEntries`, {
                cache: "no-store", // Ensure fresh data 
            });

            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Failed to fetch entries");
            }
        } 
        catch (error) {
            console.error("Error fetching entries:", error);
            return [];
        }
    }

    // insert a new entry
    async function addEntry() {
        const newEntry = {
            first_name: "John",
            last_name: "Jones",
            age: 21,
            user_id: 1,
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/addEntry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEntry),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Inserted entry:", data);
            }
            else {
                const errorData = await response.json();
                console.error("Error from API:", errorData);
                alert(`Error: ${errorData.error}`);
            }
        }
        catch (error) {
            console.error("Error posting entry:", error);
        }
    }

    const searchTerm = "john";

    const fetchEntriesByName = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getEntryByName`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ searchTerm }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Fetched entries:", data);
        } else {
            console.error("Error fetching entries:", data.error);
        }
    };

    // addEntry();
    // fetchEntriesByName();

    const entries = await getAllEntries();
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Entries</h1>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                {entries.length === 0 ? (
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
    )
}


export default EntryPage