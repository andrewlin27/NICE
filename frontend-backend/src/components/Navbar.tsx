import React from 'react'

const Navbar = () => {
  return (
    <div>
        <ul className='flex justify-center'>
            <li className='font-bold text-lg py-2 px-4'>Home</li>
            <li className='font-bold text-lg py-2 px-4'>Entry</li>
            <li className='font-bold text-lg py-2 px-4'>Other</li>
        </ul>
        <hr/>
    </div>
  )
}

export default Navbar