import React from 'react';

const page = async ({ params }: { params: { entryID: string } }) => {
  // Fetch data from the API using the entryId from params
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getEntryByID/${params.entryID}`);
  const entry = await response.json(); 

  if (!response.ok) {
    // Display custom error message when entry is not found
    return <div>{entry.error}</div>;
  }

  return (
    <div>
      <h1>Entry ID: {params.entryID}</h1>
      <div>
        <pre>{JSON.stringify(entry, null, 2)}</pre>
      </div>
    </div>
  );
};

export default page;
