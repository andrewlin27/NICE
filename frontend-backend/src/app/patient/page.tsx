import React from 'react'

const PatientPage = async () => {

    async function getPatient() {
        // these endpoints will be called in server-side
        const response = await fetch('http://localhost:3000/api/exampleEndpoint', {
            method:"GET",
        });
        return response.json()
    }

    async function postPatient(data: any) {
        const response = await fetch('http://localhost:3000/api/exampleEndpoint', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        return await response.json()
    }

    
    const responseData = await getPatient();

    const postData = {
        name: "John Doe",
        age: 30,
    }
    const postResponse = await postPatient(postData);

    return (
        <div>
            <p>{responseData.message}</p>
            <p>{postResponse.message}</p>
        </div>
    )
}

export default PatientPage