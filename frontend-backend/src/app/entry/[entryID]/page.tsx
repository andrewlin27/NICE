import React from "react";
import { createClientServiceRoleKey } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: any }) => {

    interface Entry {
        entry_id: number;
        first_name: string;
        last_name: string;
        age: number;
    }

    interface Report {
        status: string;
        results: {
            confidence: number;
        };
    }

    interface Image {
        image_link: string;
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

    async function getReport(): Promise<Report | null> {
        try {
            const response = await fetch(`${process.env.FLASK_PUBLIC_BASE_URL}/scan_analysis`, {
                method: "POST",
                cache: "no-store",
            });

            // if (!response.ok) throw new Error("Could not get report")

            const data: Report = await response.json();
            return data
        } catch (error) {
            console.error("Error fetching report:", error);
            return null;
        }
    }

    // fetching image links
    async function getImages(entryID: string): Promise<Image[]> { {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/images/getImagesByEntryID/${entryID}`, {
                cache: "no-store",
            });

            if (!response.ok) throw new Error("Could not find entry ID");

            const data: Image[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
            
        }
    }}       

    const prop = await params;
    const entry = await getEntry(prop.entryID);
    const report = await getReport();
    const images = await getImages(prop.entryID);

    if (!entry) return notFound();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="max-w-lg bg-white p-6 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    {entry.first_name} {entry.last_name}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {images.length > 0 ? (
                        images.map((img, index) => (
                        <img
                            key={index}
                            src={img.image_link}
                            alt={img.image_link}
                            className="max-h-40 w-auto border rounded-lg shadow-md"
                        />
                        ))
                    ) : (
                        <p className="text-gray-600">No images available</p>
                    )}
                </div>
                <p className="mt-2 text-lg text-gray-600">Age: {entry.age}</p>
                <p className="mt-2 text-lg text-gray-600">Status: {report?.status}</p>
                <p className="mt-2 text-lg text-gray-600">Indication: {"N/A"}</p>
                <p className="mt-2 text-lg text-gray-600">Indication Confidence: {report?.results.confidence}</p>
            </div>
        </div>
    );
};

export default Page;
