"use client";
import { useState, useEffect } from "react";

export default function Images({ entryID }: { entryID: string }) {

    interface Report {
        status: string;
        results: {
            confidence: number;
        };
    }

    interface Image {
        image_link: string;
    }

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [images, setImages] = useState<Image[]>([]);
    const [reports, setReports] = useState<Record<string, Report | null>>({});

    const getImages = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/getImagesByEntryID/${entryID}`);
            const data: Image[] = await res.json();
            setImages(data);
        } catch (err) {
            console.error("Failed to fetch images:", err);
        }
    };

    const getReport = async (imageUrl: string) => {
        try {
            const res = await fetch(`${process.env.FLASK_PUBLIC_BASE_URL}/scan_analysis`, {
                method: "POST",
                body: JSON.stringify({ image_url: imageUrl }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const report: Report = await res.json();
            setReports((prev) => ({ ...prev, [imageUrl]: report }));
        } catch (err) {
            console.error("Failed to fetch report for image:", imageUrl);
            setReports((prev) => ({ ...prev, [imageUrl]: null }));
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        setUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/uploadImage/${entryID}`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (response.ok) {
                setMessage("File uploaded successfully!");
                await getImages();
            } else {
                setMessage(result.error || "File upload failed.");
            }
        } catch (error) {
            setMessage("An error occurred.");
            console.error("Upload error:", error);
        }

        setUploading(false);
        setFile(null);
    };

    useEffect(() => {
        getImages();
    }, []);

    useEffect(() => {
        images.forEach((img) => {
            if (!reports[img.image_link]) {
                getReport(img.image_link);
            }
        });
    }, [images]);

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 my-5">
                <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded" />
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    {uploading ? "Uploading..." : "Upload Image"}
                </button>
                {message && <p className="text-gray-600">{message}</p>}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8">
                {images.length > 0 ? (
                    images.map((img, index) => (
                        <div className="flex flex-col items-center max-w-lg bg-white p-6 rounded-lg shadow-md text-center" key={index}>
                            <img
                                src={img.image_link}
                                alt={`Scan ${index + 1}`}
                                className="max-h-40 w-auto border rounded-lg shadow-md"
                            />
                            <p className="mt-2 text-lg text-gray-600">Status: {reports[img.image_link]?.status ?? "Loading..."}</p>
                            <p className="mt-2 text-lg text-gray-600">Indication: {"N/A"}</p>
                            <p className="mt-2 text-lg text-gray-600">Indication Confidence: {reports[img.image_link]?.results.confidence ?? "Loading..."}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No images available</p>
                )}
            </div>
        </div>

    );
}
