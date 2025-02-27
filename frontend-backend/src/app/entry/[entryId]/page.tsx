import React from 'react'

const page = async ({ params } : { params:any }) => {
  // const response = await fetch(`/api/entry/${params.entryId}`)
  const prop = await params
  return (
    <div>entryId: {prop.entryId}</div>
  )
}

export default page