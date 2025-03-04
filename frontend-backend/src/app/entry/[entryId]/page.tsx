import React from 'react';

const page = async ({ params }: { params: { entryId: string } }) => {
  // Fetch data from the API using the entryId from params
  const entryId = params?.entryId;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/getEntryByID/${entryId}`);
  const data = await response.json(); // Assuming the API returns JSON

  if (!response.ok) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <h1>Entry ID: {entryId}</h1>
      <div>
        {/* Render the fetched data here */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default page;
