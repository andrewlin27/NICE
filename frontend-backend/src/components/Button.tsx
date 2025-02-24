"use client"
import React from 'react'
import { useState } from 'react'

const Button = () => {

    const [state, setState] = useState(false);

    const handleClick = () => {
        setState(!state);
    }

    return (
        <div>
            <button onClick={handleClick} className='bg-red-500 hover:bg-red-700 text-white'>
                {state ? 'ON' : 'OFF'}
            </button>
        </div>
    )
}

export default Button