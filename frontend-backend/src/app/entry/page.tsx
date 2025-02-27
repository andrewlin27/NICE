import React from 'react'

const EntryPage = async () => {

    // insert a new entry
    async function addEntry() {
        const newEntry = {
            first_name: "William",
            last_name: "Wu",
            age: 21,
            physician_id: 1,
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

    return (
        <div>EntryPage</div>
    )
}


export default EntryPage