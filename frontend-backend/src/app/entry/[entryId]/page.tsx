import React from 'react'

const page = async ({ params } : { params:any }) => {
  // const response = await fetch(`/api/entry/${params.entryId}`)
  return (
    <div>entryId: {params.entryId}</div>
  )
}

export default page