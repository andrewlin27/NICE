"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation'; // Import useParams


const Page  = () => {
  const [entry, setEntry] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Unwrap params using useParams hook
  const params = useParams();
  
  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getEntryByID/${params.entryID}`
        );
        const entry = await response.json();

        if (!response.ok) {
          setError(entry.error || "Failed to load entry");
        } else {
          setEntry(entry);
        }
      } catch (err) {
        setError("Something went wrong.");
      }
      setLoading(false);
    };

    fetchEntry();
  }, [params.ntryID]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Entry ID: {params.entryID}</h1>
      <div>
        <pre>{JSON.stringify(entry, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Page;
