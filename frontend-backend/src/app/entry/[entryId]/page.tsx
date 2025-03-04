import React from 'react';

const page = async ({ params }: { params: { entryID: string } }) => {
  // Fetch data from the API using the entryId from params
  const prop = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getEntryByID/${prop.entryID}`);
  const data = await response.json(); 

  if (!response.ok) {
    return <div>Failed to load entry</div>;
  }

  return (
    <div>
      <h1>Entry ID: {prop.entryID}</h1>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default page;
