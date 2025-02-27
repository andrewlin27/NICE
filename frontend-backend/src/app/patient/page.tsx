import React from 'react'

const PatientPage = async () => {

    // insert a new patient
    async function addPatient() {
        const newPatient = {
          first_name: "William",
          last_name: "Wu",
          age: 21,
          physician_id: 1,
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/patients/addPatient`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPatient),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Inserted patient:", data);
            }
            else {
                const errorData = await response.json();
                console.error("Error from API:", errorData);
                alert(`Error: ${errorData.error}`);
            }
        }
        catch(error) {
            console.error("Error posting patient:", error);
        }
      }
}


export default PatientPage