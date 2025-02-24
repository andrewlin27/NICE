import React from 'react'

const page = async ({ params } : { params:any }) => {
  // const response = await fetch(`/api/patient/${params.patientId}`)
  return (
    <div>patientId: {params.patientId}</div>
  )
}

export default page