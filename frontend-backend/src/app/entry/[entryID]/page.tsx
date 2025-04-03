import React from "react";
import { createClientServiceRoleKey } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Images from "@/components/Images";
import RemoveEntryBtn from "@/components/RemoveEntryBtn";

const Page = async ({ params }: { params: any }) => {

    interface Entry {
        entry_id: number;
        first_name: string;
        last_name: string;
        dob: string;
    }

    async function getEntry(entryID: string): Promise<Entry | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/entries/getEntryByID/${entryID}`, {
                cache: "no-store",
            });

            if (!response.ok) throw new Error("Could not find entry ID");

            const data: Entry[] = await response.json();
            return data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error("Error fetching entry:", error);
            return null;
        }
    }

    function calculateAge(dob: string): number {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
      
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      
        return age;
      }

    const prop = await params;
    const entry = await getEntry(prop.entryID);
    
    
    if (!entry) return notFound();
    const age = await calculateAge(entry.dob);
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-900">
                {entry.first_name} {entry.last_name}
            </h1>
            <p className="text-lg text-gray-600">Age: {age}</p>

            <Images entryID={prop.entryID} />
            <RemoveEntryBtn entryId={prop.entryID} first_name={entry.first_name} last_name={entry.last_name}/>
        </div>
    );
};

export default Page;
