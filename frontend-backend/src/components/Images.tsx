"use client";
import { useState, useEffect } from "react";
import Button from "./Button";

export default function Images({ entryID }: { entryID: string }) {

    interface Report {
        condition_prediction: string;
        results: {
            confidence_glioma: number;
            confidence_meningioma: number;
            confidence_non_tumorous: number;
            confidence_pituitary: number;
        };
    }

    interface Image {
        image_id: number;
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
            const imageResponse = await fetch(imageUrl);
            const blob = await imageResponse.blob();
            const file = new File([blob], "scan.jpg", { type: blob.type });

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_URL}scan_analysis`, {
                method: "POST",
                body: formData,
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

    const handleDeleteImage = async (imageId: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this image?");
        if (!confirmed) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/removeImageByImageID/${imageId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                setImages((prev) => prev.filter((img) => img.image_id !== imageId));
                setMessage("Image deleted successfully!");
            } else {
                setMessage(result.error || "Image deletion failed.");
            }
        }
        catch (error) {
            setMessage("An error occurred while deleting the image.");
            console.error("Delete error:", error);
        }
    };

    useEffect(() => {
        getImages();
    }, []);

    useEffect(() => {
        if (Array.isArray(images)) {
            images.forEach((img) => {
                if (!reports[img.image_link]) {
                    getReport(img.image_link);
                }
            });
        }
    }, [images]);

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-4 my-5">
                <div className="flex flex-row">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 mr-4 rounded text-black" />
                    <Button
                        variant="basic"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex items-center justify-center space-x-1"
                    >
                        <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01" />
                        </svg>
                        <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                    </Button>
                </div>
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
                            <button
                                onClick={() => handleDeleteImage(img.image_id)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                            >
                                Delete Image
                            </button>
                            <p className="mt-2 text-lg text-gray-600 underline font-bold">Confidence Levels</p>
                            <p className="mt-0 text-lg text-gray-600">Glioma: {reports[img.image_link]?.results.confidence_glioma ?? "Loading..."}</p>
                            <p className="mt-2 text-lg text-gray-600">Meningioma: {reports[img.image_link]?.results.confidence_meningioma ?? "Loading..."}</p>
                            <p className="mt-2 text-lg text-gray-600">Non-tumerous: {reports[img.image_link]?.results.confidence_non_tumorous ?? "Loading..."}</p>
                            <p className="mt-2 text-lg text-gray-600">Pituitary: {reports[img.image_link]?.results.confidence_pituitary ?? "Loading..."}</p>
                            <p className="mt-6 text-lg text-gray-600">Condition Prediction: {reports[img.image_link]?.condition_prediction ?? "Loading..."}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No images available</p>
                )}
            </div>
        </div>

    );
}
