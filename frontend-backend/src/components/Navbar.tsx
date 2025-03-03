import React from 'react'
import Link from 'next/link';

const Navbar = () => {
  return (
    <div>
        <ul className='flex justify-center'>
            <li className='font-bold text-lg py-2 px-4'><Link href='/'>Home</Link></li>
            <li className='font-bold text-lg py-2 px-4'><Link href='/entry'>Entries</Link></li>
            <li className='font-bold text-lg py-2 px-4'>Other</li>
        </ul>
        <hr/>
    </div>
  )
}

export default Navbar