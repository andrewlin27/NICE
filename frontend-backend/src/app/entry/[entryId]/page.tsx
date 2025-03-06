import React from "react";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: any }) => {

    interface Entry {
        entry_id: number;
        first_name: string;
        last_name: string;
        age: number;
    }

    async function getEntry(entryId: string): Promise<Entry | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/entries/getEntryByID/${entryId}`, {
                cache: "no-store",
            });

            if (!response.ok) throw new Error("Could not find entryId");

            const data: Entry[] = await response.json();
            return data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error("Error fetching entry:", error);
            return null;
        }
    }

    const prop = await params;
    const entry = await getEntry(prop.entryId);
    
    if (!entry) return notFound();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="max-w-lg bg-white p-6 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    {entry.first_name} {entry.last_name}
                </h1>
                <p className="mt-2 text-lg text-gray-600">Age: {entry.age}</p>
            </div>
        </div>
    );
};

export default Page;
