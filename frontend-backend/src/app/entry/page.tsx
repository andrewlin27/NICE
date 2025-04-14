'use client';

import React, { useState } from 'react';
import SearchResults from "@/components/SearchResults";
import AddEntryBtn from "@/components/AddEntryBtn";
import React, { useEffect, useState } from 'react';


const EntryPage = () => {
    const [refresh, setRefresh] = useState(false);

    const handleEntryAdded () => {
        setRefresh((prev) => !prev);
    }
    return (
        <div className="min-h-screen p-6">
           <div className="flex justify-between items-center mt-3 mb-5 relative">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 absolute left-1/2 transform -translate-x-1/2">
                    Entries
                </h1>
                <div className="ml-auto">
                    <AddEntryBtn onEntryAdded={fetchAllEntries} />
                </div>
            </div>
            
            <SearchResults entries={entries}/>
        </div>
    );
};


export default EntryPage