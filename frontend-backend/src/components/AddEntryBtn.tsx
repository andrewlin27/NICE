'use client';

import React, { use, useState } from 'react';
import Button from './Button';

const AddEntryBtn: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    user_id: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/entries/addEntry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      alert('Entry added successfully!');
      setIsOpen(false);
      setFormData({ first_name: '', last_name: '', dob: '', user_id: '' });
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setIsOpen(true)} className="ml-4 flex items-center justify-center space-x-2">
        <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <span>Add Entry</span>

      </Button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-2xl mb-4 text-black">Add New Entry</h2>
            {Object.keys(formData).map((key) => (
              <div key={key} className="mb-2">
                <label className="text-slate-800 block font-medium capitalize">{key.replace('_', ' ')}:</label>
                <input
                  type={key === 'dob' ? 'date' : 'text'}
                  name={key}
                  value={formData[key as keyof typeof formData]}
                  onChange={handleChange}
                  className="border p-2 w-full rounded text-slate-800"
                />
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <Button variant="danger" className="mr-2" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button variant="secondary" onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEntryBtn;
