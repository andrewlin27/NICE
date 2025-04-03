import SearchResults from "@/components/SearchResults";
import AddEntryBtn from "@/components/AddEntryBtn";

const EntryPage = () => {
    return (
        <div className="min-h-screen p-6">
           <div className="flex justify-between items-center mt-3 mb-5 relative">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 absolute left-1/2 transform -translate-x-1/2">
                    Entries
                </h1>
                <div className="ml-auto">
                    <AddEntryBtn />
                </div>
            </div>
            
            <SearchResults />
        </div>
    );
};


export default EntryPage