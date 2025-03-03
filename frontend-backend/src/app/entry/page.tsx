import React from 'react'

const EntryPage = async () => {

    // insert a new entry
    async function addEntry() {
        const newEntry = {
            first_name: "Eric",
            last_name: "Burns",
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
    
    const searchTerm = "eric";

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
      
    //addEntry();
    // fetchEntriesByName();

    return (
        <div>
            <h1>Entries</h1>
        </div>
    )
}


export default EntryPage